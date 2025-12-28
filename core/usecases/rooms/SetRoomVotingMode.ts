import { DecisionRoomRepository } from "../../ports/DecisionRoomRepository";

export class SetRoomVotingMode {
  constructor(private roomRepo: DecisionRoomRepository) {}

  async execute(userId: string, roomId: string, mode: 'BLIND' | 'PUBLIC'): Promise<void> {
    // 1. Recuperem la sala per verificar permisos
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error("Room not found");

    // 2. Regla de Domini: Només el host pot canviar el mode
    if (room.hostUserId !== userId) {
      throw new Error("Only the host can change the voting mode");
    }

    // 3. Executem el canvi
    await this.roomRepo.setVotingMode(roomId, mode);
  }
}