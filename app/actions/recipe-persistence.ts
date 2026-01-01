"use server";

import { createClient } from "@/adapters/supabase/server";
import { SupabaseRecipeRepository } from "@/adapters/supabase/SupabaseRecipeRepository";
import { SaveGeneratedRecipe } from "@/core/usecases/recipes/SaveGeneratedRecipe";
import { Recipe, RecipeProps } from "@/core/domain/entities/Recipe";

type SaveRecipeResult = 
  | { success: true; recipeId: string }
  | { success: false; error: string };

export async function saveAndViewRecipeAction(incomingRecipe: unknown): Promise<SaveRecipeResult> {
  
  // ✅ 1. PROTECCIÓ CONTRA 'UNDEFINED'
  if (!incomingRecipe) {
    console.error("❌ [SERVER ERROR] saveAndViewRecipeAction ha rebut 'undefined' o 'null'");
    return { success: false, error: "No s'han rebut dades de la recepta." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Has d'iniciar sessió per guardar." };
  }

  try {
    // ✅ 2. SANITITZACIÓ SEGURA
    // Ara estem segurs que incomingRecipe no és null/undefined, així que el JSON.parse no petarà
    const plainRecipe = JSON.parse(JSON.stringify(incomingRecipe)) as RecipeProps & { createdAt?: string | Date };

    console.log(`💾 [SERVER] Guardant recepta: ${plainRecipe.name}`);

    // 3. RECONSTRUCCIÓ
    const recipeEntity = new Recipe({
      ...plainRecipe,
      createdAt: plainRecipe.createdAt ? new Date(plainRecipe.createdAt) : new Date(),
      ingredients: plainRecipe.ingredients || [],
      steps: plainRecipe.steps || [],
      tags: plainRecipe.tags || [],
      dietaryTags: plainRecipe.dietaryTags || [],
      likesCount: plainRecipe.likesCount ?? 0,
      ratingSummary: plainRecipe.ratingSummary || { average: 0, count: 0, distribution: {} }
    });

    // 4. GUARDAR
    const repo = new SupabaseRecipeRepository();
    const useCase = new SaveGeneratedRecipe(repo);
    await useCase.execute(recipeEntity, user.id);

    return { success: true, recipeId: recipeEntity.id };

  } catch (error) {
    console.error("Error saving recipe:", error);
    let errorMessage = "Error desconegut guardant la recepta";
    if (error instanceof Error) errorMessage = error.message;
    return { success: false, error: errorMessage };
  }
}