'use server'; // ✅ Obligatori per a Server Actions

import { container } from '@/services/container';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';
import { RecipeProps } from '@/core/domain/entities/Recipe';

export async function generateRecipesAction(userId: string, restrictions: DietaryRestriction[] = []) {
  try {
    const inventoryUseCase = container.getGetUserInventory();
    const generator = container.getRecipeGenerator();

    const inventory = await inventoryUseCase.execute(userId);
    const inventoryProps = inventory.map(item => item.props);

    const recipes = await generator.generate(inventoryProps, restrictions);

    // Retornem dades planes (props) per ser compatibles amb Client Components
    return { success: true, recipes: recipes.map(r => r.props) };
  } catch (error) {
    console.error('Error generating recipes:', error);
    return { success: false, error: "No s'han pogut generar receptes." };
  }
}

export async function cookRecipeAction(userId: string, recipeProps: RecipeProps) {
  try {
    const cookUseCase = container.getCookRecipe();
    
    // Import dinàmic de l'entitat per reconstruir-la al servidor
    const { Recipe } = await import('@/core/domain/entities/Recipe');
    const recipe = new Recipe(recipeProps);

    await cookUseCase.execute(userId, recipe);
    
    return { success: true };
  } catch (error: unknown) {
    // ✅ Evitem 'any' en el catch
    const message = error instanceof Error ? error.message : "Error desconegut al cuinar";
    console.error('Error cooking recipe:', message);
    return { success: false, error: message };
  }
}