import { describe, it, expect } from 'vitest';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction'; // El teu Enum

describe('UserProfile Entity', () => {
  it('hauria de crear un perfil vàlid', () => {
    const profile = new UserProfile('user-123');
    expect(profile.id).toBe('user-123');
    expect(profile.restrictions).toHaveLength(0);
  });

  it('hauria de poder afegir restriccions (evitant duplicats)', () => {
    const profile = new UserProfile('user-123');
    
    // CORRECCIÓ: Usem l'Enum directament, no 'new'
    const gluten = DietaryRestriction.GLUTEN_FREE;

    profile.addRestriction(gluten);
    profile.addRestriction(gluten); // Intentem afegir el mateix dos cops

    expect(profile.restrictions).toHaveLength(1);
    expect(profile.restrictions[0]).toBe(DietaryRestriction.GLUTEN_FREE);
  });

  it('hauria de gestionar preferències culinàries', () => {
    const profile = new UserProfile('user-123');
    
    profile.addPreference('Mexicà');
    profile.addPreference('mexicà'); // Test de normalització

    expect(profile.preferences).toHaveLength(1); // Hauria de detectar que és el mateix
    expect(profile.preferences[0]).toBe('Mexicà');
  });
});