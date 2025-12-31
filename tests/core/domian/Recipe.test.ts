// src/core/domain/entities/Recipe.test.ts
import { describe, it, expect } from 'vitest';
import { Recipe } from '@/core/domain/entities/Recipe';


describe('Recipe Entity', () => {
  const validProps = {
    id: '123',
    authorId: 'user-1',
    name: 'Truita de Patates',
    ingredients: [{ name: 'Ous', quantity: 2, unit: 'u' }],
    steps: ['Batre', 'Cuinar'],
    tags: ['tradicional'],
    dietaryTags: ['vegetarian'],
    prepTimeMinutes: 20,
    createdAt: new Date(),
    likesCount: 0,
    isPublic: true,
    ratingSummary: { average: 5, count: 1,distribution: {} }
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

  it('hauria de llançar error si un ingredient és invàlid', () => {
    expect(() => new Recipe({ 
      ...validProps, 
      ingredients: [{ name: '', quantity: -1, unit: '' }] 
    })).toThrow(/nom i quantitat positiva/);
  });

  it('hauria d\'inicialitzar likesCount a 0 si ve null', () => {
   
    const recipe = new Recipe({ ...validProps, likesCount: 0 }); // El constructor de Recipe ja gestiona el null/undefined
    expect(recipe.likesCount).toBe(0);
  });
});