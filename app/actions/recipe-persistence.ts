'use server';

import { container } from '@/services/container';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { redirect } from 'next/navigation';

export async function saveAndViewRecipeAction(userId: string, recipe: RecipeProps) {
  try {
    const useCase = container.getSaveGeneratedRecipe();
    
    // Guardem la recepta a la BD
    const savedId = await useCase.execute(userId, recipe);

    // Retornem èxit i l'ID per fer la redirecció al client
    // (O fem redirect directament aquí si és una acció de form)
    return { success: true, recipeId: savedId };

  } catch (error) {
    console.error('Error saving recipe:', error);
    return { success: false, error: 'No s\'ha pogut guardar la recepta.' };
  }
}