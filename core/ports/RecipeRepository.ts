// src/core/domain/repositories/RecipeRepository.ts
import { Recipe } from '@/core/domain/entities/Recipe';
import { Rating } from '@/core/domain/entities/Rating';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export interface RecipeFilter {
  authorId?: string;
  searchTerm?: string;
  minRating?: number;
  maxTime?: number;
}

export interface RecipeRepository {
  // Escriptura
  save(recipe: Recipe): Promise<void>;
  delete(id: string): Promise<void>;
  
  // Lectura
  findById(id: string): Promise<Recipe | null>;
  search(filter: RecipeFilter): Promise<Recipe[]>;
  
  // Legacy / Helpers
  findRandom(count: number, restrictions: DietaryRestriction[]): Promise<Recipe[]>;

  // Gestió de Vots (Separació de responsabilitats)
  // Guardem el vot i internament el repo actualitzarà la mitjana de la recepta
  addRating(recipeId: string, rating: Rating): Promise<void>;
  
  // Per saber si un usuari ja ha votat una recepta concreta
  getUserRatingForRecipe(userId: string, recipeId: string): Promise<Rating | null>;
}