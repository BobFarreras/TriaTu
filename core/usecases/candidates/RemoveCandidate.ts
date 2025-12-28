import { CandidateRepository } from "@/core/ports/CandidateRepository";

export class RemoveCandidate {
  constructor(private repo: CandidateRepository) {}

  async execute(candidateId: string, userId: string): Promise<void> {
    if (!candidateId) throw new Error("Candidate ID is required");
    await this.repo.deleteById(candidateId, userId);
  }
}