import { DietaryRestriction } from '../value-objects/DietaryRestriction'; // Importa el teu Enum

export class UserProfile {
  private _restrictions: DietaryRestriction[] = [];
  private _preferences: string[] = [];

  constructor(
    public readonly id: string,
    initialRestrictions: DietaryRestriction[] = [],
    initialPreferences: string[] = []
  ) {
    this._restrictions = initialRestrictions;
    this._preferences = initialPreferences;
  }

  get restrictions(): DietaryRestriction[] {
    return [...this._restrictions];
  }

  get preferences(): string[] {
    return [...this._preferences];
  }

  public addRestriction(restriction: DietaryRestriction): void {
    // Amb Enums, la comparació és directa i ràpida
    if (!this._restrictions.includes(restriction)) {
      this._restrictions.push(restriction);
    }
  }

  public addPreference(pref: string): void {
    const normalized = pref.trim();
    const exists = this._preferences.some(p => 
      p.toLowerCase() === normalized.toLowerCase()
    );

    if (!exists && normalized.length > 0) {
      this._preferences.push(normalized);
    }
  }
}