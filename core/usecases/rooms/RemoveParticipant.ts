import { DecisionRoomRepository } from "../../ports/DecisionRoomRepository";

export class RemoveParticipant {
  constructor(private roomRepo: DecisionRoomRepository) {}

  async execute(hostUserId: string, roomId: string, participantIdToRemove: string): Promise<void> {
    const room = await this.roomRepo.findById(roomId);
    if (!room) throw new Error("Room not found");
    
    // Validació de Domini: Només el host pot fer fora gent
    if (room.hostUserId !== hostUserId) {
      throw new Error("Only the host can remove participants");
    }

    // Validació: El host no es pot fer fora a ell mateix (tancaria la sala)
    if (hostUserId === participantIdToRemove) {
      throw new Error("Host cannot be kicked. Close the room instead.");
    }

    await this.roomRepo.removeParticipant(roomId, participantIdToRemove);
  }
}