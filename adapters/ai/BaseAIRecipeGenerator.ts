// src/core/services/BaseAIRecipeGenerator.ts

import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { GenerationContext } from '@/core/domain/types/GenerationContext';
import { EmojiMatcherService } from '@/core/services/EmojiMarcherService';

// DTO Intern: Contracte de dades que esperem de la IA
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

// Extensió local per satisfer el tipatge de preus (Patch temporal dins l'adapter)
interface ProductWithPrice {
  price?: number;
}

export abstract class BaseAIRecipeGenerator implements RecipeGenerator {

  async generate(ctx: GenerationContext): Promise<Recipe[]> {
    console.log(`\n🤖 [AI START] Generant ${ctx.count} receptes...`);

    // 🔍 DEBUG 1: Estat de l'inventari entrant
    console.log("🔍 [CTX INVENTORY] Primer ítem (exemple):", ctx.inventory[0] ? {
      name: ctx.inventory[0].name,
      id: ctx.inventory[0].id,
      price: ctx.inventory[0].price || "N/A ⚠️",
      image: ctx.inventory[0].image ? "Sí" : "No"
    } : "Inventari buit");

    const prompt = this.buildPrompt(ctx);

    try {
      // 1. Cridada a la infraestructura (Gemini/OpenAI)
      const rawJsonString = await this.callAIModel(prompt, ctx.focusDish);

      if (!rawJsonString) throw new Error("Resposta buida del model");

      // 🔍 DEBUG 2: STRING EN CRU (RAW)
      // Això ens mostra exactament què ha escupit la IA abans de fer cap parse
      console.log("🔍 [DEBUG RAW JSON] String rebut de la IA:\n", rawJsonString.substring(0, 500) + "...");

      const dtos = this.parseResponse(rawJsonString);

      // 🔍 DEBUG 3: OBJECTE PARSEJAT COMPLET
      // Això mostra l'estructura final que entra al domini
      if (dtos.length > 0) {
        console.log("🔍 [DEBUG PARSED DTO] Estructura completa (Recepta 1):", JSON.stringify(dtos[0], null, 2));
      } else {
        console.warn("⚠️ [DEBUG PARSED DTO] El JSON era vàlid però no contenia receptes.");
      }

      // 2. Mapping a Domini
      return dtos.map(dto => this.mapToDomain(dto, ctx)).filter((r): r is Recipe => r !== null);

    } catch (e) {
      console.error("❌ Error crític al Generador:", e);
      throw e;
    }
  }

  protected abstract callAIModel(prompt: string, focusDish?: string): Promise<string | null>;
  protected abstract getModelName(): string;

