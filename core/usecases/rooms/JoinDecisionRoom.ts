import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';

type Input = {
  roomId: string;
  userId: string;
};

export class JoinDecisionRoom {
  constructor(private readonly roomRepo: DecisionRoomRepository) {}

  async execute(input: Input): Promise<void> {
    // 1. Recuperar sala
    const room = await this.roomRepo.findById(input.roomId);
    if (!room) {
      throw new Error(`Room not found: ${input.roomId}`);
    }

    // 2. Aplicar lògica de negoci en memòria
    // (Això valida regles de negoci com: la sala està plena? està tancada?)
    room.addParticipant(input.userId);

    // 3. Persistència eficient
    // Com que ja hem validat al pas 2, ara guardem directament el link a la DB
    await this.roomRepo.addParticipant(room.id, input.userId);
  }
}