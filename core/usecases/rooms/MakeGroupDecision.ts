// src/core/usecases/rooms/MakeGroupDecision.ts

import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { UserProfileRepository } from '@/core/ports/UserProfileRepository'; // ✅ ÚNIC REPO
import { CandidateRepository } from '@/core/ports/CandidateRepository';
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
// import { PreferenceProfile } ... ❌ ESBORRA AIXÒ

type Input = {
  roomId: string;
  requesterUserId: string;
  mode: 'magic' | 'manual';
};

export class MakeGroupDecision {
  constructor(
    private readonly roomRepo: DecisionRoomRepository,
    private readonly userRepo: UserProfileRepository, // ✅ Només UserProfileRepository
    private readonly candidateRepo: CandidateRepository,
    private readonly resolver: GroupDecisionResolver
  ) { }

  async execute(input: Input): Promise<DecisionOutcome> {
    const room = await this.roomRepo.findById(input.roomId);
    if (!room) throw new Error('Room not found');

    if (input.mode === 'manual') {
        // ... (lògica manual igual que abans)
        const candidates = await this.candidateRepo.getAllForRoom(input.roomId);
        if (!candidates.length) throw new Error("Empty list");
        return { 
            choice: candidates[0].content, // Simplificat per l'exemple
            reason: "Random", 
            generatedAt: new Date() 
        };
    } else {
        // ✅ MODE MÀGIC ACTUALITZAT
        const participantIds = room.participants.map(p => p.userId);
        
        // Ara userRepo.getProfilesByIds retorna UserProfile[]
        const profiles = await this.userRepo.getProfilesByIds(participantIds);

        // El resolver ara accepta UserProfile[], així que no hi ha error
        const outcome = await this.resolver.resolve(room, profiles);
        
        await this.roomRepo.saveDecision(room.id, outcome);
        return outcome;
    }
  }
}