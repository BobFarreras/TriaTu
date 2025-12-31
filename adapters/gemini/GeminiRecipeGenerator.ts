// ARXIU: adapters/gemini/GeminiRecipeGenerator.ts

import { GoogleGenAI } from "@google/genai";
import { RecipeGenerator } from '@/core/ports/RecipeGenerator'; // Comprova si és ports o services
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// Mateix DTO per la resposta JSON de la IA
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

// Interfície per esquivar els problemes de tipatge de l'SDK (Safety Wrapper)
interface SafeGeminiResponse {
  text?: string | (() => string);
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

export class GeminiRecipeGenerator implements RecipeGenerator {
  private client: GoogleGenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.error("⛔ [Gemini] CRITICAL: Missing GEMINI_API_KEY");
      throw new Error("Missing GEMINI_API_KEY");
    }
    // Assegura't que l'SDK estigui ben importat. A vegades és { GoogleGenerativeAI } de "@google/generative-ai"
    // Si fas servir el paquet oficial nou, això està bé.
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generate(
    inventory: InventoryItemProps[],
    restrictions: DietaryRestriction[],
    focusDish?: string,
    excludeNames?: string[],
    count: number = 4
  ): Promise<Recipe[]> {

    console.log(`✨ [Gemini] Iniciant generació de receptes...`);
    if (focusDish) console.log(`🎯 [Gemini] Focus Dish: "${focusDish}"`);

    try {
      // 1. PREPARACIÓ DEL PROMPT
      const inventoryText = inventory.map(i => `- ${i.name} (${i.quantity} ${i.unit})`).join('\n');
      const restrictionsText = restrictions.length > 0 ? restrictions.join(', ') : "Cap";

      let promptContext = "";

      if (focusDish) {
        promptContext = `TASCA: Genera UNA recepta detallada per a "${focusDish}".`;
      } else {
        const exclusionText = excludeNames?.length ? `NO REPETEIXIS: ${excludeNames.join(', ')}.` : "";
        promptContext = `TASCA: Genera ${count} receptes creatives i viables. ${exclusionText}`;
      }

      const fullPrompt = `
        Actua com un xef expert de prestigi (Estrella Michelin) especialitzat en cuina d'aprofitament.
        
        CONTEXT:
        ${promptContext}
        
        INVENTARI DE L'USUARI:
        ${inventoryText}
        
        RESTRICCIONS ALIMENTÀRIES (CRÍTIC):
        ${restrictionsText}
        
        ⚠️ REGLES D'OR (SEGUEIX-LES STRICTAMENT):
        1. NO UTILITZIS TOTS ELS INGREDIENTS: Selecciona només els que combinen bé.
        2. ASSUMEIX BÀSICS: Sal, Oli, Pebre, Sucre, Aigua.
        3. REALISME: No barregis ingredients incompatibles.
        4. IDIOMA: Respon sempre en CATALÀ.
        
        ✨ 5. FORMAT INTERACTIU (MOLT IMPORTANT):
           - Quan mencionis un ingredient dins dels passos, has de posar-lo entre claudàtors, EXACTAMENT com l'has anomenat a la llista d'ingredients.
             Exemple: "Tallar la [Ceba] a daus i afegir el [Tomàquet]."
           - Quan indiquis un temps d'espera o cocció, usa la icona del rellotge seguida dels minuts.
             Exemple: "Deixar bullir durant ⏰ 10 min." o "Enfornar ⏰ 45 min."
        
        FORMAT DE SORTIDA (JSON PUR):
        {
          "recipes": [
            {
              "name": "Títol atractiu del plat",
              "ingredients": [{"name": "Ceba", "quantity": 1, "unit": "ut"}, {"name": "Tomàquet", "quantity": 2, "unit": "ut"}],
              "steps": [
                 "Primer, pelar i picar la [Ceba] finament.",
                 "Sofregir en una paella amb oli durant ⏰ 5 min fins que estigui daurada.",
                 "Afegir el [Tomàquet] trossejat i rectificar de sal."
              ],
              "tags": ["ràpid", "sa", "vegetarià"],
              "dietary_tags": ["gluten-free", "vegan"],
              "prepTimeMinutes": 15
            }
          ]
        }
      `;

      console.log(`📤 [Gemini] Enviant prompt a Google GenAI...`);

      // 2. CRIDA A L'API
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash', // He actualitzat a 2.5-flash que és més estable/ràpid si està disponible, si no torna a 1.5-flash
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: focusDish ? 0.2 : 0.6
        }
      });

      console.log(`📥 [Gemini] Resposta rebuda.`);

      // 3. EXTRACCIÓ SEGURA DEL TEXT
      const safeRes = response as unknown as SafeGeminiResponse;
      let jsonString: string | undefined;

      if (typeof safeRes.text === 'function') {
        try { jsonString = safeRes.text(); } catch { }
      }
      if (!jsonString && safeRes.candidates?.[0]?.content?.parts?.[0]?.text) {
        jsonString = safeRes.candidates[0].content.parts[0].text;
      }

      if (!jsonString) {
        console.warn("⚠️ [Gemini] Resposta buida.");
        return [];
      }

      // 4. NETEJA I PARSEIG
      const cleanJson = jsonString.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson) as RawRecipeResponse;

      if (!parsed.recipes || !Array.isArray(parsed.recipes)) {
        return [];
      }

      // 5. MAPATGE A ENTITATS DE DOMINI (AQUÍ ESTAVA L'ERROR)
      const results = parsed.recipes.map(raw => {
        try {
          // ✅ FIX: Omplim TOTS els camps requerits per RecipeProps
          const recipe = new Recipe({
            id: crypto.randomUUID(),

            // Camps que la IA no dona, els posem per defecte:
            authorId: 'ai-generated',
            createdAt: new Date(),
            likesCount: 0,
            isPublic: false,

            // Camps de la IA:
            name: raw.name,
            ingredients: raw.ingredients.map(i => ({
              name: i.name,
              quantity: Number(i.quantity),
              unit: i.unit
            })),
            steps: raw.steps,
            tags: raw.tags || [],
            prepTimeMinutes: Number(raw.prepTimeMinutes),

            // 🛡️ IMPORTANT: Inicialitzem dietaryTags buit per evitar l'error "undefined map"
            dietaryTags: (raw.dietary_tags || []).map(t => t.toLowerCase()),

            // Estructura de rating buida inicial
            ratingSummary: {
              average: 0,
              count: 0,
              distribution: {}
            }
          });

          // Validació final de domini
          if (!recipe.isSafeFor(restrictions)) {
            console.warn(`⚠️ [Gemini] Recepta "${raw.name}" descartada per restriccions.`);
            return null;
          }
          return recipe;
        } catch (e) {
          console.error(`⚠️ [Gemini] Error mapejant una recepta:`, e);
          return null;
        }
      }).filter((r): r is Recipe => r !== null);

      console.log(`✅ [Gemini] Retornant ${results.length} receptes vàlides.`);
      return results;

    } catch (error) {
      console.error("❌ [Gemini] ERROR CRÍTIC:", error);
      throw error;
    }
  }
}