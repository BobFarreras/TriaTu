// adapters/gemini/GeminiRecipeGenerator.ts

import { BaseAIRecipeGenerator } from '@/adapters/ai/BaseAIRecipeGenerator';
import { GoogleGenAI } from "@google/genai";

export class GeminiRecipeGenerator extends BaseAIRecipeGenerator {
  private client: GoogleGenAI;

  constructor() {
    super();
    if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  protected getModelName(): string {
    return 'Gemini 2.5 Flash';
  }

  protected async callAIModel(prompt: string, focusDish?: string): Promise<string | null> {
    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: focusDish ? 0.3 : 0.7 // Més creativitat si no hi ha plat definit
        }
      });

      // Extracció específica de l'SDK de Google
      return response?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (e) {
      console.error("❌ Gemini API Error:", e);
      return null;
    }
  }
}