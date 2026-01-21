import type { PromptRepository } from '@/core/ports/PromptRepository';

type LangSmithRepoListResponse = {
  repos?: LangSmithRepo[];
  total?: number;
};

type LangSmithRepo = {
  repo_handle?: string;
  full_name?: string;
  last_commit_hash?: string;
  latest_commit_manifest?: {
    commit_hash?: string;
    manifest?: LangSmithManifest;
  };
};

type LangSmithManifest = {
  type?: string;
  kwargs?: {
    first?: LangSmithPromptNode;
    prompt?: LangSmithPromptNode;
  };
};

type LangSmithPromptNode = {
  id?: string[];
  kwargs?: {
    messages?: LangSmithPromptMessage[];
    template?: string;
  };
};

type LangSmithPromptMessage = {
  id?: string[];
  kwargs?: {
    content?: string;
  };
};

export class LangSmithPromptRepository implements PromptRepository {
  private apiKey: string;
  private endpoint: string;
  private project?: string;
  private organizationId?: string;

  constructor() {
    const apiKey = process.env.LANGSMITH_API_KEY;
    if (!apiKey) {
      throw new Error('Missing LANGSMITH_API_KEY');
    }
    this.apiKey = apiKey;
    this.endpoint = (process.env.LANGSMITH_ENDPOINT || 'https://api.smith.langchain.com').replace(/\/$/, '');
    this.project = process.env.LANGSMITH_PROJECT;
    this.organizationId = process.env.LANGSMITH_ORGANIZATION_ID;
  }

  async fetchPrompt(input: { name: string; version?: string }): Promise<{ template: string; version?: string }> {
    const repoName = this.stripNamespace(input.name);
    const repo = await this.fetchRepoByName(repoName);
    if (!repo) {
      throw new Error(`LangSmith prompt repo not found for name=${repoName}`);
    }

    const manifest = repo.latest_commit_manifest?.manifest;
    const template = this.extractTemplateFromManifest(manifest);
    if (!template) {
      throw new Error('LangSmith prompt template missing');
    }

    return {
      template,
      version: repo.latest_commit_manifest?.commit_hash || repo.last_commit_hash || input.version,
    };
  }

  private async fetchRepoByName(name: string): Promise<LangSmithRepo | null> {
    const url = new URL(`${this.endpoint}/api/v1/repos`);
    url.searchParams.set('query', name);
    url.searchParams.set('with_latest_manifest', 'true');
    if (this.organizationId) {
      url.searchParams.set('tenant_id', this.organizationId);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`LangSmith repo list failed (${response.status})`);
    }

    const data = (await response.json()) as LangSmithRepoListResponse;
    const repos = data.repos || [];
    const match = repos.find(
      (repo) => repo.repo_handle === name || repo.full_name === name || repo.repo_handle === this.stripNamespace(name),
    );

    return match || null;
  }

  private extractTemplateFromManifest(manifest?: LangSmithManifest): string | null {
    if (!manifest?.kwargs) return null;
    const promptNode = manifest.kwargs.first || manifest.kwargs.prompt;
    const messages = promptNode?.kwargs?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return promptNode?.kwargs?.template || null;
    }

    const system = messages.find((message) => this.isSystemMessage(message));
    const candidate = system || messages[0];
    return candidate?.kwargs?.content || null;
  }

  private isSystemMessage(message: LangSmithPromptMessage): boolean {
    const id = message.id || [];
    return id.some((value) => value.toLowerCase().includes('systemmessage'));
  }

  private stripNamespace(name: string): string {
    const namespace = process.env.LANGSMITH_PROMPT_NAMESPACE;
    if (!namespace) return name;
    const prefix = `${namespace}/`;
    return name.startsWith(prefix) ? name.slice(prefix.length) : name;
  }
}
