'use server'

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';
import { EditorData } from '@/components/recipes/editor/types';

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
    
    // Intentem obtenir el nom del perfil
    const { data: profile } = await supabase
      .from('preference_profiles') // ✅ Canviat a la teva taula de perfils correcta
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

    // 4. PREPARAR DADES (Coherència amb el teu Schema JSONB)
    // ✅ NO fem JSON.stringify manualment, el client de Supabase ho gestiona per columnes jsonb
    // ✅ Mantenim els IDs dels passos per poder reordenar després
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
      
      // ✅ Passem els arrays directament (Supabase els convertirà a JSONB)
      ingredients: data.ingredients, 
      steps: stepsData, 
      
      dietary_tags: data.dietaryTags || [],
      estimated_cost: totalCost,
      is_public: true,
      updated_at: new Date().toISOString() // Ara sí que existeix la columna!
    };

    // 6. UPSERT
    const query = supabase.from('saved_recipes');

    // Si data.id existeix i no és 'new', podríem fer update afegint l'id al payload
    // Per ara fem insert bàsic que crea un ID nou si no li passem
    const { data: inserted, error } = await query
      .insert(recipePayload)
      .select('id')
      .single();

    if (error) {
        console.error("Supabase Error:", error);
        throw new Error(error.message);
    }

    // 7. RETORN
    revalidatePath('/recipes');
    return { success: true, recipeId: inserted.id };

  } catch (error: unknown) {
    console.error("Error saving recipe:", error);
    let errorMessage = "Error desconegut al servidor.";
    if (error instanceof Error) errorMessage = error.message;
    return { success: false, error: errorMessage };
  }
}