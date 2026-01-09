// src/services/decision/BasicGroupResolver.ts
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { UserProfile, RESTRICTION_KEYWORDS } from '@/core/domain/entities/UserProfile'; // ✅ Importem Keywords
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { FoodKnowledgeService } from '@/core/domain/services/FoodKnowledgeService';

export class BasicGroupResolver implements GroupDecisionResolver {
  
  constructor(private readonly knowledgeService: FoodKnowledgeService) {}

  async resolve(
    room: DecisionRoom, 
    profiles: UserProfile[],
    candidates?: string[]
  ): Promise<DecisionOutcome> {
    
    // 1. Preparar candidats
    const potentialOptions = candidates && candidates.length > 0 
        ? candidates 
        : this.gatherUserFavorites(profiles);

    if (potentialOptions.length === 0) {
       return new DecisionOutcome({ choice: 'Random', reason: 'No options to decide from.' });
    }

    // 2. Sistema de Puntuació
    const scores = new Map<string, number>();
    const rejectionReasons = new Map<string, string>(); 

    for (const option of potentialOptions) {
        let score = 0;
        let isRejected = false;

        for (const profile of profiles) {
            
            // A. Comprovar Exclusions (SEGURETAT PRIMER)
            
            // 1. Check ràpid de l'entitat (per nom)
            if (profile.isExcluded(option)) {
                 isRejected = true;
                 rejectionReasons.set(option, `Excluded by user ${profile.id}'s restrictions`);
                 break;
            }

            // 2. Check profund al servei (per ingredients/tags)
            for (const restriction of profile.restrictions) {
                 // Obtenim les paraules clau (ex: 'gluten', 'blat') de la restricció
                 const keywords = RESTRICTION_KEYWORDS[restriction] || [];
                 
                 for (const keyword of keywords) {
                     // ✅ CORRECCIÓ: Usem hasConflict amb la keyword específica
                     if (this.knowledgeService.hasConflict(option, keyword)) {
                        isRejected = true;
                        rejectionReasons.set(option, `Conflict with ${restriction} (${keyword})`);
                        break;
                     }
                 }
                 if (isRejected) break;
            }
            if (isRejected) break;

            // B. Comprovar Preferències
            for (const pref of profile.foodPreferences) {
                if (this.knowledgeService.matchesPreference(option, pref)) {
                    score += 1; 
                }
            }
        }

        if (!isRejected) {
            scores.set(option, score);
        }
    }

    // 3. Triar Guanyador
    const validOptions = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);

    if (validOptions.length === 0) {
       const reasonsList = Array.from(rejectionReasons.entries())
           .map(([opt, reason]) => `${opt}: ${reason}`)
           .join('. ');
       return new DecisionOutcome({ 
           choice: 'Water', 
           reason: `All options unsafe! ${reasonsList}`
       });
    }

    const [winnerChoice, winnerScore] = validOptions[0];

    // --- Generació de la Raó (per passar el test) ---
    let reasonText = `Safe choice. Fits preferences (score: ${winnerScore}).`;
    
    if (rejectionReasons.size > 0) {
        const uniqueReasons = Array.from(new Set(rejectionReasons.values())).join(', ');
        reasonText += ` (Safety note: Excluded some options due to ${uniqueReasons})`;
    }

    return new DecisionOutcome({
        choice: winnerChoice.charAt(0).toUpperCase() + winnerChoice.slice(1),
        reason: reasonText
    });
  }

  private gatherUserFavorites(profiles: UserProfile[]): string[] {
      const allPrefs = new Set<string>();
      profiles.forEach(p => p.foodPreferences.forEach(f => allPrefs.add(f)));
      return Array.from(allPrefs);
  }
}