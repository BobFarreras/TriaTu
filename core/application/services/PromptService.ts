import { debug } from '@/lib/logger';
import type { PromptRepository } from '@/core/ports/PromptRepository';

export type PromptVariables = Record<string, string | number | boolean | string[] | undefined>;

interface PromptRequest {
  name: string;
  version?: string;
  variables?: PromptVariables;
  fallback?: (vars: PromptVariables) => string;
}

type CachedPrompt = {
  template: string;
  source: 'langsmith' | 'local' | 'cache';
  version?: string;
};

export class PromptService {
  private cache = new Map<string, CachedPrompt>();

  constructor(private repo: PromptRepository) {}

  async getPrompt(request: PromptRequest): Promise<string> {
    const cacheKey = this.buildCacheKey(request.name, request.version, request.variables);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      debug('[PromptService]', {
        source: 'cache',
        name: request.name,
        version: cached.version || request.version || 'latest',
      });
      return cached.template;
    }

    try {
      const result = await this.repo.fetchPrompt({
        name: request.name,
        version: request.version,
      });
      const interpolated = interpolateTemplate(result.template, request.variables);
      this.cache.set(cacheKey, {
        template: interpolated,
        source: 'langsmith',
        version: result.version || 'latest',
      });
      debug('[PromptService]', {
        source: 'langsmith',
        name: request.name,
        version: result.version || 'latest',
      });
      return interpolated;
    } catch (error) {
      if (!request.fallback) {
        throw error;
      }
      const localPrompt = request.fallback(request.variables || {});
      this.cache.set(cacheKey, {
        template: localPrompt,
        source: 'local',
        version: request.version || 'latest',
      });
      debug('[PromptService]', {
        source: 'local',
        name: request.name,
        version: request.version || 'latest',
      });
      return localPrompt;
    }
  }

  private buildCacheKey(name: string, version?: string, variables?: PromptVariables): string {
    const varsKey = stableSerialize(variables || {});
    return `${name}::${version || 'latest'}::${varsKey}`;
  }
}

function interpolateTemplate(template: string, variables?: PromptVariables): string {
  if (!variables) return template;
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => {
    const value = variables[key];
    if (value === undefined || value === null) return '';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  });
}

function stableSerialize(variables: PromptVariables): string {
  const keys = Object.keys(variables).sort();
  const sorted: Record<string, string> = {};
  for (const key of keys) {
    const value = variables[key];
    if (value === undefined) continue;
    sorted[key] = Array.isArray(value) ? value.join(', ') : String(value);
  }
  return JSON.stringify(sorted);
}
