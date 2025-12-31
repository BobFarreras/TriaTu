// src/core/usecases/community/PublishRecipe.ts
import { RecipeRepository } from '../../ports/RecipeRepository';
import { Recipe, Ingredient } from '../../domain/entities/Recipe';

// Definim el DTO d'entrada (el que ve del formulari/acció)
export interface PublishRecipeRequest {
  name: string;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  dietaryTags: string[];
  prepTimeMinutes: number;
  isPublic?: boolean;
}

export class PublishRecipe {
  constructor(private readonly recipeRepo: RecipeRepository) { }

  async execute(authorId: string, request: PublishRecipeRequest): Promise<void> {
    const newRecipe = new Recipe({
      id: crypto.randomUUID(),
      authorId: authorId,
      name: request.name,
      ingredients: request.ingredients,
      steps: request.steps,
      tags: request.tags,
      dietaryTags: request.dietaryTags,
      prepTimeMinutes: request.prepTimeMinutes,
      createdAt: new Date(),
      isPublic: request.isPublic ?? true,

      likesCount: 0,
      // FIX: Afegim distribution al literal de l'objecte
      ratingSummary: {
        average: 0,
        count: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } // Inicialització explícita (opcional, {} també valdria)
      }
    });

    await this.recipeRepo.save(newRecipe);
  }
}