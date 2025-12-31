import { Recipe } from '@/core/domain/entities/Recipe';
import { RecipeRepository, RecipeFilter } from '@/core/ports/RecipeRepository';

export class SearchRecipes {
  constructor(private readonly repository: RecipeRepository) {}

  async execute(filter: RecipeFilter): Promise<{ recipes: Recipe[]; total: number }> {
    // Aquí podries afegir lògica de negoci extra, ex: limitar la cerca a usuaris free
    return this.repository.search(filter);
  }
}