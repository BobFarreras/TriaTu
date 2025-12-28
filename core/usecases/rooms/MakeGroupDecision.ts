import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';

type Input = {
  roomId: string;
  requesterUserId: string;
  candidates?: string[]; // NOU: Llista opcional (ex: Restaurants)
};

export class MakeGroupDecision {
  constructor(
    private readonly roomRepo: DecisionRoomRepository,
    private readonly prefRepo: PreferenceRepository,
    private readonly resolver: GroupDecisionResolver
  ) {}

  async execute(input: Input): Promise<DecisionOutcome> {
    // 1. Validar Sala
    const room = await this.roomRepo.findById(input.roomId);
    if (!room) throw new Error('Room not found');

    // (Opcional) Validar que el requester és a la sala. 
    // En sales persistents, qualsevol membre podria iniciar la decisió, no només el Host.
    if (!room.participants.some(p => p.userId === input.requesterUserId)) {
        throw new Error('You must be a participant to make a decision');
    }

    // 2. Recollir perfils
    const profiles: PreferenceProfile[] = [];
    for (const participant of room.participants) {
      const profile = await this.prefRepo.findByUserId(participant.userId);
      if (profile) profiles.push(profile);
    }

    // 3. Resoldre
    // Passem els candidats al resolver (haurem d'actualitzar la interfície del Resolver)
    const outcome = await this.resolver.resolve(room, profiles, input.candidates);

    // 4. Afegir a l'historial (NO tanquem la sala)
    room.addDecision(outcome);

    // 5. Persistir (Guardar la nova decisió a la taula group_decisions)
    await this.roomRepo.saveDecision(room.id, outcome);

    return outcome;
  }
}