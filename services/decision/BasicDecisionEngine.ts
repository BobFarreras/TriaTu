// services/decision/BasicDecisionEngine.ts
import { IndividualDecisionResolver } from '@/core/ports/IndividualDecisionResolver';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

export class BasicDecisionEngine implements IndividualDecisionResolver {
  
  async resolve(profile: PreferenceProfile, context: DecisionContext): Promise<DecisionOutcome> {
    // Lògica Molt Bàsica (MVP)
    // Això es complicarà en el futur, però ara volem que funcioni.

    const validOptions = profile.foodPreferences.filter(opt => !profile.isExcluded(opt));
    
    // Fallback si no hi ha preferències
    if (validOptions.length === 0) {
      return new DecisionOutcome({
        choice: 'Anything simple (Toast)',
        reason: 'No preferences found, picked standard safe option.'
      });
    }

    // Regla 1: Energia Baixa -> Agafa la primera opció (assumim que les favorites van primer)
    if (context.energyLevel < 4) {
      return new DecisionOutcome({
        choice: validOptions[0],
        reason: 'Low energy detected. Chose your top preference to save effort.'
      });
    }

    // Regla 2: Energia Alta -> Tria una opció aleatòria per variar
    const randomChoice = validOptions[Math.floor(Math.random() * validOptions.length)];
    return new DecisionOutcome({
      choice: randomChoice,
      reason: 'Good energy levels! Selected something from your favorites randomly.'
    });
  }
}