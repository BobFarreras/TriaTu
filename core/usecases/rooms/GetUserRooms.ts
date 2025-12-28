import { DecisionRoomRepository } from "@/core/ports/DecisionRoomRepository";
import { DecisionRoom } from "@/core/domain/entities/DecisionRoom";

export class GetUserRooms {
  constructor(private roomRepo: DecisionRoomRepository) {}

  async execute(userId: string): Promise<DecisionRoom[]> {
    if (!userId) throw new Error("UserId is required");
    return this.roomRepo.findByParticipantId(userId);
  }
}