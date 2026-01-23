// src/app/actions/delete-recipe.ts
'use server'

import { container } from '@/services/container';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { logActionError } from '@/lib/observability/action-logger';
import { getCurrentUser } from '@/lib/auth/session';

export async function deleteRecipeAction(recipeId: string) {
  // 1. Autenticació
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Has d'iniciar sessió per eliminar receptes." };
  }

  try {
    // 2. Execució del Domini
    const deleteRecipe = container.getDeleteRecipe();
    await deleteRecipe.execute(recipeId, user.id);

    // 3. Revalidació
    revalidatePath('/recipes');
    revalidatePath(`/recipes/${recipeId}`);
    
  } catch (error) {
    logActionError('deleteRecipeAction', 'Error deleting recipe:', error);
    return { error: 'No s\'ha pogut eliminar la recepta.' };
  }

  // 4. Redirect (fora del try-catch perquè llença una excepció interna de Next.js)
  redirect('/recipes');
}
