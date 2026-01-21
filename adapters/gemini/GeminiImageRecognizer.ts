import { GoogleGenAI } from "@google/genai";
import { ImageRecognitionService } from '@/core/ports/ImageRecognitionService';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { ScanSanitizer } from '@/core/application/services/ScanSanitizer';
import { buildScanSystemPrompt, getScanSystemPrompt } from '@/core/prompts/scan-prompts';
import type { PromptService } from '@/core/application/services/PromptService';

export class GeminiImageRecognizer implements ImageRecognitionService {
  private client: GoogleGenAI;

  constructor(private promptService?: PromptService) {
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async analyze(imageBase64: string): Promise<ScannedItem[]> {
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const today = new Date().toISOString().split('T')[0];
      const prompt = this.promptService
        ? await this.promptService.getPrompt({
            name: 'triatu-scan',
            variables: { today },
            fallback: () => buildScanSystemPrompt(today),
          })
        : getScanSystemPrompt();

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',

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
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      });

      const text = response?.text;
      if (!text) return [];

      let rawItems: unknown[] = [];
      try {
        const parsed = JSON.parse(text);
        rawItems = Array.isArray(parsed) ? parsed : (parsed.items || []);
        console.log("?? [GEMINI OUTPUT]:", rawItems.length, "items");
      } catch (e) {
        console.error("Gemini JSON Error:", e);
        return [];
      }

      return rawItems.map((item: unknown) => ScanSanitizer.sanitize(item as ScannedItem));
    } catch (error) {
      console.warn("?? Gemini ha fallat:", error);
      throw error;
    }
  }
}
