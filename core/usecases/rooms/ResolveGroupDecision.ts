import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

// ✅ CANVI 1: Imports nous correctes
import { UserProfileRepository } from '@/core/ports/UserProfileRepository';
import { UserProfile } from '@/core/domain/entities/UserProfile';

type Input = {
  roomId: string;
  requesterUserId: string;
};

export class ResolveGroupDecision {
  constructor(
    private readonly roomRepo: DecisionRoomRepository,
    // ✅ CANVI 2: Canviem el tipus del repositori
    private readonly userRepo: UserProfileRepository,
    private readonly resolver: GroupDecisionResolver
  ) {}

  async execute(input: Input): Promise<DecisionOutcome> {
    // 1. Validar Sala
    const room = await this.roomRepo.findById(input.roomId);
    if (!room) throw new Error('Room not found');

    // 2. Validar Host
    if (room.hostUserId !== input.requesterUserId) {
      throw new Error('Only the host can resolve the room');
    }

    // 3. Recollir perfils de tots els participants
    // ✅ CANVI 3: Optimització. En lloc de fer un bucle lent, demanem tots de cop.
    // El teu UserProfileRepository ja té aquest mètode (getProfilesByIds).
    const participantIds = room.participants.map(p => p.userId);
    const profiles: UserProfile[] = await this.userRepo.getProfilesByIds(participantIds);

    // 4. Màgia (Algoritme)
    // Ara 'resolver.resolve' accepta UserProfile[] gràcies als canvis anteriors
    const outcome = await this.resolver.resolve(room, profiles);

    // 5. Aplicar resultat i tancar
    room.resolve(outcome);

    // 6. Persistir
    await this.roomRepo.save(room);

    return outcome;
  }
}