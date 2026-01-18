// tests/core/application/use-cases/DeleteRecipe.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteRecipe } from '@/core/usecases/recipes/DeleteRecipe';
import { RecipeRepository } from '@/core/ports/RecipeRepository';


describe('DeleteRecipe Use Case', () => {
  let deleteRecipe: DeleteRecipe;
  let mockRepo: RecipeRepository;

  beforeEach(() => {
    mockRepo = {
      delete: vi.fn(),
      // ... altres mocks necessaris per complir la interfície (poden ser undefined si TS ho permet o mocks buits)
      save: vi.fn(),
      findById: vi.fn(),
      findByUser: vi.fn(),
    } as unknown as RecipeRepository;
    
    deleteRecipe = new DeleteRecipe(mockRepo);
  });

  it('should call repository delete with correct parameters', async () => {
    const recipeId = 'recipe-123';
    const userId = 'user-abc';

    await deleteRecipe.execute(recipeId, userId);

    expect(mockRepo.delete).toHaveBeenCalledWith(recipeId, userId);
    expect(mockRepo.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw error if recipeId is missing', async () => {
    await expect(deleteRecipe.execute('', 'user-abc')).rejects.toThrow('Recipe ID is required');
  });

  it('should propagate repository errors', async () => {
    const error = new Error('DB Error');
    vi.mocked(mockRepo.delete).mockRejectedValueOnce(error);

    await expect(deleteRecipe.execute('123', 'abc')).rejects.toThrow('DB Error');
  });
});