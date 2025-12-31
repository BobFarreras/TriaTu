// src/core/usecases/community/RateRecipe.ts
import { Rating } from '@/core/domain/entities/Rating';
import { RecipeRepository } from '@/core/ports/RecipeRepository'; // O ports/RecipeRepository segons la teva estructura

interface RateRecipeInput {
  recipeId: string;
  userId: string;
  value: number;
  comment?: string;
}

export class RateRecipe {
  constructor(private recipeRepo: RecipeRepository) {}

  async execute(input: RateRecipeInput): Promise<void> {
    // 1. Validar que la recepta existeix
    const recipe = await this.recipeRepo.findById(input.recipeId);
    if (!recipe) {
      throw new Error("La recepta no existeix.");
    }

    // 2. Regla de Negoci: No pots votar la teva pròpia recepta?
    // (Ho deixem comentat, depèn de si vols permetre l'auto-bombo)
    /* if (recipe.authorId === input.userId) {
       throw new Error("No pots valorar la teva pròpia recepta.");
    }
    */

    // 3. Crear el Value Object (valida que sigui 1-5 i comentari < 500 chars)
    const rating = new Rating({
      userId: input.userId,
      value: input.value,
      comment: input.comment,
      createdAt: new Date()
    });

    // 4. Persistir
    // Nota: El repositori s'encarregarà de si és un INSERT o un UPDATE
    // i de recalcular la mitjana si cal (o ho fem via trigger a DB al Pas 3)
    await this.recipeRepo.addRating(input.recipeId, rating);
  }
}