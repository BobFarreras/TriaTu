import { DecisionRoom } from '../domain/entities/DecisionRoom';
import { DecisionOutcome } from '../domain/value-objects/DecisionOutcome';
import { UserProfile } from '../domain/entities/UserProfile'; // ✅ NOU IMPORT

export interface GroupDecisionResolver {
  // ABANS: resolve(room: DecisionRoom, profiles: PreferenceProfile[]): Promise<DecisionOutcome>;
  // ARA:
  resolve(room: DecisionRoom, profiles: UserProfile[]): Promise<DecisionOutcome>;
}