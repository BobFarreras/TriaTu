// =================== FILE: src/adapters/ai/RuleBasedDecisionProvider.ts ===================

import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// Estructura simple de l'input que surt del teu Agregador
interface DecisionInput {
  interests: string[];
  restrictions: DietaryRestriction[];
}

export class RuleBasedDecisionProvider {
  
  decide(input: DecisionInput): DecisionOutcome {
    let choice = "Opció Sorpresa";
    let reason = "No hi havia prou dades per decidir.";

    // 1. Si tenim interessos comuns, en triem un a l'atzar
    if (input.interests.length > 0) {
      const randomIndex = Math.floor(Math.random() * input.interests.length);
      const winner = input.interests[randomIndex];
      
      choice = winner.charAt(0).toUpperCase() + winner.slice(1); // Capitalitzem
      reason = `Basat en la coincidència de gustos del grup (${input.interests.length} coincidències).`;
    }

    // 2. Afegim nota sobre restriccions si n'hi ha
    if (input.restrictions.length > 0) {
      const restrictionsText = input.restrictions.join(', ');
      reason += ` Tenint en compte: ${restrictionsText}.`;
    }

    return new DecisionOutcome({
      choice,
      reason,
      generatedAt: new Date()
    });
  }
}