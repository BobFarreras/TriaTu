// src/core/ports/IndividualDecisionResolver.ts
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

export interface IndividualDecisionResolver {
  // Canviat PreferenceProfile per UserProfile
  resolve(profile: UserProfile, context: DecisionContext): Promise<DecisionOutcome>;
}