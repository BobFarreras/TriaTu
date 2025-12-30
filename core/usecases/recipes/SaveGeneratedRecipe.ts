import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { Recipe, RecipeProps } from '@/core/domain/entities/Recipe';

export class SaveGeneratedRecipe {
  constructor(private recipeRepo: RecipeRepository) {}

  async execute(userId: string, props: RecipeProps): Promise<string> {
    // 1. Reconstruïm l'entitat de domini
    // Nota: Podríem generar un nou UUID aquí si volguéssim, 
    // però confiem en el que ve de la IA o el sobreescrivim.
    const recipe = new Recipe(props);

    // 2. Guardem a persistència
    await this.recipeRepo.save(recipe, userId);

    return recipe.props.id; // Retornem l'ID per fer el redirect
  }
}