// tests/usecases/community/CommunityFlow.test.ts
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { PublishRecipe } from '@/core/usecases/community/PublishRecipe';
import { RateRecipe } from '@/core/usecases/community/RateRecipe';
import { RecipeRepository } from '@/core/ports/RecipeRepository'; // Ajusta la ruta al teu Port
import { Recipe } from '@/core/domain/entities/Recipe';

describe('Community Features Use Cases', () => {
  let mockRepo: RecipeRepository;
  let publishUseCase: PublishRecipe;
  let rateUseCase: RateRecipe;

  beforeEach(() => {
    // Mock manual del repo
    mockRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      addRating: vi.fn(),
      search: vi.fn(),
      delete: vi.fn(),
      findRandom: vi.fn(),
      getUserRatingForRecipe: vi.fn(),
      // ... altres mètodes del teu port
    } as unknown as RecipeRepository;

    publishUseCase = new PublishRecipe(mockRepo);
    rateUseCase = new RateRecipe(mockRepo);
  });

  describe('PublishRecipe', () => {
    it('hauria de crear i guardar una recepta vàlida', async () => {
      const input = {
        name: 'Paella Valenciana',
        ingredients: [{ name: 'Arròs', quantity: 500, unit: 'g' }],
        steps: ['Sofregir', 'Bullir'],
        tags: ['Diumenge']
      };

      await publishUseCase.execute('user-chef', input);

      expect(mockRepo.save).toHaveBeenCalledTimes(1);
      
      const saveMock = mockRepo.save as Mock;
      const savedRecipe = saveMock.mock.calls[0][0] as Recipe;
      
      expect(savedRecipe.authorId).toBe('user-chef');
      expect(savedRecipe.ratingSummary.average).toBe(0);
      expect(savedRecipe.id).toBeDefined();
    });

    it('hauria de fallar si l\'entitat rebutja les dades (ex: sense passos)', async () => {
        const invalidInput = {
            name: 'Paella Fail',
            ingredients: [{ name: 'Arròs', quantity: 500, unit: 'g' }],
            steps: [], // Buit -> Error de Domini
            tags: []
        };
  
        await expect(publishUseCase.execute('user-chef', invalidInput))
          .rejects.toThrow(/instruccions/);
    });
  });

  describe('RateRecipe', () => {
    it('hauria de permetre votar una recepta existent', async () => {
      // Simulem que la recepta existeix
      (mockRepo.findById as Mock).mockResolvedValue(new Recipe({
          id: 'r1', authorId: 'other', name: 'Test', ingredients: [{name:'a', quantity:1, unit:'u'}], steps: ['s'], tags: [], createdAt: new Date()
      }));

      await rateUseCase.execute({
          userId: 'voter-1',
          recipeId: 'r1',
          value: 5,
          comment: 'Deliciós!'
      });

      expect(mockRepo.addRating).toHaveBeenCalledWith('r1', expect.objectContaining({
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
      })).rejects.toThrow("La recepta no existeix");
    });

    it('hauria de fallar si la puntuació és invàlida (validació de Value Object)', async () => {
       // Mock de recepta existent
       (mockRepo.findById as Mock).mockResolvedValue(new Recipe({
        id: 'r1', authorId: 'other', name: 'Test', ingredients: [{name:'a', quantity:1, unit:'u'}], steps: ['s'], tags: [], createdAt: new Date()
       }));

       // Valor 10 -> Error
       await expect(rateUseCase.execute({
        userId: 'voter-1',
        recipeId: 'r1',
        value: 10 
       })).rejects.toThrow();
    });
  });
});