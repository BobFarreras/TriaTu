import { RoomParticipant } from './RoomParticipant';
import { DecisionOutcome } from '../value-objects/DecisionOutcome';

export interface DecisionRoomProps {
  id: string;
  hostUserId: string;
  name: string;
  inviteCode: string; // ✅ NOU: Afegim el camp aquí
  votingMode: 'BLIND' | 'PUBLIC';
  participants: RoomParticipant[];
  history: DecisionOutcome[];
}

export class DecisionRoom {
  public readonly id: string;
  public readonly hostUserId: string;
  public readonly name: string;
  public readonly inviteCode: string; // ✅ NOU: Propietat pública
  public readonly votingMode: 'BLIND' | 'PUBLIC';

  private _participants: RoomParticipant[];
  private _history: DecisionOutcome[] = [];

  constructor(props: DecisionRoomProps) {
    this.id = props.id;
    this.hostUserId = props.hostUserId;
    this.name = props.name;
    this.inviteCode = props.inviteCode; // ✅ NOU: Assignació
    this.votingMode = props.votingMode;

    // Si participants ve buit o undefined, assegurem array
    this._participants = props.participants || [new RoomParticipant(props.hostUserId)];

    // Si history ve informat, el carreguem
    if (props.history) {
      this._history = props.history;
    }
  }

  get participants(): RoomParticipant[] {
    return [...this._participants];
  }

  get history(): DecisionOutcome[] {
    // Retornem ordenat per data (més recent primer)
    return [...this._history].sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

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
}