  private buildPrompt(ctx: GenerationContext): string {
    const inventoryList = ctx.inventory.map(i => {
      const cleanName = i.name.replace(/"/g, '').trim();
      return `- [ID: "${i.id}"] ${cleanName} (${i.quantity} ${i.unit})`;
    }).join('\n');

    return `
      Ets un xef expert.
      OBJECTIU: Crear ${ctx.count} receptes.
      
      INVENTARI REAL (Fes servir aquests IDs per vincular productes):
      ${inventoryList || "(Buit)"}
      
     ⚠️ RESTRICCIONS USUARI (Important): ${ctx.restrictions.join(', ') || "Cap"}
      IDIOMA: ${ctx.language || 'Català'}.
      
      ⚠️ INSTRUCCIONS IMPORTANTS:
      1. Si fas servir un ingredient de la llista, COPIA EL SEU "ID" EXACTE al camp "id".
      2. Si és un ingredient nou (sal, oli, aigua...), posa "id": null.
      3. Genera "tags" i "steps" sempre.
      
      FORMAT JSON OBLIGATORI:
      {
        "recipes": [
          {
            "name": "Nom del plat",
            "prep_time_minutes": 20,
            "tags": ["fàcil"],
            "ingredients": [
                { "id": "UUID_DEL_INVENTARI_O_NULL", "name": "Nom", "quantity": 1, "unit": "ut" }
            ],
            "steps": ["Pas 1", "Pas 2"]
          }
        ]
      }
    `;
  }

  private parseResponse(jsonString: string): AIRecipeDTO[] {
    try {
      // Neteja típica de Markdown ```json ... ```
      const cleanJson = jsonString.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return parsed.recipes || [];
    } catch (e) {
      console.error("❌ [JSON PARSE ERROR] No s'ha pogut parsejar:", e, jsonString);
      return [];
    }
  }

  private mapToDomain(dto: AIRecipeDTO, ctx: GenerationContext): Recipe | null {
    try {
      console.log(`\n🏭 [MAPPER] Processant recepta: "${dto.name}"`);

      const inventoryMapById = new Map(ctx.inventory.map(i => [i.id, i]));
      const inventoryMapByName = new Map(ctx.inventory.map(i => [i.name.toLowerCase().trim(), i]));

      let safeSteps = dto.steps;
      if (!safeSteps?.length) safeSteps = ["Preparar ingredients.", "Cuinar.", "Servir."];

      const mappedIngredients = dto.ingredients.map(aiIng => {
        let finalId = crypto.randomUUID();
        let finalName = aiIng.name;
        let finalEmoji = '🥘';

        let linkedProductId: string | null = null;
        let linkedProductImage: string | null = null;
        let estimatedCost = 0;

        let foundProduct = undefined;
        let matchMethod = "CAP";

        // A) Per ID exacte
        if (aiIng.id && inventoryMapById.has(aiIng.id)) {
          foundProduct = inventoryMapById.get(aiIng.id);
          matchMethod = "ID_EXACTE";
        }

        // B) Per Nom
        if (!foundProduct) {
          const searchName = aiIng.name.toLowerCase().trim();
          foundProduct = inventoryMapByName.get(searchName);
          if (foundProduct) matchMethod = "NOM_EXACTE";

          if (!foundProduct && searchName.length > 3) {
            foundProduct = ctx.inventory.find(p => {
              const pName = p.name.toLowerCase();
              return pName.includes(searchName) || searchName.includes(pName);
            });
            if (foundProduct) matchMethod = "NOM_PARCIAL";
          }
        }

        if (foundProduct) {
          finalId = foundProduct.id;
          finalName = foundProduct.name;
          finalEmoji = foundProduct.emoji || '📦';
          linkedProductId = foundProduct.id || null;
          linkedProductImage = foundProduct.image || null;

          const productWithPrice = foundProduct as unknown as ProductWithPrice;
          const price = productWithPrice.price || 0;

          if (price > 0) {
            if (aiIng.unit === foundProduct.unit && foundProduct.quantity > 0) {
              estimatedCost = (aiIng.quantity / foundProduct.quantity) * price;
            } else {
              estimatedCost = price / 4;
            }
          }
          console.log(`   ✅ MATCH [${matchMethod}]: "${aiIng.name}" -> "${foundProduct.name}" (ID: ${linkedProductId}) | Cost: ${estimatedCost.toFixed(2)}€`);
        } else {
          const preset = EmojiMatcherService.match(aiIng.name);
          if (preset) {
            finalId = preset.id;
            finalEmoji = preset.emoji;
            finalName = aiIng.name;
          }
          console.log(`   ⚠️ NO MATCH: "${aiIng.name}"`);
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
      console.log(`   💰 COST TOTAL: ${totalCost.toFixed(2)}€`);

      const recipe = new Recipe({
        id: crypto.randomUUID(),
        authorId: 'ai-generated',
        name: dto.name.replace(/^(Recepta \d+:)\s*/i, "").trim(),
        prepTimeMinutes: Number(dto.prep_time_minutes) || 30,
        estimatedCost: totalCost,
        isAiGenerated: true,
        authorName: "✨ Chef IA",
        ingredients: mappedIngredients,
        steps: safeSteps,
        tags: dto.tags || ["recet", "ia"],
        dietaryTags: (dto.dietary_tags || []).map(t => t.toLowerCase()),
        createdAt: new Date(),
        likesCount: 0,
        isPublic: true,
        ratingSummary: { average: 0, count: 0, distribution: {} }
      });

      if (!recipe.isSafeFor(ctx.restrictions)) {
        console.warn(`   ⚠️ [SAFETY] Recepta descartada.`);
        return null;
      }
      return recipe;
    } catch (e) {
      console.error("❌ [MAPPING ERROR]:", e);
      return null;
    }
  }
}