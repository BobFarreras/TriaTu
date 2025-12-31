// ✅ Afegim 'Mock' als imports
import { describe, it, expect, vi, type Mock } from 'vitest';
import { SaveGeneratedRecipe } from '@/core/usecases/recipes/SaveGeneratedRecipe';
import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { Recipe } from '@/core/domain/entities/Recipe';

describe('SaveGeneratedRecipe Use Case', () => {
  it('hauria de guardar una recepta correctament', async () => {
    // 1. Mock del repo
    const mockRepo: RecipeRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
      search: vi.fn(),
      findRandom: vi.fn(),
      addRating: vi.fn(),
      getUserRatingForRecipe: vi.fn()
    };

    const useCase = new SaveGeneratedRecipe(mockRepo);
    
    // 2. Dades de prova
    const recipeProps = {
      id: 'uuid-temporal-ia',
      authorId: 'ai-generated',
      name: 'Macarrons',
      ingredients: [{ name: 'Macarrons', quantity: 100, unit: 'g' }],
      steps: ['Bullir'],
      tags: [],
      createdAt: new Date()
    };

    // 3. Execució
    await useCase.execute('user-123', recipeProps);

    // 4. Verificació
    expect(mockRepo.save).toHaveBeenCalledTimes(1);

    // ✅ CORRECCIÓ: Castegem a 'Mock' per accedir a .mock.calls de manera segura
    // i castegem el resultat a 'Recipe' per poder llegir les props sense errors.
    const saveMock = mockRepo.save as Mock;
    const savedRecipe = saveMock.mock.calls[0][0] as Recipe;

    expect(savedRecipe).toBeInstanceOf(Recipe);
    expect(savedRecipe.props.name).toBe('Macarrons');
  });
});