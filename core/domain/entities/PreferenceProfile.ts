export interface PreferenceProfileProps {
  id: string;
  username?: string;     // ✅ Nou
  avatarEmoji?: string;  // ✅ Nou
  foodPreferences: string[];
  socialTolerance: number; 
  exclusions: string[];
}

export class PreferenceProfile {
  public readonly id: string;
  public readonly username?: string;    // ✅ Nou (public readonly)
  public readonly avatarEmoji?: string; // ✅ Nou (public readonly)
  
  public readonly foodPreferences: string[];
  public readonly socialTolerance: number;
  private readonly exclusions: string[];

  constructor(props: PreferenceProfileProps) {
    this.id = props.id;
    this.username = props.username;       // ✅ Assignació
    this.avatarEmoji = props.avatarEmoji; // ✅ Assignació
    
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
  
  // Opcional: Getter per assegurar un fallback si és undefined
  public getDisplayName(): string {
     return this.username || `Chef ${this.id.substring(0,4)}`;
  }
  
  public getAvatar(): string {
     return this.avatarEmoji || '👨‍🍳';
  }
}