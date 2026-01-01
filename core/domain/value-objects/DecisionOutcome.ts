// ARXIU: core/domain/value-objects/DecisionOutcome.ts

export interface DecisionOutcomeProps {
  choice: string;
  reason: string;
  // ✅ AFEGIT: Opcional al constructor (per defecte "ara"), 
  // però obligatori per rehidratar des de BD.
  generatedAt?: Date; 
}

export class DecisionOutcome {
  public readonly choice: string;
  public readonly reason: string;
  public readonly generatedAt: Date; // ✅ AFEGIT: Propietat pública de lectura

  constructor(props: DecisionOutcomeProps) {
    if (!props.choice || props.choice.trim() === '') {
      throw new Error('Decision outcome must have a choice');
    }
    if (!props.reason || props.reason.trim() === '') {
      throw new Error('Decision outcome must have a reason');
    }

    this.choice = props.choice;
    this.reason = props.reason;
    // Si no ens passen data (decisió nova), posem "ara".
    // Si ens la passen (ve de la BD), respectem la data original.
    this.generatedAt = props.generatedAt || new Date();
  }
}