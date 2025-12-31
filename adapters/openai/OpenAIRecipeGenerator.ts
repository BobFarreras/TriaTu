// ARXIU: adapters/openai/OpenAIRecipeGenerator.ts

import OpenAI from "openai";
import { RecipeGenerator } from '@/core/ports/RecipeGenerator'; // Comprova la ruta (ports vs domain/services)
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// DTO per la resposta JSON de la IA (Mateix que Gemini per coherència)
interface RawRecipeResponse {
  recipes: {
    name: string;
    ingredients: { name: string; quantity: number; unit: string }[];
    steps: string[];
    tags: string[];
    dietary_tags: string[]; // ✅ Tags tècnics: "gluten-free", "vegan", "dairy-free"
    prepTimeMinutes: number;
  }[];
}

export class OpenAIRecipeGenerator implements RecipeGenerator {
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.error("⛔ [OpenAI] CRITICAL: Missing OPENAI_API_KEY");
      throw new Error("Missing OPENAI_API_KEY");
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generate(
    inventory: InventoryItemProps[], 
    restrictions: DietaryRestriction[], 
    focusDish?: string, 
    excludeNames?: string[],
    count: number = 3 // Per defecte 3
  ): Promise<Recipe[]> {
    
    console.log("🔵 [OpenAI] Iniciant generació amb gpt-4o-mini...");

    try {
      // 1. PREPARACIÓ DEL PROMPT
      const inventoryText = inventory.map(i => `- ${i.name} (${i.quantity} ${i.unit})`).join('\n');
      const restrictionsText = restrictions.length > 0 ? restrictions.join(', ') : "Cap";

      const instruction = `
        Ets un xef executiu expert (Estrella Michelin).
        REGLES CRÍTIQUES:
        1. SELECCIÓ INTEL·LIGENT: NO usis tots els ingredients. Tria només els que combinen bé.
        2. EVITA "FRANKENSTEINS": Mai barregis ingredients incompatibles.
        3. BÀSICS IMPLÍCITS: Assumeix que l'usuari té: Sal, Oli, Vinagre, Pebre, Aigua.
        4. IDIOMA: Català.
        5. FORMAT: JSON pur amb clau "recipes".
      `;

      let task = "";
      if (focusDish) {
        task = `Genera 1 recepta detallada per: "${focusDish}". Si falten ingredients crítics, busca substituts raonables.`;
      } else {
        const exclusions = excludeNames?.length ? `NO incloguis ni repeteixis: ${excludeNames.join(', ')}.` : "";
        task = `Genera ${count} receptes creatives. ${exclusions}`;
      }

      // 2. CRIDA A L'API
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" }, // Força JSON
        messages: [
            { role: "system", content: instruction },
            { role: "user", content: `INVENTARI DISPONIBLE:\n${inventoryText}\n\nRESTRICCIONS:\n${restrictionsText}\n\nTASCA:\n${task}\n\nJSON SCHEMA ESPERAT:\n{ "recipes": [{ "name": "...", "ingredients": [{"name":"...", "quantity":1, "unit":"ut"}], "steps": ["..."], "tags": ["..."], "prepTimeMinutes": 0 }] }` }
        ],
        temperature: focusDish ? 0.3 : 0.6, // Més creatiu si no hi ha plat fix
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
          console.warn("⚠️ [OpenAI] Resposta buida.");
          return [];
      }

      console.log("🔵 [OpenAI] Raw Response (inici):", content.substring(0, 50));

      // 3. PARSEIG
      const parsedData = JSON.parse(content) as RawRecipeResponse;
      
      if (!parsedData.recipes || !Array.isArray(parsedData.recipes)) {
        console.warn("⚠️ [OpenAI] JSON rebut però sense array 'recipes'", parsedData);
        return [];
      }

      // 4. MAPATGE A ENTITATS (AMB FIX DE CAMPS FALTANTS)
      return parsedData.recipes.map(raw => {
        try {
            // ✅ AQUI APLIQUEM ELS MATEIXOS FIXES QUE A GEMINI
            const recipe = new Recipe({
                id: crypto.randomUUID(),
                
                // Camps per defecte (no venen de la IA)
                authorId: 'ai-generated',
                createdAt: new Date(),
                likesCount: 0,
                isPublic: false,
                ratingSummary: { average: 0, count: 0, distribution: {} },
                
                // Camps de la IA
                name: raw.name,
                ingredients: raw.ingredients.map(i => ({
                    name: i.name,
                    quantity: Number(i.quantity),
                    unit: i.unit
                })),
                steps: raw.steps,
                tags: raw.tags || [],
                prepTimeMinutes: Number(raw.prepTimeMinutes),
                
                // 🛡️ CRÍTIC: Inicialitzar dietaryTags per evitar crash a isSafeFor()
                dietaryTags: (raw.dietary_tags || []).map(t => t.toLowerCase())
            });

            if (!recipe.isSafeFor(restrictions)) {
                console.warn(`⚠️ [OpenAI] Recepta "${raw.name}" descartada per restriccions.`);
                return null;
            }
            return recipe;
        } catch (e) {
            console.error("⚠️ [OpenAI] Error mapejant una recepta:", e);
            return null;
        }
      }).filter((r): r is Recipe => r !== null);

    } catch (error) {
      console.error("❌ [OpenAI] Error CRÍTIC:", error);
      throw error;
    }
  }
}