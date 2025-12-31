'use server'

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. DEFINIM EL TIPUS D'ENTRADA (DTO)
// Això assegura que sabem exactament què ens envia el component React
interface CreateRecipeInput {
  name: string;
  prepTimeMinutes: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  steps: string[];
  dietaryTags: string[];
}

// 2. DEFINIM EL TIPUS DE RETORN
// Això ajuda al component client a saber què esperar (success o error)
type CreateRecipeResult = 
  | { success: true; recipeId: string }
  | { success: false; error: string };

export async function createRecipeAction(input: CreateRecipeInput): Promise<CreateRecipeResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Has d'iniciar sessió." };

  try {
    // Construïm l'objecte per a la BD
    // TypeScript ara ens validarà que 'input' té les propietats correctes
    const newRecipe = {
      id: crypto.randomUUID(),
      user_id: user.id,
      name: input.name,
      // Assegurem que sigui número (per si ve com a string des de l'input HTML)
      prep_time_minutes: Number(input.prepTimeMinutes),
      ingredients: input.ingredients,
      steps: input.steps,
      tags: [], // Tags generals buits inicialment
      dietary_tags: input.dietaryTags,
      created_at: new Date().toISOString(),
      is_public: true,
      likes_count: 0
    };

    const { error } = await supabase.from('saved_recipes').insert(newRecipe);

    if (error) throw new Error(error.message);

    revalidatePath('/community');
    return { success: true, recipeId: newRecipe.id };

  } catch (error: unknown) { // ✅ Usem 'unknown' en lloc de 'any'
    console.error("Error creating recipe:", error);
    
    // ✅ TYPE NARROWING: Comprovem si és un error estàndard
    let errorMessage = "Error desconegut creant la recepta.";
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === "string") {
        errorMessage = error;
    }

    return { success: false, error: errorMessage };
  }
}