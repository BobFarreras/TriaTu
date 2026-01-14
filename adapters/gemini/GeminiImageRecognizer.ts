import { GoogleGenAI } from "@google/genai";
import { ImageRecognitionService } from '@/core/ports/ImageRecognitionService';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { ScanSanitizer } from '@/core/domain/services/ScanSanitizer';
import { getScanSystemPrompt } from '@/core/prompts/scan-prompts'; // ✅ IMPORTAT

export class GeminiImageRecognizer implements ImageRecognitionService {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async analyze(imageBase64: string): Promise<ScannedItem[]> {
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      // ✅ USEM EL PROMPT CENTRALITZAT
      const prompt = getScanSystemPrompt();

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash', // El model Pro és millor per a coordenades

        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json', // Forcem JSON
          temperature: 0.1,
        }
      });

      const text = response?.text;
      if (!text) return [];

      let rawItems: unknown[] = [];
      try {
        const parsed = JSON.parse(text);
        // ✅ Adapta al nou format { items: [...] }
        rawItems = Array.isArray(parsed) ? parsed : (parsed.items || []);
        console.log("🔍 [GEMINI OUTPUT]:", rawItems.length, "items");
      } catch (e) {
        console.error("Gemini JSON Error:", e);
        return [];
      }

      return rawItems.map((item: unknown) => ScanSanitizer.sanitize(item as ScannedItem));
    } catch (error) {
      console.warn("⚠️ Gemini ha fallat:", error);
      throw error;
    }
  }
}