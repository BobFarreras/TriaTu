'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';
import { PublishRecipe } from '@/core/usecases/community/PublishRecipe';
import { RateRecipe } from '@/core/usecases/community/RateRecipe';

// Instanciem les dependències (Dependency Injection manual)
function getRepo() {
  return new SupabaseRecipeRepository();
}

// Helper per gestionar errors de forma segura sense 'any'
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "S'ha produït un error desconegut";
}

export async function publishRecipeAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Has d'iniciar sessió per publicar." };
  }

  const name = formData.get('title') as string;
  const ingredientsRaw = formData.get('ingredients') as string;
  const stepsRaw = formData.get('steps') as string;

  if (!name || !ingredientsRaw || !stepsRaw) {
    return { error: "Falten camps obligatoris." };
  }

  const ingredients = ingredientsRaw.split(',').map(i => ({ 
    name: i.trim(), 
    quantity: 1, 
    unit: 'ut' 
  }));
  
  const steps = stepsRaw.split('\n').filter(s => s.trim().length > 0);

  try {
    const useCase = new PublishRecipe(getRepo());
    
    await useCase.execute(user.id, {
      name,
      ingredients,
      steps,
      tags: ['Comunitat'],
    });

    revalidatePath('/community');
    return { success: true };
  } catch (e: unknown) { // ✅ CORRECCIÓ: usem unknown
    return { error: getErrorMessage(e) };
  }
}

export async function rateRecipeAction(recipeId: string, value: number, comment?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  try {
    const useCase = new RateRecipe(getRepo());
    await useCase.execute({
      userId: user.id,
      recipeId,
      value,
      comment
    });
    
    revalidatePath('/community');
    return { success: true };
  } catch (e: unknown) { // ✅ CORRECCIÓ: usem unknown
    return { error: getErrorMessage(e) };
  }
}