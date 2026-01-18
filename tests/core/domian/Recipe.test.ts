import { describe, it, expect } from 'vitest';
import { Recipe, RecipeProps, Ingredient } from '@/core/domain/entities/Recipe';

describe('Recipe Entity', () => {
  // Mock d'un ingredient vàlid
  const validIngredient: Ingredient = {
      id: 'ing-1',
      name: 'Ous',
      quantity: 2,
      unit: 'u',
      linkedProductId: null,
      linkedProductImage: null,
      estimatedCost: 0
  };

  // Mock de propietats base vàlides
  const validProps: RecipeProps = {
    id: '123',
    authorId: 'user-1',
    name: 'Truita de Patates',
    ingredients: [validIngredient],
    steps: ['Batre', 'Cuinar'],
    tags: ['tradicional'],
    dietaryTags: ['vegetarian'],
    prepTimeMinutes: 20,
    createdAt: new Date(),
    likesCount: 0,
    isPublic: true,
    ratingSummary: { average: 5, count: 1, distribution: {} }
  };

  it('hauria de crear una instància vàlida', () => {
    const recipe = new Recipe(validProps);
    expect(recipe.id).toBe('123');
    expect(recipe.name).toBe('Truita de Patates');
  });

  it('hauria de llançar error si el nom és massa curt', () => {
    expect(() => new Recipe({ ...validProps, name: 'Pa' })).toThrow(/3 caràcters/);
  });

  it('hauria de llançar error sense ingredients', () => {
    expect(() => new Recipe({ ...validProps, ingredients: [] })).toThrow(/ingredient/);
  });

  it('hauria de llançar error si un ingredient és invàlid (quantitat negativa)', () => {
    const badIngredient: Ingredient = { 
        id: 'bad-1', 
        name: 'Ous', 
        quantity: -1, 
        unit: 'u' 
    };

    expect(() => new Recipe({ 
      ...validProps, 
      ingredients: [badIngredient] 
    })).toThrow(/quantitat positiva/);
  });

  it('hauria de llançar error si un ingredient no té nom', () => {
    const unnamedIngredient: Ingredient = { 
        id: 'bad-2', 
        name: '', 
        quantity: 5, 
        unit: 'u' 
    };

    expect(() => new Recipe({ 
      ...validProps, 
      ingredients: [unnamedIngredient] 
    })).toThrow(/no té nom/);
  });

  it('hauria de permetre crear recepta amb likesCount a 0', () => {
    const recipe = new Recipe({ ...validProps, likesCount: 0 });
    expect(recipe.props.likesCount).toBe(0);
  });
});