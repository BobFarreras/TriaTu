// core/usecases/decision/MakeIndividualDecision.ts
import { DecisionRepository } from '@/core/ports/DecisionRepository';
import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
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
    private readonly profileRepo: PreferenceRepository,
    private readonly resolver: IndividualDecisionResolver
  ) {}

  async execute(input: Input): Promise<Decision> {
    // 1. Recuperar el perfil de l'usuari
    const profile = await this.profileRepo.findByUserId(input.userId);
    if (!profile) {
      throw new Error(`Profile not found for user ${input.userId}`);
    }

    // 2. Crear la decisió en estat PENDING
    // Nota: Utilitzem crypto.randomUUID() (natiu en Node i Browser moderns)
    const decision = new Decision({
      id: crypto.randomUUID(),
      userId: input.userId,
      type: input.type,
      context: input.context
    });

    // 3. Delegar la "intel·ligència" al Resolver
    const outcome = await this.resolver.resolve(profile, input.context);

    // 4. Aplicar el resultat a la decisió
    decision.resolve(outcome);

    // 5. Persistir
    await this.decisionRepo.save(decision);

    return decision;
  }
}