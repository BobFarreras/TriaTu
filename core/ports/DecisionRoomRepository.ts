import { DecisionRoom } from "../domain/entities/DecisionRoom";
import { DecisionOutcome } from "../domain/value-objects/DecisionOutcome";

export interface DecisionRoomRepository {
  findById(id: string): Promise<DecisionRoom | null>;
  save(room: DecisionRoom): Promise<void>;
  saveDecision(roomId: string, outcome: DecisionOutcome): Promise<void>;
  
  // AFEGIR AQUESTS DOS MÈTODES NOUS:
  removeParticipant(roomId: string, userId: string): Promise<void>;
  clearHistory(roomId: string): Promise<void>;
  setVotingMode(roomId: string, mode: 'BLIND' | 'PUBLIC'): Promise<void>;
  findByParticipantId(userId: string): Promise<DecisionRoom[]>;
}