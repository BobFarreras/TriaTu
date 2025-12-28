import { DecisionRoomRepository } from "../../ports/DecisionRoomRepository";

export class ClearRoomHistory {
  constructor(private roomRepo: DecisionRoomRepository) {}

  async execute(hostUserId: string, roomId: string): Promise<void> {
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error("Room not found");

    // Regla de negoci: Només el host pot esborrar l'historial
    if (room.hostUserId !== hostUserId) {
      throw new Error("Only the host can clear history");
    }

    await this.roomRepo.clearHistory(roomId);
  }
}