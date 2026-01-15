'use server'; // ✅ Obligatori per a Server Actions
import { createClient } from '@/adapters/supabase/server'; // ✅ Importem createClient
import { container } from '@/services/container';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';
import { RecipeProps } from '@/core/domain/entities/Recipe';

export async function generateRecipesAction(userId: string, restrictions: DietaryRestriction[] = []) {
  try {
    const supabase = await createClient(); // ✅ Creem el client

    // ✅ PASSEM EL CLIENT AL CONTAINER
    const inventoryUseCase = container.getGetUserInventory(supabase);
    // El generator potser no necessita client si usa OpenAI directament, però ho deixem així si el container ho demana
    // Si container.getRecipeGenerator() no demana arguments, està bé.
    const generator = container.getRecipeGenerator(); 

    const inventory = await inventoryUseCase.execute(userId);
    const inventoryProps = inventory.map(item => item.props);

    const recipes = await generator.generate(inventoryProps, restrictions);

    return { success: true, recipes: recipes.map(r => r.props) };
  } catch (error) {
    console.error('Error generating recipes:', error);
    return { success: false, error: "No s'han pogut generar receptes." };
  }
}

// --- 2. CUINAR RECEPTA ---
export async function cookRecipeAction(userId: string, recipeProps: RecipeProps) {
  try {
    const supabase = await createClient(); // ✅ Creem el client

    // ✅ PASSEM EL CLIENT AL CONTAINER
    const cookUseCase = container.getCookRecipe(supabase);
    
    // Reconstruïm l'entitat
    const { Recipe } = await import('@/core/domain/entities/Recipe');
    const recipe = new Recipe(recipeProps);

    await cookUseCase.execute(userId, recipe);
    
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconegut al cuinar";
    console.error('Error cooking recipe:', message);
    return { success: false, error: message };
  }
}