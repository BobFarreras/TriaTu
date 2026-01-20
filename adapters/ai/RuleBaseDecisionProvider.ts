// =================== FILE: src/adapters/ai/RuleBasedDecisionProvider.ts ===================

import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { PreferenceAggregator } from '@/core/domain/services/PreferenceAggregator';

// Estructura simple de l'input que surt del teu agregador
interface DecisionInput {
  interests: string[];
  restrictions: DietaryRestriction[];
}

export class RuleBasedDecisionProvider implements GroupDecisionResolver {
  async resolve(_room: DecisionRoom, profiles: UserProfile[]): Promise<DecisionOutcome> {
    const { commonInterests, hardRestrictions } = PreferenceAggregator.aggregate(profiles);

    const input: DecisionInput = {
      interests: commonInterests,
      restrictions: hardRestrictions
    };

    let choice = 'Opcio sorpresa';
    let reason = 'No hi havia prou dades per decidir.';

    if (input.interests.length > 0) {
      const randomIndex = Math.floor(Math.random() * input.interests.length);
      const winner = input.interests[randomIndex];

      choice = winner.charAt(0).toUpperCase() + winner.slice(1);
      reason = `Basat en la coincidencia de gustos del grup (${input.interests.length} coincidencies).`;
    }

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
