// =================== FILE: src/core/usecases/decisions/ResolveAutoDecision.ts ===================

import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { UserProfileRepository } from '@/core/ports/UserProfileRepository';
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

export class ResolveAutoDecision {
  constructor(
    private roomRepo: DecisionRoomRepository,
    private profileRepo: UserProfileRepository,
    private decisionResolver: GroupDecisionResolver
  ) {}

  async execute(roomId: string, _userId: string): Promise<DecisionOutcome> {
    // 1. Carreguem la sala
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error('Room not found');

    // 2. Validacio invariant de temps (cooldown)
    if (!room.canGenerateNewDecision()) {
      const remainingMs = room.getTimeRemainingForNextDecision();
      const remainingSec = Math.ceil(remainingMs / 1000);
      throw new Error(`Wait ${remainingSec}s before deciding again.`);
    }

    // 3. Obtenim els IDs dels participants
    const participantIds = room.participants.map(p => p.userId);

    // 4. Carreguem perfils
    const profiles = await this.profileRepo.getProfilesByIds(participantIds);

    // 5. Decidim
    const outcome = await this.decisionResolver.resolve(room, profiles);

    // 6. Guardem resultats
    await this.roomRepo.saveDecision(roomId, outcome);

    return outcome;
  }
}
