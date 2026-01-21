// =================== FILE: src/core/domain/services/PreferenceAggregator.ts ===================

import { UserProfile } from '../entities/UserProfile';
import { DietaryRestriction } from '../value-objects/DietaryRestriction'; // El teu Enum existent

export class PreferenceAggregator {
  
  public static aggregate(profiles: UserProfile[]) {
    const allRestrictions = new Set<DietaryRestriction>();
    const interestCounts = new Map<string, number>();

    profiles.forEach(p => {
      // 1. Unim totes les restriccions (Seguretat primer)
      p.restrictions.forEach(r => allRestrictions.add(r));

      // 2. Comptem preferències
      p.preferences.forEach(pref => {
        // Normalitzem strings per evitar "Pizza" vs "pizza"
        const normalized = pref.toLowerCase().trim();
        interestCounts.set(normalized, (interestCounts.get(normalized) || 0) + 1);
      });
    });

    // 3. Filtrem interessos populars (mínim 1/3 dels usuaris coincideixen, o tots si són pocs)
    const threshold = Math.max(1, Math.floor(profiles.length / 3));
    
    const commonInterests = Array.from(interestCounts.entries())
      .filter(([, count]) => count >= threshold)
      .map(([interest]) => interest); // Retornem l'string

    return {
      commonInterests, // string[]
      hardRestrictions: Array.from(allRestrictions) // DietaryRestriction[]
    };
  }
}
