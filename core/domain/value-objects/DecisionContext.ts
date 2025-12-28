export interface DecisionContextProps {
  energyLevel: number; // 0-10
  availableTimeMinutes: number;
  location?: string;
}

export class DecisionContext {
  public readonly energyLevel: number;
  public readonly availableTimeMinutes: number;
  public readonly location?: string;

  constructor(props: DecisionContextProps) {
    if (props.energyLevel < 0 || props.energyLevel > 10) {
      throw new Error('Energy level must be between 0 and 10');
    }
    if (props.availableTimeMinutes < 0) {
      throw new Error('Available time cannot be negative');
    }

    this.energyLevel = props.energyLevel;
    this.availableTimeMinutes = props.availableTimeMinutes;
    this.location = props.location;
  }
}