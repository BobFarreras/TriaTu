import { describe, expect, it } from 'vitest';
import { PromptService } from '@/core/application/services/PromptService';
import type { PromptRepository } from '@/core/ports/PromptRepository';

describe('PromptService', () => {
  it('returns remote prompt with interpolation', async () => {
    const repo: PromptRepository = {
      async fetchPrompt() {
        return { template: 'Hola {{name}}', version: '1' };
      },
    };

    const service = new PromptService(repo);
    const prompt = await service.getPrompt({
      name: 'triatu-test',
      variables: { name: 'Anna' },
    });

    expect(prompt).toBe('Hola Anna');
  });

  it('falls back to local prompt when repo fails', async () => {
    const repo: PromptRepository = {
      async fetchPrompt() {
        throw new Error('boom');
      },
    };

    const service = new PromptService(repo);
    const prompt = await service.getPrompt({
      name: 'triatu-test',
      variables: { name: 'Anna' },
      fallback: (vars) => `Local ${vars.name}`,
    });

    expect(prompt).toBe('Local Anna');
  });

  it('caches prompts for same name and variables', async () => {
    let calls = 0;
    const repo: PromptRepository = {
      async fetchPrompt() {
        calls += 1;
        return { template: 'Hola {{name}}', version: '1' };
      },
    };

    const service = new PromptService(repo);
    const input = { name: 'triatu-test', variables: { name: 'Anna' } };
    const first = await service.getPrompt(input);
    const second = await service.getPrompt(input);

    expect(first).toBe('Hola Anna');
    expect(second).toBe('Hola Anna');
    expect(calls).toBe(1);
  });
});
