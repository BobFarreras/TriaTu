import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
import { CandidateRepository } from '@/core/ports/CandidateRepository'; // <--- NOU IMPORT
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';

type Input = {
  roomId: string;
  requesterUserId: string;
  mode: 'magic' | 'manual'; // <--- Canviem candidates per mode
};

export class MakeGroupDecision {
  constructor(
    private readonly roomRepo: DecisionRoomRepository,
    private readonly prefRepo: PreferenceRepository,
    private readonly candidateRepo: CandidateRepository, // <--- Injectem CandidateRepo
    private readonly resolver: GroupDecisionResolver
  ) { }

  async execute(input: Input): Promise<DecisionOutcome> {
    // 1. Validar Sala
    const room = await this.roomRepo.findById(input.roomId);
    if (!room) throw new Error('Room not found');

    if (!room.participants.some(p => p.userId === input.requesterUserId)) {
      throw new Error('You must be a participant to make a decision');
    }

    let outcome: DecisionOutcome;

    // --- BRANCA A: MODE MANUAL (LLISTA) ---
    if (input.mode === 'manual') {
      // Recuperem els candidats de la BD (ja no venen per input)
      const candidates = await this.candidateRepo.getAllForRoom(input.roomId);

      if (candidates.length === 0) {
        throw new Error("La llista d'opcions està buida!");
      }

      // Simplificació: Triem un a l'atzar (o pots crear un mètode al resolver)
      const winner = candidates[Math.floor(Math.random() * candidates.length)];

      outcome = {
        choice: winner.content,
        reason: `Decisió aleatòria entre ${candidates.length} opcions proposades pels participants.`,
        generatedAt: new Date()
      };

      // 👇 COMENTA AQUESTA LÍNIA SI NO VOLS QUE S'ESBORRIN:
      // await this.candidateRepo.deleteAllForRoom(input.roomId);
    }

    // --- BRANCA B: MODE MÀGIC (PERFILS) ---
    else {
      const profiles: PreferenceProfile[] = [];
      for (const participant of room.participants) {
        const profile = await this.prefRepo.findByUserId(participant.userId);
        if (profile) profiles.push(profile);
      }

      // El resolver ja no rep candidats externs en mode màgic
      outcome = await this.resolver.resolve(room, profiles);
    }

    // Guardar resultat
    room.addDecision(outcome);
    await this.roomRepo.saveDecision(room.id, outcome);

    return outcome;
  }
}