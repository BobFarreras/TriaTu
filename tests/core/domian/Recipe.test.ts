import { describe, it, expect } from 'vitest';
import { Recipe } from '@/core/domain/entities/Recipe';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

describe('Recipe Domain Entity', () => {
  
  it('hauria de crear una recepta vàlida amb ingredients i passos', () => {
    const recipe = new Recipe({
      id: '1',
      name: 'Espaguetis a la Carbonara',
      ingredients: [
        { name: 'Espaguetis', quantity: 100, unit: 'g' } // Ingredient simple (Value Object implicit)
      ],
      steps: ['Bullir pasta', 'Barrejar ou i formatge'],
      tags: ['Italiana', 'Ràpida']
    });

    // ACCÉS CORRECTE: Accedim via .props o getters
    expect(recipe.props.name).toBe('Espaguetis a la Carbonara');
    expect(recipe.props.ingredients.length).toBe(1);
  });

  it('hauria de detectar conflictes amb restriccions dietètiques', () => {
    const recipe = new Recipe({
      id: '2',
      name: 'Pollastre Satay',
      ingredients: [
        { name: 'Cacauet', quantity: 10, unit: 'g' }
      ],
      steps: ['Cuinar'],
      tags: []
    });

    const allergy = DietaryRestriction.NUT_ALLERGY;

    expect(recipe.isSafeFor([allergy])).toBe(false); 
  });
});