import OpenAI from "openai";
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// Reutilitzem la interfície DTO
interface RawRecipeDTO {
  name?: string;
  ingredients?: { name?: string; quantity?: number; unit?: string }[];
  steps?: string[];
  tags?: string[];
  prepTimeMinutes?: number;
}

export class OpenAIRecipeGenerator implements RecipeGenerator {
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY");
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generate(inventory: InventoryItemProps[], restrictions: DietaryRestriction[]): Promise<Recipe[]> {
    try {
      const inventoryText = inventory.map(i => `- ${i.name} (${i.quantity} ${i.unit})`).join('\n');
      const restrictionsText = restrictions.join(', ') || "Cap";

      const prompt = `
        Genera 3 receptes:
        ${inventoryText}
        Restriccions: ${restrictionsText}
        JSON array pur.
      `;

      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini", // ✅ FIX: Sense espai al final
        messages: [
            { role: "system", content: "Ets un nutricionista expert. Retorna només JSON." },
            { role: "user", content: prompt }
        ],
        temperature: 0.3,
      });

      const text = response.choices[0]?.message?.content;
      if (!text) return [];

      const cleanJson = text.replace(/```json|```/g, '').trim();
      
      // ✅ PAS CRÍTIC: unknown
      const parsedData: unknown = JSON.parse(cleanJson);

      if (!Array.isArray(parsedData)) return [];

      return parsedData.map((item: unknown): Recipe | null => {
         if (typeof item !== 'object' || item === null) return null;
         
         const raw = item as RawRecipeDTO;

         if (!raw.name || typeof raw.name !== 'string') return null;

         const recipe = new Recipe({
             id: crypto.randomUUID(),
             name: raw.name,
             ingredients: Array.isArray(raw.ingredients) 
                ? raw.ingredients.map(ing => ({
                    name: String(ing.name || ''), 
                    quantity: Number(ing.quantity) || 0, 
                    unit: String(ing.unit || 'ut')
                  })) 
                : [],
             steps: Array.isArray(raw.steps) ? raw.steps.map(String) : [],
             tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
             prepTimeMinutes: Number(raw.prepTimeMinutes) || undefined
         });
         
         if (!recipe.isSafeFor(restrictions)) return null;
         return recipe;
      }).filter((r): r is Recipe => r !== null);

    } catch (error) {
      console.error("OpenAI Error:", error);
      throw error;
    }
  }
}