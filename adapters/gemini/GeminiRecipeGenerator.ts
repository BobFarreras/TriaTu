import { GoogleGenAI } from "@google/genai";
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// Mateix DTO
interface RawRecipeResponse {
  recipes: {
    name: string;
    ingredients: { name: string; quantity: number; unit: string }[];
    steps: string[];
    tags: string[];
    prepTimeMinutes: number;
  }[];
}

// Interfície per esquivar els problemes de tipatge de l'SDK
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
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generate(
    inventory: InventoryItemProps[],
    restrictions: DietaryRestriction[],
    focusDish?: string,
    excludeNames?: string[]
  ): Promise<Recipe[]> {

    // 🔵 LOG INICIAL
    console.log(`✨ [Gemini] Iniciant generació de receptes...`);
    if (focusDish) console.log(`🎯 [Gemini] Focus Dish: "${focusDish}"`);

    try {
      const inventoryText = inventory.map(i => `- ${i.name} (${i.quantity} ${i.unit})`).join('\n');
      const restrictionsText = restrictions.length > 0 ? restrictions.join(', ') : "Cap";

      let promptContext = "";

      if (focusDish) {
        promptContext = `TASCA: Genera UNA recepta detallada per a "${focusDish}".`;
      } else {
        const exclusionText = excludeNames?.length ? `NO REPETEIXIS: ${excludeNames.join(', ')}.` : "";
        promptContext = `TASCA: Genera 3 receptes creatives i viables. ${exclusionText}`;
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
        1. NO UTILITZIS TOTS ELS INGREDIENTS: Selecciona només els que combinen bé per fer un plat deliciós. És millor fer un plat simple i bo que un de complex i dolent.
        2. ASSUMEIX BÀSICS: Pots assumir que l'usuari té Sal, Oli, Pebre, Sucre i Aigua, encara que no estiguin a la llista.
        3. REALISME: Si l'inventari té ingredients incompatibles (ex: llet i salsa de soja), NO els barregis. Tria una ruta culinària.
        4. IDIOMA: Respon sempre en CATALÀ.
        
        FORMAT DE SORTIDA (JSON PUR):
        {
          "recipes": [
            {
              "name": "Títol atractiu del plat",
              "ingredients": [{"name": "Ingredient exact", "quantity": number, "unit": "string"}],
              "steps": ["Pas 1...", "Pas 2..."],
              "tags": ["ràpid", "sa", "vegetarià"],
              "prepTimeMinutes": number
            }
          ]
        }
      `;
      // 🚨🚨🚨 EL GRAN LOG D'AUDITORIA 🚨🚨🚨
      console.log("\n==================================================");
      console.log("📨 [GEMINI AUDIT] PROMPT ENVIAT A GOOGLE:");
      console.log("==================================================");
      console.log(fullPrompt);
      console.log("==================================================\n");
      // 🔵 LOG ABANS DE CRIDAR API
      console.log(`📤 [Gemini] Enviant prompt a Google GenAI (Model: gemini-2.5-flash)...`);

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash', // ⚠️ Assegura't que el model és correcte (2.5 encara no és públic generalment)
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: focusDish ? 0.2 : 0.6
        }
      });

      // 🔵 LOG DESPRÉS DE REBRE RESPOSTA
      console.log(`📥 [Gemini] Resposta rebuda.`);

      // Extracció segura
      const safeRes = response as unknown as SafeGeminiResponse;
      let jsonString: string | undefined;

      // Intentar mètode SDK modern
      if (typeof safeRes.text === 'function') {
        try { jsonString = safeRes.text(); } catch { }
      }
      // Fallback
      if (!jsonString && safeRes.candidates?.[0]?.content?.parts?.[0]?.text) {
        jsonString = safeRes.candidates[0].content.parts[0].text;
      }

      if (!jsonString) {
        console.warn("⚠️ [Gemini] Resposta buida (sense text).");
        return [];
      }

      // 🔵 LOG RAW TEXT (Primeros 100 caràcters per debug)
      console.log(`📄 [Gemini] Raw JSON: ${jsonString.substring(0, 100)}...`);

      const cleanJson = jsonString.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson) as RawRecipeResponse;

      if (!parsed.recipes || !Array.isArray(parsed.recipes)) {
        console.warn("⚠️ [Gemini] El JSON parsejat no té l'estructura { recipes: [] }", parsed);
        return [];
      }

      const results = parsed.recipes.map(raw => {
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
      throw error; // Important llançar l'error perquè el Fallback s'activi
    }
  }
}