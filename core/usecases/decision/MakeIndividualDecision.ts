import { DecisionRepository } from '@/core/ports/DecisionRepository';
// ✅ CANVI 1: Nova interfície
import { UserProfileRepository } from '@/core/ports/UserProfileRepository';
import { IndividualDecisionResolver } from '@/core/ports/IndividualDecisionResolver';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { Decision, DecisionType } from '@/core/domain/entities/Decision';

type Input = {
  userId: string;
  type: DecisionType;
  context: DecisionContext;
};

export class MakeIndividualDecision {
  constructor(
    private readonly decisionRepo: DecisionRepository,
    // ✅ CANVI 2: Tipus nou
    private readonly profileRepo: UserProfileRepository,
    private readonly resolver: IndividualDecisionResolver
  ) {}

  async execute(input: Input): Promise<Decision> {
    // ✅ CANVI 3: Mètode nou (getById)
    const profile = await this.profileRepo.getById(input.userId);
    
    if (!profile) {
      throw new Error(`Profile not found for user ${input.userId}`);
    }

    const decision = new Decision({
      id: crypto.randomUUID(),
      userId: input.userId,
      type: input.type,
      context: input.context
    });

    // Nota: Assegura't que el resolver accepta 'UserProfile' ara
    const outcome = await this.resolver.resolve(profile, input.context);

    decision.resolve(outcome);

    await this.decisionRepo.save(decision);

    return decision;
  }
}