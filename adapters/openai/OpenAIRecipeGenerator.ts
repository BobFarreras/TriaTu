// adapters/openai/OpenAIRecipeGenerator.ts

import { BaseAIRecipeGenerator } from '@/adapters/ai/BaseAIRecipeGenerator';
import type { PromptService } from '@/core/application/services/PromptService';
import OpenAI from "openai";

export class OpenAIRecipeGenerator extends BaseAIRecipeGenerator {
  private client: OpenAI;

  constructor(promptService?: PromptService) {
    super(promptService);
    if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  protected getModelName(): string {
    return 'GPT-4o Mini';
  }

  protected async callAIModel(prompt: string, focusDish?: string): Promise<string | null> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }, // Força mode JSON natiu d'OpenAI
        temperature: focusDish ? 0.3 : 0.7,
      });

      return response.choices[0]?.message?.content || null;
    } catch (e) {
      console.error("❌ OpenAI API Error:", e);
      return null;
    }
  }
}
