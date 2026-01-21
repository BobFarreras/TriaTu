import type { PromptRepository } from '@/core/ports/PromptRepository';

interface LangSmithPromptResponse {
  template?: string;
  prompt?: {
    template?: string;
  };
}

export class LangSmithPromptRepository implements PromptRepository {
  private apiKey: string;
  private endpoint: string;
  private project?: string;

  constructor() {
    const apiKey = process.env.LANGSMITH_API_KEY;
    if (!apiKey) {
      throw new Error('Missing LANGSMITH_API_KEY');
    }
    this.apiKey = apiKey;
    this.endpoint = (process.env.LANGSMITH_ENDPOINT || 'https://api.smith.langchain.com').replace(/\/$/, '');
    this.project = process.env.LANGSMITH_PROJECT;
  }

  async fetchPrompt(input: { name: string; version?: string }): Promise<{ template: string; version?: string }> {
    const url = new URL(`${this.endpoint}/prompts/${encodeURIComponent(input.name)}`);
    if (input.version) url.searchParams.set('version', input.version);
    if (this.project) url.searchParams.set('project', this.project);

    const response = await fetch(url.toString(), {
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`LangSmith prompt fetch failed (${response.status})`);
    }

    const data = (await response.json()) as LangSmithPromptResponse;
    const template = data.template || data.prompt?.template;
    if (!template) {
      throw new Error('LangSmith prompt template missing');
    }

    return { template, version: input.version };
  }
}
