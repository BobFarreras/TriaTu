import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CookRecipe } from '@/core/usecases/inventory/CookRecipe';
import { InventoryRepository } from '@/core/ports/InventoryRepository';
import { RecipeMatcher } from '@/core/domain/services/RecipeMatcher';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';

describe('CookRecipe Use Case', () => {
  let useCase: CookRecipe;
  let mockRepo: InventoryRepository;
  
  // Fixtures
  const userId = 'user-123';

  // ✅ CORRECCIÓ: Usem .create() en lloc de new InventoryItem()
  const existingItem = InventoryItem.create({ 
      id: '1', 
      userId, 
      name: 'Ous', 
      quantity: 12, 
      unit: 'ut', 
      location: StorageLocation.FRIDGE, 
      addedAt: new Date() 
  });

  const existingInventory = [existingItem];

  beforeEach(() => {
    // Mock del repositori
    mockRepo = {
      findByUser: vi.fn().mockResolvedValue(existingInventory),
      batchUpdate: vi.fn().mockResolvedValue(undefined),
      batchDelete: vi.fn().mockResolvedValue(undefined),
      save: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findExpiringSoon: vi.fn().mockResolvedValue([]) 
    };

    useCase = new CookRecipe(mockRepo, new RecipeMatcher());
  });

  it('hauria de restar estoc si hi ha ingredients suficients', async () => {
    const recipe = new Recipe({
      id: 'r1', name: 'Truita', ingredients: [{ name: 'Ous', quantity: 2, unit: 'ut' }],
      steps: [], tags: []
    });

    await useCase.execute(userId, recipe);

    expect(mockRepo.batchUpdate).toHaveBeenCalledWith([
      { id: '1', quantity: 10 } 
    ]);
  });

  it('hauria de llançar error si falten ingredients', async () => {
    const hugeRecipe = new Recipe({
      id: 'r2', name: 'Truita Gegant', ingredients: [{ name: 'Ous', quantity: 50, unit: 'ut' }],
      steps: [], tags: []
    });

    await expect(useCase.execute(userId, hugeRecipe))
      .rejects
      .toThrow('No tens prou ingredients');
    
    expect(mockRepo.batchUpdate).not.toHaveBeenCalled();
  });
});