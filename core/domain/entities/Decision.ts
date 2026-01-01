// core/domain/entities/Decision.ts

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

// Props per crear una NOVA decisió (ús habitual de negoci)
export interface DecisionProps {
  id: string;
  userId: string;
  type: DecisionType;
  context: DecisionContext;
}

// Props esteses exclusivament per rehidratar des de BD
export interface DecisionRestoreProps extends DecisionProps {
  status: DecisionStatus;
  outcome?: DecisionOutcome;
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
    
    // Per defecte, una nova decisió sempre neix PENDING
    this.status = DecisionStatus.PENDING;
  }

  /**
   * ✅ MÈTODE FACTORY PER A INFRAESTRUCTURA
   * Reconstitueix una decisió existent des de la persistència.
   * Accedeix a propietats privades de forma segura sense trencar encapsulament.
   */
  public static restore(props: DecisionRestoreProps): Decision {
    const decision = new Decision(props);
    
    // Sobreescriu l'estat per defecte amb l'estat real de la BD
    decision.status = props.status;
    
    // Assignació directa permesa perquè estem dins de la classe
    decision._outcome = props.outcome;
    
    return decision;
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