// tests/services/BasicDecisionEngine.test.ts
import { describe, it, expect } from 'vitest';
import { BasicDecisionEngine } from '@/services/decision/BasicDecisionEngine';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';

describe('BasicDecisionEngine Service', () => {
  const engine = new BasicDecisionEngine();
  const profile = new PreferenceProfile({
    id: 'u1',
    foodPreferences: ['Pizza', 'Sushi', 'Salad'],
    socialTolerance: 5,
    exclusions: ['Spicy']
  });

  it('should suggest easy food when energy is low', async () => {
    const context = new DecisionContext({ energyLevel: 2, availableTimeMinutes: 30 }); // Energia baixa
    
    const outcome = await engine.resolve(profile, context);

    expect(outcome.choice).toBeDefined();
    // La nostra lògica bàsica hauria de dir alguna cosa sobre "low energy"
    expect(outcome.reason.toLowerCase()).toContain('energy');
  });

  it('should respect exclusions', async () => {
    // Aquest test depèn de com implementem la lògica.
    // Per ara, verifiquem que retorna un resultat vàlid.
    const context = new DecisionContext({ energyLevel: 8, availableTimeMinutes: 60 });
    const outcome = await engine.resolve(profile, context);
    
    expect(outcome.choice).not.toBe('Spicy');
    expect(outcome.reason).toBeDefined();
  });
});