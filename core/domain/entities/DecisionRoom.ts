// =================== FILE: src/core/domain/entities/DecisionRoom.ts ===================

import { RoomParticipant } from './RoomParticipant';
import { DecisionOutcome } from '../value-objects/DecisionOutcome';

export interface DecisionRoomProps {
  id: string;
  hostUserId: string;
  name: string;
  inviteCode: string;
  votingMode: 'BLIND' | 'PUBLIC';
  participants: RoomParticipant[];
  history: DecisionOutcome[];
}

export class DecisionRoom {
  public readonly id: string;
  public readonly hostUserId: string;
  public readonly name: string;
  public readonly inviteCode: string;
  public readonly votingMode: 'BLIND' | 'PUBLIC';

  private _participants: RoomParticipant[];
  private _history: DecisionOutcome[] = [];

  // ✅ NOUTAT: Constant de domini (2 minuts d'espera entre decisions)
  private static readonly DECISION_COOLDOWN_MS = 2 * 60 * 1000;

  constructor(props: DecisionRoomProps) {
    this.id = props.id;
    this.hostUserId = props.hostUserId;
    this.name = props.name;
    this.inviteCode = props.inviteCode;
    this.votingMode = props.votingMode;
    this._participants = props.participants || [new RoomParticipant(props.hostUserId)];
    
    if (props.history) {
      this._history = props.history;
    }
  }

  get participants(): RoomParticipant[] {
    return [...this._participants];
  }

  get history(): DecisionOutcome[] {
    return [...this._history].sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  // ... (mètodes existents addParticipant, resolve, etc. es mantenen igual) ...
  public addParticipant(userId: string): void {
    if (this._participants.some(p => p.userId === userId)) return;
    this._participants.push(new RoomParticipant(userId));
  }

  public resolve(outcome: DecisionOutcome): void {
    this._history.push(outcome);
  }

  public addDecision(outcome: DecisionOutcome): void {
    this._history.push(outcome);
  }

  public loadHistory(outcomes: DecisionOutcome[]): void {
    this._history = outcomes;
  }

  public canAccess(userId: string): boolean {
    const isHost = this.hostUserId === userId;
    const isParticipant = this.participants.some(p => p.userId === userId);
    return isHost || isParticipant;
  }

  // ✅ NOUTAT: Validació d'invariant de temps
  // Això evita que l'admin faci spam del botó "Decidir"
  public canGenerateNewDecision(): boolean {
    if (this._history.length === 0) return true;
    
    // Com que history té un sort al getter, accedim a _history directament o usem el getter sabent que el 0 és el més recent
    const sortedHistory = this.history; 
    const lastDecision = sortedHistory[0];
    
    const timeSinceLast = new Date().getTime() - lastDecision.generatedAt.getTime();
    return timeSinceLast >= DecisionRoom.DECISION_COOLDOWN_MS;
  }

  public getTimeRemainingForNextDecision(): number {
     if (this._history.length === 0) return 0;
     const sortedHistory = this.history;
     const lastDecision = sortedHistory[0];
     
     const timeSinceLast = new Date().getTime() - lastDecision.generatedAt.getTime();
     const remaining = DecisionRoom.DECISION_COOLDOWN_MS - timeSinceLast;
     
     return remaining > 0 ? remaining : 0;
  }
}