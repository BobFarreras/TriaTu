import { describe, expect, it } from 'vitest';
import dotenv from 'dotenv';
import { LangSmithPromptRepository } from '@/adapters/langsmith/LangSmithPromptRepository';

dotenv.config({ path: '.env.local' });

const shouldRun = process.env.LANGSMITH_PROMPT_TEST === 'true' && !!process.env.LANGSMITH_API_KEY;
const run = shouldRun ? it : it.skip;

describe('LangSmith recipe prompts', () => {
  run('fetches triatu-recipe-chef prompt', async () => {
    const repo = new LangSmithPromptRepository();
    const prompt = await repo.fetchPrompt({ name: 'triatu-recipe-chef' });
    expect(prompt.template).toContain('"recipes"');
  });

  run('fetches triatu-recipe-fate prompt', async () => {
    const repo = new LangSmithPromptRepository();
    const prompt = await repo.fetchPrompt({ name: 'triatu-recipe-fate' });
    expect(prompt.template).toContain('"recipes"');
  });
});
