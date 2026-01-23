export interface PromptRepository {
  fetchPrompt(input: { name: string; version?: string }): Promise<{
    template: string;
    version?: string;
  }>;
}
