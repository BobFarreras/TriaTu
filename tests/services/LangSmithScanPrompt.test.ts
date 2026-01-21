import { describe, it } from 'vitest';
import dotenv from 'dotenv';
import { LangSmithPromptRepository } from '@/adapters/langsmith/LangSmithPromptRepository';
import { PromptService } from '@/core/application/services/PromptService';
import { expect } from 'vitest';

dotenv.config({ path: '.env.local' });

const shouldRun =
  process.env.LANGSMITH_PROMPT_TEST === 'true' && !!process.env.LANGSMITH_API_KEY;

const run = shouldRun ? it : it.skip;

describe('LangSmith scan prompt', () => {
  run('fetches triatu-scan prompt', async () => {
    const endpoint = process.env.LANGSMITH_ENDPOINT || 'https://api.smith.langchain.com';
    const project = process.env.LANGSMITH_PROJECT || '(none)';
    const apiKeyPresent = !!process.env.LANGSMITH_API_KEY;
    const namespace = process.env.LANGSMITH_PROMPT_NAMESPACE || '(none)';
    const organizationId = process.env.LANGSMITH_ORGANIZATION_ID || '(none)';

    console.log(`[LangSmith] endpoint=${endpoint}`);
    console.log(`[LangSmith] project=${project}`);
    console.log(`[LangSmith] apiKey=${apiKeyPresent ? 'present' : 'missing'}`);
    console.log(`[LangSmith] namespace=${namespace}`);
    console.log(`[LangSmith] organizationId=${organizationId}`);

    const repo = new LangSmithPromptRepository();
    const service = new PromptService(repo);

    let prompt = '';
    try {
      prompt = await service.getPrompt({
        name: 'triatu-scan',
        variables: { today: '2025-01-01' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const hint = apiKeyPresent
        ? `Check prompt name and project. name=triatu-scan project=${project}`
        : 'Missing LANGSMITH_API_KEY';
      throw new Error(`LangSmith scan prompt fetch failed: ${errorMessage}. ${hint}`);
    }

    expect(prompt).toContain('"items"');
  });
});
