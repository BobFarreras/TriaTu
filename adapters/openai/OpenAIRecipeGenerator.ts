import OpenAI from "openai";
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// DTO
interface RawRecipeResponse {
  recipes: {
    name: string;
    ingredients: { name: string; quantity: number; unit: string }[];
    steps: string[];
    tags: string[];
    prepTimeMinutes: number;
  }[];
}

export class OpenAIRecipeGenerator implements RecipeGenerator {
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.error("⛔ CRITICAL: Missing OPENAI_API_KEY");
      throw new Error("Missing OPENAI_API_KEY");
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generate(
    inventory: InventoryItemProps[], 
    restrictions: DietaryRestriction[], 
    focusDish?: string, 
    excludeNames?: string[]
  ): Promise<Recipe[]> {
    console.log("🔵 [OpenAI] Generant amb gpt-4o-mini..."); // Log per confirmar model

    try {
      const inventoryText = inventory.map(i => `- ${i.name} (${i.quantity} ${i.unit})`).join('\n');
      const restrictionsText = restrictions.length > 0 ? restrictions.join(', ') : "Cap";

      // ✅ PROMPT MILLORAT (Lògica Xef Expert + Estalvi Tokens)
      const instruction = `
        Ets un xef executiu expert.
        REGLES CRÍTIQUES:
        1. SELECCIÓ INTEL·LIGENT: NO usis tots els ingredients. Tria només els que combinen bé.
        2. EVITA "FRANKENSTEINS": Mai barregis ingredients incompatibles.
        3. BÀSICS IMPLÍCITS: Assumeix que l'usuari té: Sal, Oli, Vinagre, Pebre, Aigua.
        4. IDIOMA: Català.
        5. FORMAT: JSON pur amb clau "recipes".
      `;

      let task = "";
      if (focusDish) {
        task = `Genera 1 recepta per: "${focusDish}". Si falten ingredients crítics, busca substituts.`;
      } else {
        const exclusions = excludeNames?.length ? `NO incloguis: ${excludeNames.join(', ')}.` : "";
        task = `Genera 3 receptes creatives. ${exclusions}`;
      }

      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini", // ✅ MODEL ECONÒMIC
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: instruction },
            { role: "user", content: `INVENTARI:\n${inventoryText}\n\nRESTRICCIONS:\n${restrictionsText}\n\nTASCA:\n${task}\n\nJSON SCHEMA:\n{ "recipes": [{ "name": "...", "ingredients": [{"name":"...", "quantity":1, "unit":"ut"}], "steps": ["..."], "tags": ["..."], "prepTimeMinutes": 0 }] }` }
        ],
        temperature: 0.5,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return [];

      console.log("🔵 [OpenAI] Raw Response (inici):", content.substring(0, 50));

      const parsedData = JSON.parse(content) as RawRecipeResponse;
      
      if (!parsedData.recipes || !Array.isArray(parsedData.recipes)) {
        console.warn("⚠️ OpenAI: JSON vàlid però sense array 'recipes'");
        return [];
      }

      return parsedData.recipes.map(raw => {
        try {
            const recipe = new Recipe({
                id: crypto.randomUUID(),
                name: raw.name,
                ingredients: raw.ingredients.map(i => ({
                    name: i.name,
                    quantity: Number(i.quantity),
                    unit: i.unit
                })),
                steps: raw.steps,
                tags: raw.tags,
                prepTimeMinutes: Number(raw.prepTimeMinutes)
            });

            if (!recipe.isSafeFor(restrictions)) return null;
            return recipe;
        } catch (e) {
            console.error("⚠️ Error mapejant recepta OpenAI:", e);
            return null;
        }
      }).filter((r): r is Recipe => r !== null);

    } catch (error) {
      console.error("❌ OpenAI Error:", error);
      throw error;
    }
  }
}