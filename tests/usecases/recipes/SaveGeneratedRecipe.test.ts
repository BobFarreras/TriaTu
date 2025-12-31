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
      getUserRatingForRecipe: vi.fn(),
      findAllByUser: vi.fn(), // Afegim els mètodes que falten al mock per si de cas
      rate: vi.fn(),
      getUserRatingsMap: vi.fn()
    };

    const useCase = new SaveGeneratedRecipe(mockRepo);
    
    // 2. Dades de prova (INSTÀNCIA REAL DE RECIPE)
    // Ara el constructor valida, així que hem de passar TOTS els camps requerits
    const recipe = new Recipe({
      id: 'uuid-temporal-ia',
      authorId: 'ai-generated',
      name: 'Macarrons',
      ingredients: [{ name: 'Macarrons', quantity: 100, unit: 'g' }],
      steps: ['Bullir'],
      tags: [],
      createdAt: new Date(),
      // Camps obligatoris per passar la validació estricta:
      dietaryTags: [],
      prepTimeMinutes: 15,
      likesCount: 0,
      isPublic: false,
      ratingSummary: { average: 0, count: 0, distribution: {} }
    });

    // 3. Execució
    // ⚠️ CORRECCIÓ: L'ordre és (recipe, userId), no al revés.
    await useCase.execute(recipe, 'user-123');

    // 4. Verificació
    expect(mockRepo.save).toHaveBeenCalledTimes(1);

    const saveMock = mockRepo.save as Mock;
    const savedRecipe = saveMock.mock.calls[0][0] as Recipe;

    expect(savedRecipe).toBeInstanceOf(Recipe);
    // Comprovem que s'ha fet l'"adopció" (canvi d'ID)
    expect(savedRecipe.authorId).toBe('user-123'); 
    expect(savedRecipe.props.name).toBe('Macarrons');
  });
});