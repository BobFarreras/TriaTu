// src/core/domain/entities/UserProfile.ts
import { DietaryRestriction } from '../value-objects/DietaryRestriction';

// ✅ EXPORTEM AIXÒ perquè el Resolver ho pugui fer servir
export const RESTRICTION_KEYWORDS: Record<DietaryRestriction, string[]> = {
  [DietaryRestriction.GLUTEN_FREE]: ['blat', 'farina', 'pasta', 'pa', 'pizza', 'galeta', 'gluten'],
  [DietaryRestriction.NUT_ALLERGY]: ['cacauet', 'nou', 'ametlla', 'avellana', 'fruit sec'],
  [DietaryRestriction.LACTOSE_INTOLERANT]: ['llet', 'nata', 'formatge', 'mantega', 'lactosa'],
  [DietaryRestriction.VEGAN]: ['carn', 'peix', 'ou', 'llet', 'mel', 'formatge'],
  [DietaryRestriction.VEGETARIAN]: ['carn', 'peix'],
  [DietaryRestriction.SHELLFISH_ALLERGY]: ['gamba', 'cranc', 'musclo', 'marisc']
};

export class UserProfile {
  private _restrictions: DietaryRestriction[] = [];
  private _preferences: string[] = [];
  private _socialTolerance: number = 0;
  private _username?: string;
  private _avatarEmoji?: string;

  constructor(
    public readonly id: string,
    initialRestrictions: DietaryRestriction[] = [],
    initialPreferences: string[] = [],
    initialTolerance: number = 2
  ) {
    this._restrictions = initialRestrictions;
    this._preferences = initialPreferences;
    this._socialTolerance = initialTolerance;
  }

  // Getters
  get restrictions(): DietaryRestriction[] { return [...this._restrictions]; }
  get preferences(): string[] { return [...this._preferences]; }
  get foodPreferences(): string[] { return [...this._preferences]; } 
  get socialTolerance(): number { return this._socialTolerance; }
  get username(): string | undefined { return this._username; }
  get avatarEmoji(): string | undefined { return this._avatarEmoji; }

  // Setters
  public setUsername(name: string) { this._username = name; }
  public setAvatar(emoji: string) { this._avatarEmoji = emoji; }

  public addRestriction(restriction: DietaryRestriction): void {
     if (!this._restrictions.includes(restriction)) this._restrictions.push(restriction);
  }

  // ✅ IMPLEMENTACIÓ DEL MÈTODE QUE FALTA
  public isExcluded(foodName: string): boolean {
    const normalizedFood = foodName.toLowerCase();
    
    for (const restriction of this._restrictions) {
        const keywords = RESTRICTION_KEYWORDS[restriction] || [];
        // Comprovació simple per nom (string matching)
        if (keywords.some(k => normalizedFood.includes(k.toLowerCase()))) {
            return true;
        }
    }
    return false;
  }
}