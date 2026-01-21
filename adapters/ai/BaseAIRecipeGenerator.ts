import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { GenerationContext } from '@/core/domain/types/GenerationContext';
import { EmojiMatcherService } from '@/core/application/services/EmojiMatcherService';
import { PromptService } from '@/core/application/services/PromptService';
import { getRecipeChefPrompt, getRecipeFatePrompt, getRecipePromptVariables } from '@/core/prompts/recipe-prompts';

interface AIRecipeDTO {
  name: string;
  prep_time_minutes: number;
  ingredients: {
    id?: string;
    name: string;
    quantity: number;
    unit: string;
  }[];
  steps: string[];
  tags?: string[];
  dietary_tags?: string[];
}

// Interficie auxiliar per evitar 'any' quan busquem preus i imatges
interface InventoryProductMetadata {
    id: string;
    name: string;
    emoji?: string;
    image?: string | null;
    price?: number;
    // Per si ve de props
    props?: { image?: string | null };
}

export abstract class BaseAIRecipeGenerator implements RecipeGenerator {
  protected promptService?: PromptService;

  constructor(promptService?: PromptService) {
    this.promptService = promptService;
  }

  async generate(ctx: GenerationContext): Promise<Recipe[]> {
    console.log(`\n?? [AI START] Generating ${ctx.count} recipes...`);
    const prompt = await this.resolvePrompt(ctx);

    try {
      const rawJsonString = await this.callAIModel(prompt, ctx.focusDish);
      if (!rawJsonString) throw new Error("Empty model response");

      const dtos = this.parseResponse(rawJsonString);
      return dtos.map(dto => this.mapToDomain(dto, ctx)).filter((r): r is Recipe => r !== null);

    } catch (e) {
      console.error("? Generator Error:", e);
      throw e;
    }
  }

  protected abstract callAIModel(prompt: string, focusDish?: string): Promise<string | null>;
  protected abstract getModelName(): string;

  private async resolvePrompt(ctx: GenerationContext): Promise<string> {
    const variables = getRecipePromptVariables(ctx);
    const isChef = ctx.mode === 'CHEF';
    const promptName = isChef ? 'triatu-recipe-chef' : 'triatu-recipe-fate';

    if (this.promptService) {
      return this.promptService.getPrompt({
        name: promptName,
        variables,
        fallback: () => this.buildPrompt(ctx),
      });
    }

    return this.buildPrompt(ctx);
  }

  private buildPrompt(ctx: GenerationContext): string {
    return ctx.mode === 'CHEF' ? getRecipeChefPrompt(ctx) : getRecipeFatePrompt(ctx);
  }

  private parseResponse(jsonString: string): AIRecipeDTO[] {
    try {
      const cleanJson = jsonString.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson).recipes || [];
    } catch (e) { console.log(e); return []; }
  }

  private mapToDomain(dto: AIRecipeDTO, ctx: GenerationContext): Recipe | null {
    try {
      console.log(`\n?? [MAPPER] Processing: "${dto.name}"`);

      const inventoryMapById = new Map(ctx.inventory.map(i => [i.id, i]));
      const inventoryMapByName = new Map(ctx.inventory.map(i => [i.name.toLowerCase().trim(), i]));

      let safeSteps = dto.steps;
      if (!safeSteps?.length) safeSteps = ["Prepare ingredients.", "Cook.", "Serve."];

      const mappedIngredients = dto.ingredients.map(aiIng => {
        let finalId = crypto.randomUUID();
        let finalName = aiIng.name;
        let finalEmoji = '??';
        let linkedProductId: string | null = null;
        let linkedProductImage: string | null = null;
        let estimatedCost = 0;

        let foundProduct: InventoryProductMetadata | undefined = undefined;

        // 1. Cerca per ID
        if (aiIng.id && inventoryMapById.has(aiIng.id)) {
          // Casting segur gracies a la interfice
          foundProduct = inventoryMapById.get(aiIng.id) as unknown as InventoryProductMetadata;
        }

        // 2. Cerca per Nom
        if (!foundProduct) {
          const searchName = aiIng.name.toLowerCase().trim();
          const byName = inventoryMapByName.get(searchName);
          if (byName) {
             foundProduct = byName as unknown as InventoryProductMetadata;
          }

          if (!foundProduct && searchName.length > 3) {
            const fuzzy = ctx.inventory.find(p => {
              const pName = p.name.toLowerCase();
              return pName.includes(searchName) || searchName.includes(pName);
            });
            if (fuzzy) foundProduct = fuzzy as unknown as InventoryProductMetadata;
          }
        }

        if (foundProduct) {
          finalId = foundProduct.id;
          finalName = foundProduct.name;

          if (foundProduct.emoji && foundProduct.emoji !== '??') {
             finalEmoji = foundProduct.emoji;
          } else {
             const smartEmoji = EmojiMatcherService.match(foundProduct.name);
             if (smartEmoji) finalEmoji = smartEmoji.emoji;
          }

          linkedProductId = foundProduct.id || null;

          // SOLUCIO ERROR ANY: Acces tipat segur
          const rawImage = foundProduct.image || foundProduct.props?.image;

          if (rawImage && typeof rawImage === 'string' && rawImage.startsWith('http')) {
              linkedProductImage = rawImage;
          }

          const price = foundProduct.price || 0;
          if (price > 0) {
            // Simplificat per brevetat
             estimatedCost = price / 4;
          }
        } else {
          const preset = EmojiMatcherService.match(aiIng.name);
          if (preset) {
            finalId = preset.id;
            finalEmoji = preset.emoji;
            finalName = aiIng.name;
          }
        }

        return {
          id: finalId,
          name: finalName,
          quantity: Number(aiIng.quantity) || 1,
          unit: aiIng.unit || 'ut',
          emoji: finalEmoji,
          linkedProductId: linkedProductId || null,
          linkedProductImage: linkedProductImage || null,
          estimatedCost
        };
      });

      const totalCost = mappedIngredients.reduce((acc, i) => acc + (i.estimatedCost || 0), 0);

      // TAG FIX logic (igual que tenies)
      let finalTags = dto.tags || [];
      const finalDietaryTags = (dto.dietary_tags || []).map(t => t.toLowerCase());
      const dietaryKeywords = ['gluten', 'veg', 'lact', 'sucre', 'keto', 'paleo', 'peix', 'carn'];

      finalTags = finalTags.filter(tag => {
          const lowerTag = tag.toLowerCase();
          const isDietary = dietaryKeywords.some(kw => lowerTag.includes(kw));
          if (isDietary && !finalDietaryTags.includes(lowerTag)) {
              finalDietaryTags.push(lowerTag);
              return false;
          }
          return true;
      });

      const recipe = new Recipe({
        id: crypto.randomUUID(),
        authorId: 'ai-generated',
        name: dto.name.replace(/^(Recepta \d+:)\s*/i, "").trim(),
        prepTimeMinutes: Number(dto.prep_time_minutes) || 30,
        estimatedCost: totalCost,
        isAiGenerated: true,
        authorName: "? Chef IA",
        ingredients: mappedIngredients,
        steps: safeSteps,
        tags: finalTags,
        dietaryTags: finalDietaryTags,
        createdAt: new Date(),
        likesCount: 0,
        isPublic: true,
        ratingSummary: { average: 0, count: 0, distribution: {} }
      });

      if (!recipe.isSafeFor(ctx.restrictions)) {
        console.warn(`   ?? [SAFETY] Recipe discarded.`);
        return null;
      }
      return recipe;
    } catch (e) {
      console.error("? [MAPPING ERROR]:", e);
      return null;
    }
  }
}
