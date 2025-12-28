import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

export interface DecisionRoomRepository {
  save(room: DecisionRoom): Promise<void>; // Guarda només info bàsica (nom)
  findById(id: string): Promise<DecisionRoom | null>; // Carrega info + historial
  addParticipant(roomId: string, userId: string): Promise<void>;
  
  // NOU: Guardar una decisió específica
  saveDecision(roomId: string, outcome: DecisionOutcome): Promise<void>;
}