'use server'

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. DTO (Data Transfer Object)
// Ha de coincidir amb el que envia el 'RecipeEditor' (UI)
interface CreateRecipeInput {
  name: string;
  prepTimeMinutes: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  // ✅ CORRECCIÓ: Acceptem l'estructura rica de la UI
  steps: { id: string; content: string }[]; 
  dietaryTags: string[];
}

type CreateRecipeResult = 
  | { success: true; recipeId: string }
  | { success: false; error: string };

export async function createRecipeAction(input: CreateRecipeInput): Promise<CreateRecipeResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Has d'iniciar sessió." };

  try {
    // 2. MAPPING (Domain -> Infrastructure)
    // La UI necessita IDs, però la DB (probablement) guarda un array de textos simple.
    // Si la teva columna 'steps' a Supabase és 'text[]', fem això:
    const stepsForDb = input.steps.map(step => step.content);

    const newRecipe = {
      // id: crypto.randomUUID(), // Supabase sol generar-ho, però si ho vols manual està bé
      user_id: user.id,
      name: input.name,
      prep_time_minutes: Number(input.prepTimeMinutes),
      ingredients: input.ingredients,
      steps: stepsForDb, // ✅ Guardem només el contingut net
      tags: [],
      dietary_tags: input.dietaryTags,
      // created_at normalment ho gestiona la DB (default now()), però si ho passes explícitament:
      created_at: new Date().toISOString(),
      is_public: true,
      likes_count: 0
    };

    const { data: insertedData, error } = await supabase
        .from('saved_recipes')
        .insert(newRecipe)
        .select('id') // Important: retornar l'ID generat
        .single();

    if (error) throw new Error(error.message);

    revalidatePath('/community');
    
    // Assegurem que retornem l'ID correcte (o el que hem generat nosaltres)
    return { success: true, recipeId: insertedData?.id || 'new' };

  } catch (error: unknown) {
    console.error("Error creating recipe:", error);
    
    let errorMessage = "Error desconegut creant la recepta.";
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === "string") {
        errorMessage = error;
    }

    return { success: false, error: errorMessage };
  }
}