import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';

type Input = {
  hostUserId: string;
  name: string;
};

export class CreateDecisionRoom {
  constructor(private readonly roomRepo: DecisionRoomRepository) { }

  async execute(input: Input): Promise<string> {
    // 1. Generem un ID únic
    const roomId = crypto.randomUUID();
    
    // ⚡ MILLORA: Generem un codi curt (6 caràcters) en lloc d'un UUID llarg
    // Això crea strings com "a1b2c3" o "z9x8y7"
    const shortInviteCode = Math.random().toString(36).substring(2, 8);

    // 2. Creem l'entitat de domini amb l'ESTAT INICIAL COMPLET
    const room = new DecisionRoom({
      id: roomId,
      hostUserId: input.hostUserId,
      inviteCode: shortInviteCode, // ✅ Ara sí, curt i maco
      name: input.name,

      // ✅ VALORS PER DEFECTE OBLIGATORIS:
      votingMode: 'BLIND', // Per defecte comencem en mode cec

      // La sala neix amb el creador (Host) com a primer participant
      participants: [
        {
          userId: input.hostUserId,
          joinedAt: new Date()
        }
      ],

      history: [] // Historial buit al principi
    });

    // 3. Persistim
    await this.roomRepo.save(room);

    return room.id;
  }
}