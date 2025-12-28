// core/usecases/rooms/CreateDecisionRoom.ts
import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';

type Input = {
  hostUserId: string;
  name: string;
};

export class CreateDecisionRoom {
  constructor(private readonly roomRepo: DecisionRoomRepository) {}

  async execute(input: Input): Promise<string> {
    // Generem un ID únic (en producció usarem crypto natiu de Node/Browser)
    const roomId = crypto.randomUUID();

    // Creem l'entitat de domini
    const room = new DecisionRoom({
      id: roomId,
      hostUserId: input.hostUserId,
      name: input.name,
    });

    // Persistim a través del port (no sabem si és DB, memòria o fitxer)
    await this.roomRepo.save(room);

    return room.id;
  }
}