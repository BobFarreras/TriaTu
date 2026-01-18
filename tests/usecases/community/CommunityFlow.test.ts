import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { PublishRecipe } from '@/core/usecases/community/PublishRecipe';
import { RateRecipe } from '@/core/usecases/community/RateRecipe';
import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { Recipe } from '@/core/domain/entities/Recipe';

describe('Community Features Use Cases', () => {
  let mockRepo: RecipeRepository;
  let publishUseCase: PublishRecipe;
  let rateUseCase: RateRecipe;

  // Dades base vàlides per reutilitzar als tests
  const validRecipeProps = {
      id: '123',
      authorId: 'user-1',
      name: 'Recepta Comunitària',
      ingredients: [{ 
          id: 'ing-1', 
          name: 'Ous', 
          quantity: 2, 
          unit: 'u',
          linkedProductId: null,
          linkedProductImage: null,
          estimatedCost: 0
      }],
      steps: ['Pas 1'],
      tags: ['facil'],
      dietaryTags: [],
      prepTimeMinutes: 20,
      createdAt: new Date(),
      likesCount: 0,
      isPublic: true,
      ratingSummary: { average: 0, count: 0, distribution: {} },
      isAiGenerated: false,
      estimatedCost: 0
  };

  beforeEach(() => {
    // ✅ FIX: Usem 'unknown' per enganyar TypeScript de forma segura (sense 'any')
    mockRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      addRating: vi.fn(),
      search: vi.fn(),
      delete: vi.fn(),
      findRandom: vi.fn(),
      getUserRatingForRecipe: vi.fn(),
    } as unknown as RecipeRepository;

    publishUseCase = new PublishRecipe(mockRepo);
    rateUseCase = new RateRecipe(mockRepo);
  });

  describe('PublishRecipe', () => {
    it('hauria de crear i guardar una recepta vàlida amb tots els camps requerits', async () => {
      const input = {
        name: 'Paella Valenciana',
        ingredients: [
            { id: 'ing-1', name: 'Arròs', quantity: 500, unit: 'g' }
        ],
        steps: ['Sofregir', 'Bullir'],
        tags: ['Diumenge'],
        dietaryTags: ['Gluten-Free'],
        prepTimeMinutes: 45,
        isPublic: true
      };

      await publishUseCase.execute('user-chef', input);

      expect(mockRepo.save).toHaveBeenCalledTimes(1);
      
      const saveMock = mockRepo.save as Mock;
      // Recuperem l'objecte que s'ha passat al save
      const savedRecipe = saveMock.mock.calls[0][0] as Recipe;
      
      expect(savedRecipe.authorId).toBe('user-chef');
      expect(savedRecipe.ratingSummary.average).toBe(0); 
      
      // ⚠️ NOTA: Si 'isPublic' et dóna error aquí, assegura't que has desat 
      // el fitxer Recipe.ts amb els getters que vam fer al pas anterior.
      expect(savedRecipe.isPublic).toBe(true);
      expect(savedRecipe.id).toBeDefined();
    });

    it('hauria de fallar si l\'entitat rebutja les dades (ex: sense passos)', async () => {
       const invalidInput = {
           name: 'Paella Fail',
           ingredients: [
               { id: 'ing-fail', name: 'Arròs', quantity: 500, unit: 'g' }
           ],
           steps: [], // ❌ Array buit -> Error
           tags: [],
           dietaryTags: [],
           prepTimeMinutes: 0
       };
  
       // ✅ FIX ESLINT: Desactivem la regla 'no-explicit-any' només per aquesta línia
       // perquè necessitem forçar un tipus incorrecte per provar l'error.
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       await expect(publishUseCase.execute('user-chef', invalidInput as any))
         .rejects.toThrow(); 
    });
  });

  describe('RateRecipe', () => {
    it('hauria de permetre votar una recepta existent', async () => {
      const existingRecipe = new Recipe(validRecipeProps);

      (mockRepo.findById as Mock).mockResolvedValue(existingRecipe);

      await rateUseCase.execute({
          userId: 'voter-1',
          recipeId: '123',
          value: 5,
          comment: 'Deliciós!'
      });

      expect(mockRepo.addRating).toHaveBeenCalledWith('123', expect.objectContaining({
          value: 5,
          userId: 'voter-1'
      }));
    });

    it('hauria de fallar si la recepta no existeix', async () => {
      (mockRepo.findById as Mock).mockResolvedValue(null);

      await expect(rateUseCase.execute({
          userId: 'voter-1',
          recipeId: 'ghost-recipe',
          value: 5
      })).rejects.toThrow(/trobada|exist/);
    });

    it('hauria de fallar si la puntuació és invàlida', async () => {
       const existingRecipe = new Recipe(validRecipeProps);

       (mockRepo.findById as Mock).mockResolvedValue(existingRecipe);

       await expect(rateUseCase.execute({
        userId: 'voter-1',
        recipeId: '123',
        value: 10 // ❌ Puntuació il·legal
       })).rejects.toThrow();
    });
  });
});