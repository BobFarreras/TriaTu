// =================== FILE: src/core/usecases/decisions/ResolveAutoDecision.ts ===================

import { SupabaseDecisionRoomRepository } from '@/adapters/supabase/SupabaseDecisionRoomRepository';
import { SupabaseUserProfileRepository } from '@/adapters/supabase/SupabaseUserProfileRepository';
import { RuleBasedDecisionProvider } from '@/adapters/ai/RuleBaseDecisionProvider';
import { PreferenceAggregator } from '@/core/domain/services/PreferenceAggregator';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

export class ResolveAutoDecision {
  constructor(
    private roomRepo: SupabaseDecisionRoomRepository,
    private profileRepo: SupabaseUserProfileRepository,
    private decisionProvider: RuleBasedDecisionProvider
  ) {}

  async execute(roomId: string, userId: string): Promise<DecisionOutcome> {
    // 1. Carreguem la sala
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error("Room not found");

    // 2. ✅ VALIDACIÓ INVARIANT DE TEMPS (La teva lògica de Cooldown)
    if (!room.canGenerateNewDecision()) {
        const remainingMs = room.getTimeRemainingForNextDecision();
        const remainingSec = Math.ceil(remainingMs / 1000);
        throw new Error(`Wait ${remainingSec}s before deciding again.`);
    }

    // 3. Obtenim els IDs dels participants
    const participantIds = room.participants.map(p => p.userId);

    // 4. Carreguem perfils (El teu Repo)
    const profiles = await this.profileRepo.getProfilesByIds(participantIds);

    // 5. Agreguem Preferències (El teu Service)
    const { commonInterests, hardRestrictions } = PreferenceAggregator.aggregate(profiles);

    // 6. Decidim
    const outcome = this.decisionProvider.decide({
        interests: commonInterests,
        restrictions: hardRestrictions
    });

    // 7. Guardem resultats
    await this.roomRepo.saveDecision(roomId, outcome);

    return outcome;
  }
}