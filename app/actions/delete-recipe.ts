// src/app/actions/delete-recipe.ts
'use server'

import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function deleteRecipeAction(recipeId: string) {
  const supabase = await createClient();
  
  // 1. Autenticació
  const { data: { user } } = await supabase.auth.getUser();
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
    console.error('Error deleting recipe:', error);
    return { error: 'No s\'ha pogut eliminar la recepta.' };
  }

  // 4. Redirect (fora del try-catch perquè llença una excepció interna de Next.js)
  redirect('/recipes');
}