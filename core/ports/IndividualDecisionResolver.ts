import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

export interface IndividualDecisionResolver {
  resolve(profile: PreferenceProfile, context: DecisionContext): Promise<DecisionOutcome>;
}