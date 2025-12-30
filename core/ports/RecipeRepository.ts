import { Recipe } from '@/core/domain/entities/Recipe';

export interface RecipeRepository {
  save(recipe: Recipe, userId: string): Promise<void>;
  findById(id: string): Promise<Recipe | null>;
  // ✅ NOU MÈTODE
  findAllByUser(userId: string): Promise<Recipe[]>;
}