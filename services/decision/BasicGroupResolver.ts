import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { FoodKnowledgeService } from '@/core/domain/services/FoodKnowledgeService';

interface ProfileWithExclusions {
  exclusions: string[];
}

export class BasicGroupResolver implements GroupDecisionResolver {
  
  constructor(private readonly knowledgeService: FoodKnowledgeService) {}

  async resolve(
    room: DecisionRoom, 
    profiles: PreferenceProfile[],
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
            const exclusions = (profile as unknown as ProfileWithExclusions).exclusions || [];
            
            // A. Comprovar Exclusions
            for (const exclusion of exclusions) {
                if (this.knowledgeService.hasConflict(option, exclusion)) {
                    isRejected = true;
                    // Guardem per què s'ha rebutjat
                    rejectionReasons.set(option, `Conflict with ${exclusion}`);
                    break; 
                }
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

    // Cas: Tot rebutjat
    if (validOptions.length === 0) {
        // Aquí també podríem llistar les raons
        const reasonsList = Array.from(rejectionReasons.entries())
            .map(([opt, reason]) => `${opt}: ${reason}`)
            .join('. ');
            
        return new DecisionOutcome({ 
            choice: 'Water', 
            reason: `Impossible conflict! ${reasonsList}`
        });
    }

    const [, winnerScore] = validOptions[0];

    // Empats
    const topScorers = validOptions.filter(([, s]) => s === winnerScore);
    const finalChoice = topScorers[Math.floor(Math.random() * topScorers.length)][0];

    // --- CORRECCIÓ FINAL ---
    // Generem un resum de les opcions descartades per seguretat
    let reasonText = `Safe choice. Fits preferences (Score: ${winnerScore}).`;
    
    if (rejectionReasons.size > 0) {
        const rejectedLog = Array.from(rejectionReasons.entries())
            .map(([opt, reason]) => `${opt} (${reason})`)
            .join(', ');
        // Afegim la "xafarderia" al final
        reasonText += ` [Excluded: ${rejectedLog}]`;
    }

    return new DecisionOutcome({
        choice: finalChoice.charAt(0).toUpperCase() + finalChoice.slice(1),
        reason: reasonText
    });
  }

  private gatherUserFavorites(profiles: PreferenceProfile[]): string[] {
      const allPrefs = new Set<string>();
      profiles.forEach(p => p.foodPreferences.forEach(f => allPrefs.add(f)));
      return Array.from(allPrefs);
  }
}