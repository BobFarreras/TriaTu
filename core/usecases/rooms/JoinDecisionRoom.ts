// core/usecases/rooms/JoinDecisionRoom.ts
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

    // 2. Aplicar lògica de negoci (l'entitat valida si està OPEN o si duplicat)
    room.addParticipant(input.userId);

    // 3. Persistir només el nou participant (més eficient que guardar tota la sala)
    await this.roomRepo.addParticipant(room.id, input.userId);
  }
}