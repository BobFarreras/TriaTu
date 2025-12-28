import { RoomParticipant } from './RoomParticipant';
import { DecisionOutcome } from '../value-objects/DecisionOutcome';

export interface DecisionRoomProps {
  id: string;
  hostUserId: string;
  name: string;
}

export class DecisionRoom {
  public readonly id: string;
  public readonly hostUserId: string;
  public readonly name: string;
  private _participants: RoomParticipant[];
  
  // NOU: Historial de decisions preses en aquesta sala
  private _history: DecisionOutcome[] = [];

  constructor(props: DecisionRoomProps) {
    this.id = props.id;
    this.hostUserId = props.hostUserId;
    this.name = props.name;
    this._participants = [new RoomParticipant(props.hostUserId)];
  }

  get participants(): RoomParticipant[] {
    return [...this._participants];
  }
  
  // Getter per l'historial (ordenat per data, la més recent primer)
  get history(): DecisionOutcome[] {
    return [...this._history].sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  public addParticipant(userId: string): void {
    // ELIMINEM la restricció de "status !== OPEN". 
    // Sempre es pot unir gent a una sala persistent (excepte si la banegem, però això és futur).
    
    if (this._participants.some(p => p.userId === userId)) {
      // Si ja hi és, no fem res (idempotència), o llencem error. 
      // Per robustesa UI, millor no llençar error greu, només return.
      return; 
    }
    this._participants.push(new RoomParticipant(userId));
  }

  // NOU MÈTODE: Registrar una decisió sense tancar la sala
  public addDecision(outcome: DecisionOutcome): void {
    this._history.push(outcome);
  }
  
  // Mètode per "rehidratar" l'historial des de BD
  public loadHistory(outcomes: DecisionOutcome[]): void {
      this._history = outcomes;
  }
}