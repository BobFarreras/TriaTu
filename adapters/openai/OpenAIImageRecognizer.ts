import OpenAI from 'openai';
import { ImageRecognitionService } from '@/core/ports/ImageRecognitionService';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { ScanSanitizer } from '@/core/application/services/ScanSanitizer';
import { buildScanSystemPrompt, getScanSystemPrompt } from '@/core/prompts/scan-prompts';
import type { PromptService } from '@/core/application/services/PromptService';

export class OpenAIImageRecognizer implements ImageRecognitionService {
  private client: OpenAI;

  constructor(private promptService?: PromptService) {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async analyze(imageBase64: string): Promise<ScannedItem[]> {
    try {
      console.log(`?? OpenAI: Rebent imatge...`);

      const base64Data = imageBase64.includes('base64,') ? imageBase64.split('base64,')[1] : imageBase64;

      const today = new Date().toISOString().split('T')[0];
      const prompt = this.promptService
        ? await this.promptService.getPrompt({
            name: 'triatu-scan',
            variables: { today },
            fallback: () => buildScanSystemPrompt(today),
          })
        : getScanSystemPrompt();

      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: prompt
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analitza la imatge segons les instruccions." },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`,
                  detail: "high"
                }
              },
            ],
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return [];

      const parsed = JSON.parse(content);
      const rawItems = parsed.items || [];

      console.log(`? OpenAI ha trobat ${rawItems.length} elements.`);

      return rawItems.map((item: unknown) => ScanSanitizer.sanitize(item as ScannedItem));

    } catch (error) {
      console.error("? OpenAI Error:", error);
      throw error;
    }
  }
}
