import { describe, it, expect, vi } from 'vitest';
import { SaveGeneratedRecipe } from '@/core/usecases/recipes/SaveGeneratedRecipe';
import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { Recipe } from '@/core/domain/entities/Recipe';

describe('SaveGeneratedRecipe Use Case', () => {
  it('hauria de guardar una recepta correctament', async () => {
    // 1. Mock COMPLERT del repo
    const mockRepo: RecipeRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAllByUser: vi.fn() // ✅ Afegim aquest mètode tot i que no s'usi en aquest test específic
    };

    const useCase = new SaveGeneratedRecipe(mockRepo);
    
    const recipeProps = {
      id: 'uuid-temporal-ia',
      name: 'Macarrons',
      ingredients: [],
      steps: [],
      tags: []
    };

    await useCase.execute('user-123', recipeProps);

    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    // TypeScript necessita ajuda per saber que el mock ha estat cridat
    // Fem un casting segur per inspeccionar la crida
    const saveCall = (mockRepo.save as ReturnType<typeof vi.fn>).mock.calls[0];
    const savedRecipe = saveCall[0] as Recipe;
    
    expect(savedRecipe).toBeInstanceOf(Recipe);
    expect(savedRecipe.props.name).toBe('Macarrons');
  });
});