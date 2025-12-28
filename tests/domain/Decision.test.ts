// tests/domain/Decision.test.ts
import { describe, it, expect } from 'vitest';
import { Decision, DecisionStatus, DecisionType } from '@/core/domain/entities/Decision';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

describe('Decision Entity', () => {
  
  // 1. Testejem el Value Object (Context)
  it('should validate DecisionContext logic', () => {
    // Cas vàlid
    const context = new DecisionContext({
      energyLevel: 5,
      availableTimeMinutes: 30
    });
    expect(context.energyLevel).toBe(5);

    // Cas invàlid: Energia fora de rang
    expect(() => {
      new DecisionContext({ energyLevel: 11, availableTimeMinutes: 10 });
    }).toThrow(/Energy level must be between 0 and 10/);
  });

  // 2. Testejem l'Entitat (Cicle de vida)
  it('should handle decision lifecycle', () => {
    const context = new DecisionContext({ energyLevel: 5, availableTimeMinutes: 60 });
    
    // Crear decisió PENDING
    const decision = new Decision({
      id: 'dec-1',
      userId: 'user-1',
      type: DecisionType.FOOD,
      context
    });

    expect(decision.status).toBe(DecisionStatus.PENDING);
    expect(decision.outcome).toBeUndefined();

    // Resoldre decisió
    const outcome = new DecisionOutcome({
      choice: 'Pizza',
      reason: 'Low energy, high reward'
    });

    decision.resolve(outcome);

    expect(decision.status).toBe(DecisionStatus.RESOLVED);
    expect(decision.outcome).toEqual(outcome);
  });

  // 3. Testejem Invariants
  it('should not allow resolving a completed decision', () => {
    const context = new DecisionContext({ energyLevel: 5, availableTimeMinutes: 60 });
    const decision = new Decision({
      id: 'dec-1',
      userId: 'user-1',
      type: DecisionType.FOOD,
      context
    });

    const outcome = new DecisionOutcome({ choice: 'A', reason: 'B' });
    decision.resolve(outcome);

    // Intentar resoldre de nou ha de fallar
    expect(() => {
      decision.resolve(outcome);
    }).toThrow(/Cannot resolve a decision that is not PENDING/);
  });
});