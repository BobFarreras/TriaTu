// tests/usecases/MakeIndividualDecision.test.ts
import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import { MakeIndividualDecision } from '@/core/usecases/decision/MakeIndividualDecision';
import { DecisionRepository } from '@/core/ports/DecisionRepository';
import { UserProfileRepository } from '@/core/ports/UserProfileRepository'; // Canviat
import { IndividualDecisionResolver } from '@/core/ports/IndividualDecisionResolver';
import { UserProfile } from '@/core/domain/entities/UserProfile'; // Canviat
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { DecisionType, DecisionStatus } from '@/core/domain/entities/Decision';

// Mocks tipats
const mockDecisionRepo = { save: vi.fn(), findById: vi.fn() } as unknown as DecisionRepository;
// Ara usem getById en lloc de findByUserId
const mockProfileRepo = { getById: vi.fn() } as unknown as UserProfileRepository;
const mockResolver = { resolve: vi.fn() } as unknown as IndividualDecisionResolver;

describe('MakeIndividualDecision UseCase', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should orchestrate a decision flow correctly', async () => {
    // 1. SETUP
    const useCase = new MakeIndividualDecision(
      mockDecisionRepo,
      mockProfileRepo,
      mockResolver
    );

    const userId = 'user-1';
    
    // Stub del perfil usant la nova Entitat UserProfile
    (mockProfileRepo.getById as Mock).mockResolvedValue(
      new UserProfile(
        userId,
        [], // Exclusions
        ['Pasta'], // Preferències
        5 // Tolerància
      )
    );

    // Stub del servei de domini (Resolver)
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
    expect(decision.status).toBe(DecisionStatus.RESOLVED);
    expect(decision.outcome).toEqual(expectedOutcome);
    expect(decision.userId).toBe(userId);

    // Validem persistència
    expect(mockDecisionRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should throw DomainError if user profile is missing', async () => {
    const useCase = new MakeIndividualDecision(mockDecisionRepo, mockProfileRepo, mockResolver);
    // Simulem retorn null
    (mockProfileRepo.getById as Mock).mockResolvedValue(null);

    await expect(useCase.execute({
      userId: 'ghost',
      type: DecisionType.FOOD,
      context: new DecisionContext({ energyLevel: 5, availableTimeMinutes: 10 })
    })).rejects.toThrow(/Profile not found/);
  });
});