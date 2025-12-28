export interface DecisionOutcomeProps {
  choice: string;
  reason: string;
}

export class DecisionOutcome {
  public readonly choice: string;
  public readonly reason: string;
  public readonly generatedAt: Date;

  constructor(props: DecisionOutcomeProps) {
    if (!props.choice) throw new Error('Outcome choice cannot be empty');
    if (!props.reason) throw new Error('Outcome reason cannot be empty');

    this.choice = props.choice;
    this.reason = props.reason;
    this.generatedAt = new Date();
  }
}