// tests/domain/PreferenceProfile.test.ts
import { describe, it, expect } from 'vitest';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';

describe('PreferenceProfile Entity', () => {
  it('should be created with valid properties', () => {
    const profile = new PreferenceProfile({
      id: 'user-123',
      foodPreferences: ['Italian', 'Sushi'],
      socialTolerance: 5, // 1-10
      exclusions: ['Peanuts', 'Gluten']
    });

    expect(profile.id).toBe('user-123');
    expect(profile.foodPreferences).toContain('Sushi');
  });

  it('should enforce that exclusions include strict matches', () => {
    const profile = new PreferenceProfile({
      id: 'user-123',
      foodPreferences: [],
      socialTolerance: 5,
      exclusions: ['Peanuts'] // Exclusió estricta
    });

    // Aquest mètode és clau per la lògica de domini
    expect(profile.isExcluded('Peanuts')).toBe(true);
    expect(profile.isExcluded('Almonds')).toBe(false);
  });

  // Opcional: Test de case-insensitivity si volem ser robustos
  it('should be case insensitive for exclusions', () => {
    const profile = new PreferenceProfile({
      id: 'user-123',
      foodPreferences: [],
      socialTolerance: 5,
      exclusions: ['Peanuts']
    });

    expect(profile.isExcluded('peanuts')).toBe(true);
  });
});