import { DecisionRoomRepository } from "../../ports/DecisionRoomRepository";
import { DecisionRoom } from "../../domain/entities/DecisionRoom";
// ✅ IMPORTAR ELS ERRORS (Importantíssim!)
import { ResourceNotFoundError, UnauthorizedAccessError } from "../../domain/errors/DomainErrors";

export class GetDecisionRoom {
  constructor(private readonly roomRepo: DecisionRoomRepository) {}

  async execute(roomId: string, currentUserId: string): Promise<DecisionRoom> {
    const room = await this.roomRepo.findById(roomId);

    if (!room) {
      // ❌ ABANS: throw new Error("Sala no trobada");
      // ✅ ARA: Usem la classe que espera el test
      throw new ResourceNotFoundError("DecisionRoom", roomId);
    }

    // ✅ VALIDACIÓ D'INVARIANTS DE DOMINI
    const isHost = room.hostUserId === currentUserId;
    const isParticipant = room.participants.some(p => p.userId === currentUserId);

    if (!isHost && !isParticipant) {
      // ❌ ABANS: throw new Error("Accés denegat...");
      // ✅ ARA: Usem la classe que espera el test
      throw new UnauthorizedAccessError("DecisionRoom", currentUserId);
    }

    return room;
  }
}