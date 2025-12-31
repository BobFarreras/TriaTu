// tests/core/domian/RecipeMatcher.test.ts
import { describe, it, expect } from 'vitest';
import { RecipeMatcher } from '@/core/domain/services/RecipeMatcher';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';

describe('RecipeMatcher Service', () => {
  const matcher = new RecipeMatcher();

  const inventory: InventoryItemProps[] = [
    { 
        id: '1', 
        userId: 'test-user', 
        name: 'Ous', 
        quantity: 4, 
        unit: 'ut', 
        location: StorageLocation.FRIDGE,
        addedAt: new Date(), 
        expiryDate: new Date('2025-01-01') 
    },
    { 
        id: '2', 
        userId: 'test-user', 
        name: 'Llet', 
        quantity: 1, 
        unit: 'l', 
        location: StorageLocation.FRIDGE,
        addedAt: new Date(), 
        expiryDate: new Date('2025-01-01')
    }
  ];

  it('hauria de validar una recepta si tenim prou quantitat', () => {
    const feasibleRecipe = new Recipe({
      id: 'r1',
      authorId: 'test',
      name: 'Truita',
      ingredients: [{ name: 'Ous', quantity: 3, unit: 'ut' }],
      steps: ['Pas 1'], 
      tags: [],
      createdAt: new Date()
    });

    const result = matcher.match(feasibleRecipe, inventory);

    expect(result.isPossible).toBe(true);
    expect(result.missingIngredients).toHaveLength(0);
  });

  it('hauria de rebutjar si no tenim prou quantitat', () => {
    const impossibleRecipe = new Recipe({
      id: 'r2',
      authorId: 'test',
      name: 'Pastís Gegant',
      ingredients: [{ name: 'Ous', quantity: 10, unit: 'ut' }],
      steps: ['Pas 1'], 
      tags: [],
      createdAt: new Date()
    });

    const result = matcher.match(impossibleRecipe, inventory);

    expect(result.isPossible).toBe(false);
    expect(result.missingIngredients[0].name).toBe('Ous');
    expect(result.missingIngredients[0].missingQuantity).toBe(6);
  });

  it('hauria de detectar ingredients inexistents', () => {
    const noStockRecipe = new Recipe({
      id: 'r3',
      authorId: 'test',
      // ✅ CANVI CRÍTIC: "Pa" -> "Pa casolà" (Per complir min length 3)
      name: 'Pa casolà',
      ingredients: [{ name: 'Farina', quantity: 500, unit: 'g' }],
      steps: ['Pas 1'], 
      tags: [],
      createdAt: new Date()
    });

    const result = matcher.match(noStockRecipe, inventory);

    expect(result.isPossible).toBe(false);
  });
});