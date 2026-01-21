// src/app/actions/community.ts (o on tinguis les actions)
'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';
import { PublishRecipe } from '@/core/usecases/community/PublishRecipe';
import { RateRecipe } from '@/core/usecases/community/RateRecipe';
import { logActionError } from '@/lib/observability/action-logger';


export async function publishRecipeAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Has d'iniciar sessió." };

  const name = formData.get('title') as string;
  const ingredientsJson = formData.get('ingredients') as string;
  const stepsJson = formData.get('steps') as string;
  const prepTime = formData.get('prepTime') ? parseInt(formData.get('prepTime') as string) : 15;
  const difficulty = formData.get('difficulty') as string; // Això anirà a 'tags'

  if (!name || !ingredientsJson || !stepsJson) {
    return { error: "Falten dades obligatòries." };
  }

  try {
    const ingredients = JSON.parse(ingredientsJson);
    const steps = JSON.parse(stepsJson);

    // Tags generals
    const tags: string[] = ['Comunitat'];
    if (difficulty) tags.push(difficulty);

    // Tags dietètics (si en tinguessis al formulari, els extrauries aquí)
    const dietaryTags: string[] = []; 

    const repo = new SupabaseRecipeRepository();
    const useCase = new PublishRecipe(repo);
    
    await useCase.execute(user.id, {
      name,
      ingredients,
      steps,
      tags,
      dietaryTags, // PASSEM ELS NOUS CAMPS
      prepTimeMinutes: prepTime, 
      isPublic: true // Definim explícitament que és pública
    });

    revalidatePath('/community');
    return { success: true };
  } catch (e: unknown) {
    logActionError('publishRecipeAction', 'publishRecipeAction failed', e);
    return { error: e instanceof Error ? e.message : "Error desconegut" };
  }
}
/**
 * Acció per puntuar una recepta.
 * Actua com a Controller: Auth -> UseCase -> Response
 */
export async function rateRecipeAction(recipeId: string, value: number) {
  // 1. Validació d'infraestructura (Auth)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Has d'iniciar sessió per votar." };
  }

  // 2. Validació bàsica d'inputs (Boundary check)
  if (!recipeId || value < 1 || value > 5) {
    return { error: "Dades de votació incorrectes." };
  }

  try {
    // 3. Instanciació de dependencies (Dependency Injection manual)
    const repo = new SupabaseRecipeRepository();
    const useCase = new RateRecipe(repo);

    // 4. Execució del Cas d'Ús
    await useCase.execute({
      userId: user.id,
      recipeId: recipeId,
      value: value,
      comment: "" // De moment la UI no envia comentari, ho deixem buit o opcional
    });

    // 5. Revalidació
    // Important: Actualitzem la ruta perquè es recalculi la mitjana visualment
    revalidatePath('/community'); 
    // O si tens una pàgina de detall: revalidatePath(`/community/${recipeId}`);

    return { success: true };

  } catch (e: unknown) {
    logActionError('rateRecipeAction', 'rateRecipeAction failed', e);
    // 6. Gestió d'errors de domini
    // Si el UseCase llança "La recepta no existeix" o "Puntuació invàlida", ho capturem aquí.
    const errorMessage = e instanceof Error ? e.message : "Error al guardar el vot";
    return { error: errorMessage };
  }
}
