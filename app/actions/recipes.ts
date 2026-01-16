// ARXIU: app/actions/recipes.ts
'use server'

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';
import { EditorData } from '@/components/recipes/editor/types';
// ✅ FIX: Importem el repositori que faltava
import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';

type ActionResponse =
  | { success: true; recipeId: string }
  | { success: false; error: string };

interface IngredientWithCost {
  estimatedCost?: number | string;
}

export async function saveRecipeAction(data: EditorData): Promise<ActionResponse> {
  const supabase = await createClient();

  // 1. AUTENTICACIÓ
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Has d'iniciar sessió per guardar receptes." };
  }

  try {
    // 2. OBTENIR AUTOR REAL
    let authorName = "Xef Anònim";
    const { data: profile } = await supabase
      .from('preference_profiles')
      .select('username')
      .eq('user_id', user.id)
      .single();

    if (profile?.username) authorName = profile.username;
    else if (user.user_metadata?.full_name) authorName = user.user_metadata.full_name;

    // 3. CÀLCUL DE PREU ESTIMAT
    const totalCost = data.ingredients.reduce((acc, ing) => {
      const itemWithCost = ing as unknown as IngredientWithCost;
      const cost = parseFloat(String(itemWithCost.estimatedCost || 0));
      return acc + (isNaN(cost) ? 0 : cost);
    }, 0);

    // 4. PREPARAR DADES
    const stepsData = data.steps.map(s => ({
      id: s.id || crypto.randomUUID(),
      content: s.content || ""
    }));

    // 5. CONSTRUIR OBJECTE DB
    const recipePayload = {
      user_id: user.id,
      name: data.name,
      author_name: authorName,
      prep_time_minutes: Number(data.prepTimeMinutes) || 0,
      ingredients: data.ingredients,
      steps: stepsData,
      dietary_tags: data.dietaryTags || [],
      estimated_cost: totalCost,
      is_public: true,
      updated_at: new Date().toISOString()
    };

    const table = supabase.from('saved_recipes');
    
    // ✅ FIX: Tipatge explícit per resultData per evitar l'error "possibly null"
    let resultData: { id: string } | null = null;
    let resultError = null;

    // 6. LÒGICA INSERT vs UPDATE
    if (data.id) {
        // --- UPDATE ---
        // Verificació de propietat
        const { data: existing } = await table.select('user_id').eq('id', data.id).single();
        
        if (!existing || existing.user_id !== user.id) {
            return { success: false, error: "No tens permís per editar aquesta recepta." };
        }

        const { data: updated, error } = await table
            .update(recipePayload)
            .eq('id', data.id)
            .select('id')
            .single();
            
        resultData = updated;
        resultError = error;
    } else {
        // --- INSERT ---
        const { data: inserted, error } = await table
            .insert(recipePayload)
            .select('id')
            .single();
            
        resultData = inserted;
        resultError = error;
    }

    if (resultError) {
      console.error("Supabase Error:", resultError);
      throw new Error(resultError.message);
    }

    // ✅ FIX: Comprovació final de nul·litat
    if (!resultData) {
        throw new Error("No s'han retornat dades de la base de dades.");
    }

    // 7. RETORN
    revalidatePath('/recipes');
    if (data.id) revalidatePath(`/recipes/${data.id}`);
    
    return { success: true, recipeId: resultData.id };

  } catch (error: unknown) {
    console.error("Error saving recipe:", error);
    let errorMessage = "Error desconegut al servidor.";
    if (error instanceof Error) errorMessage = error.message;
    return { success: false, error: errorMessage };
  }
}

// Acció per Favorits (Necessita el Repositori)
export async function toggleFavoriteAction(recipeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  // Ara sí que tenim l'import a dalt
  const repo = new SupabaseRecipeRepository();

  try {
    const isFav = await repo.toggleFavorite(user.id, recipeId);

    revalidatePath('/recipes');
    revalidatePath(`/recipes/${recipeId}`);

    return { success: true, isFavorite: isFav };
  } catch (error) {
    console.log("Error updating favorite:", error)
    return { success: false, error: "Error updating favorite" };
  }
}