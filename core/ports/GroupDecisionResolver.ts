import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

export interface GroupDecisionResolver {
  resolve(
      room: DecisionRoom, 
      participantProfiles: PreferenceProfile[], 
      candidates?: string[] // <-- NOU PARÀMETRE
  ): Promise<DecisionOutcome>;
}