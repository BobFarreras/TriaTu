import { DecisionRoom } from "@/core/domain/entities/DecisionRoom";
import { DecisionOutcome } from "@/core/domain/value-objects/DecisionOutcome";

export interface DecisionRoomRepository {
  save(room: DecisionRoom): Promise<void>;
  findById(id: string): Promise<DecisionRoom | null>;
  findByParticipantId(userId: string): Promise<DecisionRoom[]>;
  
  // ✅ AFEGIR AQUESTS MÈTODES QUE FALTAVEN:
  addParticipant(roomId: string, userId: string): Promise<void>;
  removeParticipant(roomId: string, userId: string): Promise<void>;
  clearHistory(roomId: string): Promise<void>;
  setVotingMode(roomId: string, mode: 'BLIND' | 'PUBLIC'): Promise<void>;
  saveDecision(roomId: string, outcome: DecisionOutcome): Promise<void>;
}