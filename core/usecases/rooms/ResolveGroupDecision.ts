// core/usecases/rooms/ResolveGroupDecision.ts
import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';

type Input = {
  roomId: string;
  requesterUserId: string;
};

export class ResolveGroupDecision {
  constructor(
    private readonly roomRepo: DecisionRoomRepository,
    private readonly prefRepo: PreferenceRepository,
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
    // Nota: Això es podria optimitzar amb un mètode 'findAllByIds' al repo, però iterem per simplicitat MVP.
    const profiles: PreferenceProfile[] = [];
    for (const participant of room.participants) {
      const profile = await this.prefRepo.findByUserId(participant.userId);
      if (profile) {
        profiles.push(profile);
      }
    }

    // 4. Màgia (Algoritme)
    const outcome = await this.resolver.resolve(room, profiles);

    // 5. Aplicar resultat i tancar
    room.resolve(outcome);

    // 6. Persistir
    await this.roomRepo.save(room);

    return outcome;
  }
}