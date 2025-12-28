import { IndividualDecisionResolver } from '@/core/ports/IndividualDecisionResolver';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

export class BasicDecisionEngine implements IndividualDecisionResolver {
  
  async resolve(profile: PreferenceProfile, context: DecisionContext): Promise<DecisionOutcome> {
    const validOptions = profile.foodPreferences.filter(opt => !profile.isExcluded(opt));
    
    // Fallback si no hi ha preferències
    if (validOptions.length === 0) {
      return new DecisionOutcome({
        choice: 'Anything simple (Toast)',
        reason: 'default' // <--- CLAU (Abans text anglès)
      });
    }

    // Regla 1: Energia Baixa
    if (context.energyLevel < 4) {
      return new DecisionOutcome({
        choice: validOptions[0],
        reason: 'low_energy' // <--- CLAU
      });
    }

    // Regla 2: Energia Alta/Normal
    const randomChoice = validOptions[Math.floor(Math.random() * validOptions.length)];
    return new DecisionOutcome({
      choice: randomChoice,
      reason: 'high_energy' // <--- CLAU
    });
  }
}