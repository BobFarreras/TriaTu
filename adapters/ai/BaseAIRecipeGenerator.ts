// core/infrastructure/ai/BaseAIRecipeGenerator.ts

import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';
import { AIRecipeDTO } from '@/core/ports/ai/types';

export abstract class BaseAIRecipeGenerator implements RecipeGenerator {
  
  async generate(
    inventory: InventoryItemProps[],
    restrictions: DietaryRestriction[],
    focusDish?: string,
    excludeNames?: string[],
    count: number = 4,
    language: string = 'ca' // ✅ NOU: Rebem l'idioma (per defecte català)
  ): Promise<Recipe[]> {
    
    console.log(`🤖 [AI Generator] Iniciant procés per a ${this.getModelName()} en idioma: ${language}...`);

    // Passem l'idioma al mètode privat
    const prompt = this.buildPrompt(inventory, restrictions, focusDish, excludeNames, count, language);

    try {
      const rawJsonString = await this.callAIModel(prompt, focusDish);

      if (!rawJsonString) {
        console.warn(`⚠️ [${this.getModelName()}] Resposta buida o nul·la.`);
        return [];
      }

      const dtos = this.parseResponse(rawJsonString);

      const recipes = dtos
        .map(dto => this.mapToDomain(dto, restrictions))
        .filter((r): r is Recipe => r !== null);

      console.log(`✅ [${this.getModelName()}] Generades ${recipes.length} receptes vàlides.`);
      return recipes;

    } catch (error) {
      console.error(`❌ [${this.getModelName()}] Error crític generant receptes:`, error);
      throw error;
    }
  }

  protected abstract callAIModel(prompt: string, focusDish?: string): Promise<string | null>;
  protected abstract getModelName(): string;

  // Helper per traduir codis ISO a instruccions clares per al LLM
  private getLanguageInstruction(code: string): string {
    const map: Record<string, string> = {
      'ca': 'CATALÀ IMPERATIU',
      'es': 'ESPAÑOL IMPERATIVO (Neutro)',
      'en': 'ENGLISH IMPERATIVE',
      'fr': 'FRANÇAIS'
    };
    // Si no trobem el codi, usem el codi directament en majúscules o fallback a català
    return map[code] || 'CATALÀ IMPERATIU';
  }

  private buildPrompt(
    inventory: InventoryItemProps[],
    restrictions: DietaryRestriction[],
    focusDish: string | undefined,
    excludeNames: string[] | undefined,
    count: number, // Aquest és el número clau (ex: 2)
    language: string
  ): string {
    const inventoryText = inventory.map(i => `- ${i.name} (${i.quantity} ${i.unit})`).join('\n');
    const restrictionsText = restrictions.length > 0 ? restrictions.join(', ') : "Cap";
    const langInstruction = this.getLanguageInstruction(language);

    // ✅ FIX: Construïm la tasca respectant SEMPRE el 'count'
    let taskDescription = `TASCA: Genera ${count} recepta/es creatives i variades.`;

    // Si hi ha un focus (nom del plat o descripció del xef), l'afegim com a REQUISIT, no com a limitador de quantitat.
    if (focusDish) {
      taskDescription += `\n🎯 ENFOCAMENT OBLIGATORI: Les receptes han d'encaixar amb: "${focusDish}".`;
      // Si és un plat específic (ex: "Canelons"), farà 2 variants.
      // Si és una descripció (ex: "Baixa energia"), farà 2 receptes que compleixin això.
    }

    if (excludeNames?.length) {
      taskDescription += `\n⛔ NO REPETEIXIS: ${excludeNames.join(', ')}.`;
    }

    return `
      Actua com un xef expert (Estrella Michelin) especialitzat en cuina d'aprofitament.
      
      ${taskDescription}
      
      INVENTARI DISPONIBLE:
      ${inventoryText}
      
      RESTRICCIONS ALIMENTÀRIES (CRÍTIC):
      ${restrictionsText}
      
      ⚠️ REGLES D'OR:
      1. Prioritza l'ús de l'inventari, però pots afegir bàsics.
      2. IDIOMA DE RESPOSTA: ${langInstruction}.
      3. FORMAT JSON PUR.
      4. Si demano més d'una recepta, assegura't que siguin diferents entre elles.

      ESTRUCTURA JSON ESPERADA: (Mantén les claus en anglès, tradueix els valors):
      {
        "recipes": [
          {
            "name": "Nom del plat (en ${language})",
            "ingredients": [{"name": "Ceba", "quantity": 1, "unit": "ut"}],
            "steps": ["Pas 1 (en ${language})...", "Pas 2..."],
            "tags": ["ràpid", "sa"],
            "dietary_tags": ["vegan", "gluten-free"],
            "prepTimeMinutes": 30
          }
        ]
      }
    `;
  }

  private parseResponse(jsonString: string): AIRecipeDTO[] {
    // ... (El mateix codi de sempre)
    try {
      const cleanJson = jsonString.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (!parsed.recipes || !Array.isArray(parsed.recipes)) {
        return [];
      }
      return parsed.recipes;
    } catch (e) {
      console.error(`⚠️ [${this.getModelName()}] Error parsejant JSON:`, e);
      return [];
    }
  }

  private mapToDomain(dto: AIRecipeDTO, restrictions: DietaryRestriction[]): Recipe | null {

    try {
        const recipe = new Recipe({
         
           id: crypto.randomUUID(),
           authorId: 'ai-generated',
           createdAt: new Date(),
           likesCount: 0,
           isPublic: false,
           name: dto.name,
           ingredients: dto.ingredients.map(i => ({
             name: i.name,
             quantity: Number(i.quantity),
             unit: i.unit
           })),
           steps: dto.steps,
           tags: dto.tags || [],
           prepTimeMinutes: Number(dto.prepTimeMinutes),
           dietaryTags: (dto.dietary_tags || []).map(t => t.toLowerCase()),
           ratingSummary: { average: 0, count: 0, distribution: {} }
        });
        
        if (!recipe.isSafeFor(restrictions)) return null;
        return recipe;
    } catch (e) {
      console.log(e)
        return null;
    }
  }
}