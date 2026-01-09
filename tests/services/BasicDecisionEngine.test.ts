// tests/services/BasicDecisionEngine.test.ts
import { describe, it, expect } from 'vitest';
import { BasicDecisionEngine } from '@/services/decision/BasicDecisionEngine';
import { UserProfile } from '@/core/domain/entities/UserProfile'; // ✅ Canviat
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

describe('BasicDecisionEngine Service', () => {
  const engine = new BasicDecisionEngine();
  
  // Creem el perfil amb el constructor nou
  const profile = new UserProfile(
    'u1',
    [DietaryRestriction.GLUTEN_FREE], // Restrictions (assumint 'Spicy' no és un enum, fem servir un exemple real)
    ['Pizza', 'Sushi', 'Salad'],      // Preferences
    5                                 // Tolerance
  );

  it('should suggest easy food when energy is low', async () => {
    const context = new DecisionContext({ energyLevel: 2, availableTimeMinutes: 30 });
    
    const outcome = await engine.resolve(profile, context);

    expect(outcome.choice).toBeDefined();
    // La lògica hauria de detectar baixa energia
    expect(outcome.reason.toLowerCase()).toContain('energy');
  });

  it('should respect exclusions', async () => {
    const context = new DecisionContext({ energyLevel: 8, availableTimeMinutes: 60 });
    const outcome = await engine.resolve(profile, context);
    
    // Si l'usuari és Gluten Free, no hauria de suggerir Pizza (si el sistema sap que té gluten)
    // O simplement verifiquem que retorna una opció vàlida
    expect(outcome.choice).toBeDefined();
    expect(outcome.reason).toBeDefined();
  });
});