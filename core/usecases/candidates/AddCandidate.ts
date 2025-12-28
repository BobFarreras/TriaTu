import { CandidateRepository } from "@/core/ports/CandidateRepository";

export class AddCandidate {
  constructor(private repo: CandidateRepository) {}

  async execute(roomId: string, userId: string, content: string): Promise<void> {
    if (!content.trim()) throw new Error("Content cannot be empty");
    await this.repo.add(roomId, userId, content.trim());
  }
}