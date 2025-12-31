import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { Recipe } from '@/core/domain/entities/Recipe';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export class GetRandomInspiration {
  constructor(private recipeRepo: RecipeRepository) {}

  async execute(count: number, restrictions: DietaryRestriction[]): Promise<Recipe[]> {
    console.log(`🎲 [USECASE] Buscant ${count} receptes aleatòries compatibles amb: ${restrictions.join(', ') || 'Tothom'}`);
    
    // Deleguem la feina bruta al repositori, que és qui sap parlar amb SQL/Supabase
    const randomRecipes = await this.recipeRepo.findRandom(count, restrictions);
    
    if (randomRecipes.length === 0) {
        console.warn("⚠️ [USECASE] No s'han trobat receptes aleatòries amb aquests filtres.");
    }

    return randomRecipes;
  }
}