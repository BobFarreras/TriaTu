import { Rating } from '@/core/domain/entities/Rating';
import { RecipeRepository } from '@/core/ports/RecipeRepository';

interface RateRecipeRequest {
  userId: string;
  recipeId: string;
  value: number;
  comment?: string;
}

export class RateRecipe {
  constructor(private readonly repository: RecipeRepository) {}

  async execute(request: RateRecipeRequest): Promise<void> {
    // 1. Comprovar existència (Test: "fallar si la recepta no existeix")
    const recipe = await this.repository.findById(request.recipeId);
    if (!recipe) {
      throw new Error("La recepta no existeix");
    }

    // 2. Crear l'Entitat (Aquí és on fallava el test)
    // L'entitat Rating validarà si el valor és entre 1 i 5
    const rating = new Rating({
      userId: request.userId,
      value: request.value,
      comment: request.comment,
      createdAt: new Date(),
      recipeId: request.recipeId // ✅ AFEGIT: Ara passem la ID necessària
    });

    // 3. Persistir
    await this.repository.addRating(request.recipeId, rating);
  }
}