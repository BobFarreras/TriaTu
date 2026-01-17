// ARXIU: app/actions/recipes.ts
'use server'

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';
import { EditorData } from '@/components/recipes/editor/types';
// ✅ FIX: Importem el repositori que faltava
import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';
import { container } from '@/services/container';
import { EmojiMatcherService } from '@/core/services/EmojiMarcherService'; // ✅ Importem el Matcher
import { GenerateRecipeSchema } from '@/core/application/schemas/inputSchemas';
import { SupabaseRateLimiter } from '@/adapters/supabase/SupabaseRateLimiter';
import { SupabaseSecurityLogger } from '@/adapters/supabase/SupabaseSecurityLogger';
type ActionResponse =
  | { success: true; recipeId: string }
  | { success: false; error: string };


// ✅ NOVA INTERFÍCIE: Definim què esperem de l'ingredient (així evitem 'any')
interface RecipeIngredientInput {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  emoji?: string;           // Ara TypeScript sap que això pot existir
  estimatedCost?: number | string; // També tipem el cost
}
export async function saveRecipeAction(data: EditorData): Promise<ActionResponse> {
  // 🔥🔥🔥 LOG CRÍTIC: Comprovem què arriba 🔥🔥🔥
  console.log("\n🟥 [SAVE ACTION] REBUT:", data.name);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    let authorName = "Xef Anònim";
    const { data: profile } = await supabase.from('preference_profiles').select('username').eq('user_id', user.id).single();
    if (profile?.username) authorName = profile.username;

    const totalCost = data.ingredients.reduce((acc, ing) => {
      const typedIng = ing as RecipeIngredientInput;
      const cost = parseFloat(String(typedIng.estimatedCost || 0));
      return acc + (isNaN(cost) ? 0 : cost);
    }, 0);

    let isAiGenerated = false;
    if (data.isAiGenerated) {
      isAiGenerated = true;
    } else if (data.id) {
      const { data: oldRecipe } = await supabase.from('saved_recipes').select('is_ai_generated').eq('id', data.id).single();
      if (oldRecipe) isAiGenerated = oldRecipe.is_ai_generated;
    }

    console.log("🔄 [SERVER] Processant ingredients amb neteja de marques...");

    const ingredientsPayload = data.ingredients.map((ing) => {
      const typedIng = ing as RecipeIngredientInput;

      // 1. NETEJA EXTREMA
      const cleanName = typedIng.name
        .replace(/\b(BONPREU|PATCHEF|TERRALL|COOSUR|DE L'ERA|FERRARINI|GERMANOR|PESCANOVA|HACENDADO|YOSOY|GALLINA BLANCA|NESTLE|DANONE|CASA TARRADELLAS)\b/gi, "") // Més marques
        .replace(/\b(de|d')\b/gi, "") // Treure preposicions soltes si molesten
        .replace(/[0-9.]+(g|ml|kg|l)\b/gi, "") // Treure quantitats colades al nom (ex: "300g")
        .replace(/\s+/g, ' ')
        .trim();

      // 2. MATCH: Intentem trobar el preset amb el nom net
      const preset = EmojiMatcherService.match(cleanName);

      let finalId = typedIng.id;
      let finalEmoji = typedIng.emoji;

      // LOG DE CADA INGREDIENT
      process.stdout.write(`   🔹 "${typedIng.name}" -> Clean: "${cleanName}" `);

      if (preset) {
        finalId = preset.id;
        finalEmoji = preset.emoji;
        console.log(`✅ MATCH -> ${finalEmoji} (${finalId})`);
      } else {
        // Fallback: Si no hi ha preset, intentem mantenir l'emoji del front
        if (!finalEmoji || finalEmoji === '🥘') {
          finalEmoji = '🥘';
          console.log(`❌ NO MATCH`);
        } else {
          console.log(`⚠️ NO MATCH -> Mantenim: ${finalEmoji}`);
        }
        if (!finalId) finalId = crypto.randomUUID();
      }

      return {
        id: finalId,
        name: typedIng.name, // Guardem el nom original
        quantity: typedIng.quantity,
        unit: typedIng.unit,
        emoji: finalEmoji
      };
    });

    const stepsData = data.steps.map(s => ({ id: s.id || crypto.randomUUID(), content: s.content || "" }));

    const recipePayload = {
      user_id: user.id,
      name: data.name,
      author_name: authorName,
      prep_time_minutes: Number(data.prepTimeMinutes) || 0,
      ingredients: ingredientsPayload,
      steps: stepsData,
      dietary_tags: data.dietaryTags || [],
      estimated_cost: totalCost,
      is_public: true,
      is_ai_generated: isAiGenerated,
      updated_at: new Date().toISOString()
    };

    const table = supabase.from('saved_recipes');
    let resultData: { id: string } | null = null;
    let resultError = null;

    if (data.id) {
      const { data: existing } = await table.select('user_id').eq('id', data.id).single();
      if (existing) {
        if (existing.user_id !== user.id) return { success: false, error: "No tens permís." };
        const { data: updated, error } = await table.update(recipePayload).eq('id', data.id).select('id').single();
        resultData = updated; resultError = error;
      } else {
        const { data: inserted, error } = await table.insert({ ...recipePayload, id: data.id }).select('id').single();
        resultData = inserted; resultError = error;
      }
    } else {
      const { data: inserted, error } = await table.insert(recipePayload).select('id').single();
      resultData = inserted; resultError = error;
    }

    if (resultError) throw new Error(resultError.message);

    console.log("✅ [SUCCESS] Guardat a DB OK.");
    revalidatePath('/recipes');
    if (data.id) revalidatePath(`/recipes/${data.id}`);

    return { success: true, recipeId: resultData!.id };

  } catch (error: unknown) {
    console.error("Error saving recipe:", error);
    return { success: false, error: "Error al guardar." };
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
// ✅ Aquesta acció substitueix la lògica complexa que tenies abans.
// Ara fa servir l'estratègia Híbrida (BD + IA) que hem definit al Service.
export async function generateMenuAction(
  userId: string,
  dishName: string,
  mode: 'FATE' | 'CHEF',
  energy: number = 50,
  time: number = 30,
  lang: string = 'ca'
) {
  console.log(`🚀 [ACTION] Generant Menú. User: ${userId}, Mode: ${mode}`);

  // 1. VALIDACIÓ (Zod)
  const validation = GenerateRecipeSchema.safeParse({ userId, dishName, lang });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  // 2. SEGURETAT (Rate Limit)
  const limiter = new SupabaseRateLimiter();
  const logger = new SupabaseSecurityLogger();

  const canProceed = await limiter.check(`gen:${userId}`, 20, 3600); // 5 cops/hora
  if (!canProceed) {
    await logger.log('WARN', 'RATE_LIMIT', userId, { action: 'generate_menu' });
    return { success: false, error: "Límit superat. Espera una estona." };
  }

  try {
    const supabase = await createClient();

    // ✅ 3. EXECUTAR EL SERVEI HÍBRID
    // Aquí està la màgia: Tot el codi de buscar a BD, filtrar i cridar IA està dins del servei.
    const service = container.getGenerateMenuService(supabase);

    const recipes = await service.execute(
      userId,
      mode,
      dishName,
      energy,
      time,
      lang
    );

    // 4. RETORNAR (Serialitzat)
    return {
      success: true,
      recipes: recipes.map(r => r.toPrimitives())
    };

  } catch (error) {
    console.error('❌ [ACTION ERROR]:', error);
    return { success: false, error: "Error generant el menú." };
  }
}