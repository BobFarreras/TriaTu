"use server";

import { createClient } from "@/adapters/supabase/server";
import { SupabaseRecipeRepository } from "@/adapters/supabase/SupabaseRecipeRepository";
import { SaveGeneratedRecipe } from "@/core/usecases/recipes/SaveGeneratedRecipe";
import { Recipe, RecipeProps } from "@/core/domain/entities/Recipe";

// Definim el tipus de retorn per a que el client sàpiga què esperar
type SaveRecipeResult = 
  | { success: true; recipeId: string }
  | { success: false; error: string };

export async function saveAndViewRecipeAction(plainRecipe: RecipeProps): Promise<SaveRecipeResult> {
  // 1. AUTENTICACIÓ
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Has d'iniciar sessió per guardar." };
  }

  try {
    // 2. RECONSTRUCCIÓ DE L'ENTITAT
    // Reconstruïm dates i assegurem integritat
    const recipeEntity = new Recipe({
      ...plainRecipe,
      createdAt: plainRecipe.createdAt ? new Date(plainRecipe.createdAt) : new Date(),
      // Assegurem que arrays siguin arrays i no nulls
      ingredients: plainRecipe.ingredients || [],
      steps: plainRecipe.steps || [],
      tags: plainRecipe.tags || [],
      dietaryTags: plainRecipe.dietaryTags || [],
      // Assegurem que likesCount i ratingSummary tinguin valors per defecte si falten
      likesCount: plainRecipe.likesCount ?? 0,
      ratingSummary: plainRecipe.ratingSummary || { average: 0, count: 0, distribution: {} }
    });

    // 3. EXECUCIÓ DEL CAS D'ÚS
    const repo = new SupabaseRecipeRepository();
    const useCase = new SaveGeneratedRecipe(repo);

    // El UseCase s'encarrega de canviar "ai-generated" per l'ID de l'usuari
    await useCase.execute(recipeEntity, user.id);

    // 4. RETORN D'ÈXIT
    return { success: true, recipeId: recipeEntity.id };

  } catch (error) {
    console.error("Error saving recipe:", error);

    // ✅ FIX: Gestió d'errors amb tipatge segur (sense 'any')
    let errorMessage = "Error desconegut guardant la recepta";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === "string") {
        errorMessage = error;
    }

    return { success: false, error: errorMessage };
  }
}