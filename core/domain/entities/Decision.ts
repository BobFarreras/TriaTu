import { DecisionContext } from '../value-objects/DecisionContext';
import { DecisionOutcome } from '../value-objects/DecisionOutcome';

export enum DecisionType {
  FOOD = 'FOOD',
  REST = 'REST',
  SOCIAL = 'SOCIAL',
  CUSTOM = 'CUSTOM'
}

export enum DecisionStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED'
}

export interface DecisionProps {
  id: string;
  userId: string;
  type: DecisionType;
  context: DecisionContext;
}

export class Decision {
  public readonly id: string;
  public readonly userId: string;
  public readonly type: DecisionType;
  public readonly context: DecisionContext;
  
  public status: DecisionStatus;
  private _outcome?: DecisionOutcome;

  constructor(props: DecisionProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.type = props.type;
    this.context = props.context;
    this.status = DecisionStatus.PENDING;
  }

  get outcome(): DecisionOutcome | undefined {
    return this._outcome;
  }

  public resolve(outcome: DecisionOutcome): void {
    if (this.status !== DecisionStatus.PENDING) {
      throw new Error(`Cannot resolve a decision that is not PENDING (current: ${this.status})`);
    }

    this._outcome = outcome;
    this.status = DecisionStatus.RESOLVED;
  }

  public cancel(): void {
    if (this.status === DecisionStatus.RESOLVED) {
      throw new Error('Cannot cancel a resolved decision');
    }
    this.status = DecisionStatus.CANCELLED;
  }
}