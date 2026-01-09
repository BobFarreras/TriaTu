// tests/domain/UserProfile.test.ts
import { describe, it, expect } from 'vitest';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

describe('UserProfile Entity', () => {
  it('should be created with valid properties via constructor', () => {
    const profile = new UserProfile(
      'user-123',
      [DietaryRestriction.NUT_ALLERGY], // Restrictions
      ['Italian', 'Sushi'],             // Preferences
      5                                 // Tolerance
    );

    expect(profile.id).toBe('user-123');
    expect(profile.preferences).toContain('Sushi');
    // Verifiquem getter de foodPreferences (alias)
    expect(profile.foodPreferences).toEqual(['Italian', 'Sushi']);
  });

  it('should manage restrictions correctly', () => {
    const profile = new UserProfile(
      'user-123',
      [DietaryRestriction.VEGAN],
      [],
      5
    );

    // Verifiquem que la restricció està present
    expect(profile.restrictions).toContain(DietaryRestriction.VEGAN);
    expect(profile.restrictions).not.toContain(DietaryRestriction.NUT_ALLERGY);
  });

  it('should add new restrictions without duplicating', () => {
    const profile = new UserProfile('u1', [DietaryRestriction.VEGAN], [], 5);

    // Afegim una nova
    profile.addRestriction(DietaryRestriction.GLUTEN_FREE);
    expect(profile.restrictions).toHaveLength(2);
    expect(profile.restrictions).toContain(DietaryRestriction.GLUTEN_FREE);

    // Intentem afegir un duplicat
    profile.addRestriction(DietaryRestriction.VEGAN);
    expect(profile.restrictions).toHaveLength(2); // No hauria de canviar
  });

  it('should set and get username and avatar', () => {
    const profile = new UserProfile('u1');
    
    profile.setUsername('Chef Curry');
    profile.setAvatar('🍛');

    expect(profile.username).toBe('Chef Curry');
    expect(profile.avatarEmoji).toBe('🍛');
  });
});