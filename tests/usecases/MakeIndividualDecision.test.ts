// tests/usecases/MakeIndividualDecision.test.ts
import { describe, it, expect, vi, type Mock } from 'vitest';
import { MakeIndividualDecision } from '@/core/usecases/decision/MakeIndividualDecision';
import { DecisionRepository } from '@/core/ports/DecisionRepository';
import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
import { IndividualDecisionResolver } from '@/core/ports/IndividualDecisionResolver';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { DecisionType, DecisionStatus } from '@/core/domain/entities/Decision';

// Mocks
const mockDecisionRepo = { save: vi.fn(), findById: vi.fn() } as unknown as DecisionRepository;
const mockProfileRepo = { findByUserId: vi.fn() } as unknown as PreferenceRepository;
const mockResolver = { resolve: vi.fn() } as unknown as IndividualDecisionResolver;

describe('MakeIndividualDecision UseCase', () => {
  it('should orchestration a decision flow correctly', async () => {
    // 1. SETUP
    const useCase = new MakeIndividualDecision(
      mockDecisionRepo,
      mockProfileRepo,
      mockResolver
    );

    const userId = 'user-1';
    // Simulem que l'usuari té un perfil
    (mockProfileRepo.findByUserId as Mock).mockResolvedValue(
      new PreferenceProfile({
        id: userId,
        foodPreferences: ['Pasta'],
        socialTolerance: 5,
        exclusions: []
      })
    );

    // Simulem que el resolver decideix "Pasta"
    const expectedOutcome = new DecisionOutcome({ choice: 'Pasta', reason: 'You love it' });
    (mockResolver.resolve as Mock).mockResolvedValue(expectedOutcome);

    // 2. EXECUTE
    const context = new DecisionContext({ energyLevel: 8, availableTimeMinutes: 30 });
    const decision = await useCase.execute({
      userId,
      type: DecisionType.FOOD,
      context
    });

    // 3. VERIFY
    // Ha de retornar una decisió resolta
    expect(decision.status).toBe(DecisionStatus.RESOLVED);
    expect(decision.outcome).toEqual(expectedOutcome);
    expect(decision.userId).toBe(userId);

    // Ha d'haver guardat la decisió al repositori
    expect(mockDecisionRepo.save).toHaveBeenCalledTimes(1);
    const savedDecision = (mockDecisionRepo.save as Mock).mock.calls[0][0];
    expect(savedDecision.status).toBe(DecisionStatus.RESOLVED);
  });

  it('should throw error if user profile is missing', async () => {
    const useCase = new MakeIndividualDecision(mockDecisionRepo, mockProfileRepo, mockResolver);
    (mockProfileRepo.findByUserId as Mock).mockResolvedValue(null);

    await expect(useCase.execute({
      userId: 'ghost',
      type: DecisionType.FOOD,
      context: new DecisionContext({ energyLevel: 5, availableTimeMinutes: 10 })
    })).rejects.toThrow(/Profile not found/);
  });
});