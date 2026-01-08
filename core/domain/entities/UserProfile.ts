// src/core/domain/entities/UserProfile.ts
import { DietaryRestriction } from '../value-objects/DietaryRestriction';

export class UserProfile {
  private _restrictions: DietaryRestriction[] = [];
  private _preferences: string[] = [];
  private _socialTolerance: number = 0;
  
  // ✅ NOUS CAMPS
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
  
  // ✅ NOUS GETTERS
  get username(): string | undefined { return this._username; }
  get avatarEmoji(): string | undefined { return this._avatarEmoji; }

  // Setters
  public setTolerance(val: number) { this._socialTolerance = val; }
  
  // ✅ NOUS SETTERS
  public setUsername(name: string) { this._username = name; }
  public setAvatar(emoji: string) { this._avatarEmoji = emoji; }

  public addRestriction(restriction: DietaryRestriction): void {
     if (!this._restrictions.includes(restriction)) this._restrictions.push(restriction);
  }
}