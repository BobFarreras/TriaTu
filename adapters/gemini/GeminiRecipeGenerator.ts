import { GoogleGenAI } from "@google/genai";
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// DTO per validar la resposta JSON (Strict Type)
interface RawRecipeDTO {
  name?: string;
  ingredients?: { name?: string; quantity?: number; unit?: string }[];
  steps?: string[];
  tags?: string[];
  prepTimeMinutes?: number;
}

// ✅ INTERFÍCIE LOCAL PER EVITAR 'ANY':
// Defineix l'estructura mínima que necessitem llegir, acceptant que 'text' 
// pot ser string, funció o undefined segons la versió de l'SDK.
interface SafeGeminiResponse {
  text?: string | (() => string);
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export class GeminiRecipeGenerator implements RecipeGenerator {
  private client: GoogleGenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generate(inventory: InventoryItemProps[], restrictions: DietaryRestriction[]): Promise<Recipe[]> {
    try {
      const inventoryText = inventory
        .map(i => `- ${i.name} (${i.quantity} ${i.unit})`)
        .join('\n');
      const restrictionsText = restrictions.length > 0 ? restrictions.join(', ') : "Cap";

      const prompt = `
        Ets un xef expert. Genera 3 receptes.
        INVENTARI: ${inventoryText}
        RESTRICCIONS: ${restrictionsText}
        FORMAT JSON (Array):
        [{ "name": "...", "ingredients": [{"name":"...", "quantity": 1, "unit":"ut"}], "steps": ["..."], "tags": ["..."], "prepTimeMinutes": 20 }]
      `;

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json', temperature: 0.2 }
      });

      // ✅ EXTRACCIÓ SEGURA SENSE 'ANY'
      // 1. Convertim a 'unknown' per trencar el tipatge estricte de la llibreria que donava errors
      // 2. Convertim a la nostra interfície segura 'SafeGeminiResponse'
      const safeResponse = response as unknown as SafeGeminiResponse;
      
      let text: string | undefined;

      // Opció A: Intentem cridar-ho com a funció (Estàndard SDK)
      if (typeof safeResponse.text === 'function') {
         try { text = safeResponse.text(); } catch (e) { console.log(e) /* Ignorem errors i provem següent mètode */ }
      }

      // Opció B: Intentem accedir com a propietat (Fallback versions anteriors/mocks)
      if (!text && typeof safeResponse.text === 'string') {
         text = safeResponse.text;
      }

      // Opció C: Accés profund als candidates (Fallback manual)
      if (!text && safeResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
        text = safeResponse.candidates[0].content.parts[0].text;
      }

      if (!text) return [];

      const cleanJson = text.replace(/```json|```/g, '').trim();
      const parsedData: unknown = JSON.parse(cleanJson);

      if (!Array.isArray(parsedData)) return [];

      return parsedData
        .map((item: unknown): Recipe | null => {
          if (typeof item !== 'object' || item === null) return null;
          const raw = item as RawRecipeDTO; // Narrowing

          try {
            if (!raw.name || typeof raw.name !== 'string') return null;

            const recipe = new Recipe({
              id: crypto.randomUUID(),
              name: raw.name,
              ingredients: Array.isArray(raw.ingredients) 
                ? raw.ingredients.map(ing => ({
                    name: String(ing.name || 'Ingredient'),
                    quantity: Number(ing.quantity) || 0,
                    unit: String(ing.unit || 'ut')
                  }))
                : [],
              steps: Array.isArray(raw.steps) ? raw.steps.map(String) : [],
              tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
              prepTimeMinutes: Number(raw.prepTimeMinutes) || undefined
            });

            if (!recipe.isSafeFor(restrictions)) {
                return null;
            }
            return recipe;
          } catch (e) {
            console.error("Error mapejant recepta:", e);
            return null;
          }
        })
        .filter((r): r is Recipe => r !== null);

    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }
}