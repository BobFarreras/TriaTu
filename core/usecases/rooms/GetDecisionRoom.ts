// core/usecases/rooms/GetDecisionRoom.ts

import { DecisionRoomRepository } from "../../ports/DecisionRoomRepository";
import { DecisionRoom } from "../../domain/entities/DecisionRoom";

export class GetDecisionRoom {
  constructor(private readonly roomRepo: DecisionRoomRepository) {}

  async execute(roomId: string, currentUserId: string): Promise<DecisionRoom> {
    const room = await this.roomRepo.findById(roomId);

    if (!room) {
      throw new Error("Sala no trobada");
    }

    // ✅ VALIDACIÓ D'INVARIANTS DE DOMINI
    // Si l'usuari no és el host ni està a la llista de participants -> FORA
    const isHost = room.hostUserId === currentUserId;
    const isParticipant = room.participants.some(p => p.userId === currentUserId);

    if (!isHost && !isParticipant) {
      // Llancem error de domini, no d'infraestructura
      throw new Error("Accés denegat: No ets membre d'aquesta sala.");
    }

    return room;
  }
}