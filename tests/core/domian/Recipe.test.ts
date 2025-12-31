// src/core/domain/entities/Recipe.test.ts
import { describe, it, expect } from 'vitest';
import { Recipe } from '@/core/domain/entities/Recipe';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

describe('Recipe Domain Entity', () => {
  
  // Helper per crear receptes vàlides ràpidament als tests
  const createValidRecipeProps = () => ({
    id: '1',
    authorId: 'user-123',
    name: 'Espaguetis a la Carbonara',
    ingredients: [{ name: 'Espaguetis', quantity: 100, unit: 'g' }],
    steps: ['Bullir pasta', 'Barrejar ou'],
    tags: ['Italiana'],
    createdAt: new Date()
  });

  it('hauria de crear una recepta vàlida amb tots els camps obligatoris', () => {
    const props = createValidRecipeProps();
    const recipe = new Recipe(props);

    expect(recipe.name).toBe('Espaguetis a la Carbonara');
    expect(recipe.ingredients.length).toBe(1);
    expect(recipe.ratingSummary.average).toBe(0); // Valor per defecte
  });

  it('hauria de llançar error si el nom és massa curt', () => {
    const props = createValidRecipeProps();
    props.name = 'A'; // Invàlid

    expect(() => new Recipe(props)).toThrow('El nom de la recepta ha de tenir almenys 3 caràcters');
  });

  it('hauria de llançar error si no té ingredients', () => {
    const props = createValidRecipeProps();
    props.ingredients = []; // Invàlid

    expect(() => new Recipe(props)).toThrow('La recepta ha de tenir almenys un ingredient');
  });

  it('hauria de detectar conflictes amb restriccions dietètiques (Mantingut)', () => {
    const props = createValidRecipeProps();
    props.name = 'Pollastre Satay';
    props.ingredients = [{ name: 'Cacauet', quantity: 10, unit: 'g' }];

    const recipe = new Recipe(props);
    const allergy = DietaryRestriction.NUT_ALLERGY;

    expect(recipe.isSafeFor([allergy])).toBe(false); 
  });
});