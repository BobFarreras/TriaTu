// core/domain/entities/PreferenceProfile.ts

export interface PreferenceProfileProps {
  id: string;
  foodPreferences: string[];
  socialTolerance: number; // Podríem fer un ValueObject més endavant
  exclusions: string[];
}

export class PreferenceProfile {
  public readonly id: string;
  public readonly foodPreferences: string[];
  public readonly socialTolerance: number;
  private readonly exclusions: string[];

  constructor(props: PreferenceProfileProps) {
    this.id = props.id;
    this.foodPreferences = props.foodPreferences;
    this.socialTolerance = props.socialTolerance;
    // Normalitzem a minúscules per robustesa
    this.exclusions = props.exclusions.map(e => e.toLowerCase());
  }

  /**
   * Comprova si una opció està explícitament prohibida per l'usuari.
   * Invariant: Les exclusions són límits durs (hard limits).
   */
  public isExcluded(option: string): boolean {
    return this.exclusions.includes(option.toLowerCase());
  }
}