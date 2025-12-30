import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { Recipe } from '@/core/domain/entities/Recipe';

export class GetRecipe {
  constructor(private recipeRepo: RecipeRepository) {}

  async execute(id: string): Promise<Recipe | null> {
    return this.recipeRepo.findById(id);
  }
}