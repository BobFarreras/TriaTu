import { Recipe } from '@/core/domain/entities/Recipe';
import { Rating } from '@/core/domain/entities/Rating';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export interface RecipeFilter {
    searchTerm?: string;
    maxTimeMinutes?: number;
    minRating?: number;
    tags?: string[];
    limit?: number;
    offset?: number;
    userId?: string;
    filterMode?: 'ALL' | 'MINE' | 'FAVORITES';
}
// Definim el criteri de cerca avançada
export interface MatchCriteria {
    userId: string;
    limit: number;
    // Podries afegir més coses aquí si cal (tags, etc.)
}
export interface RecipeRepository {
    save(recipe: Recipe): Promise<void>;
    search(filter: RecipeFilter): Promise<{ recipes: Recipe[]; total: number }>;
    findById(id: string): Promise<Recipe | null>;

    // ✅ IMPRESCINDIBLE per SuggestRecipes
    findAllByUser(userId: string): Promise<Recipe[]>;

    findRandom(count: number, restrictions: DietaryRestriction[]): Promise<Recipe[]>;
    delete(id: string, authorId: string): Promise<void>;

    // ✅ IMPRESCINDIBLE per RateRecipe (addRating estava faltant a la interfície)
    rate(rating: Rating): Promise<void>;
    addRating(recipeId: string, rating: Rating): Promise<void>;

    getUserRatingForRecipe(userId: string, recipeId: string): Promise<Rating | null>;
    getUserRatingsMap(userId: string, recipeIds: string[]): Promise<Record<string, number>>;
    findMatches(criteria: MatchCriteria): Promise<Recipe[]>;
}