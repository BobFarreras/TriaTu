// ARXIU: app/actions/recipe-actions.ts
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

type ActionResponse = { success: true; recipeId: string } | { success: false; error: string };


export async function saveRecipeAction(data: EditorData): Promise<ActionResponse> {
  console.log(`\n💾 [SAVE ACTION] Guardant: "${data.name}"...`);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    let authorName = "Xef Anònim";
    const { data: profile } = await supabase.from('preference_profiles').select('username').eq('user_id', user.id).single();
    if (profile?.username) authorName = profile.username;

    // 1. Càlcul de cost total (ROBUST)
    const totalCost = data.ingredients.reduce((acc, ing) => {
      // Assegurem que llegim el valor correcte, sigui string o number
      // (A vegades ve com "2.50" string des del JSON)
      let costVal = ing.estimatedCost;

      if (typeof costVal === 'string') {
        costVal = parseFloat(costVal);
      }

      // Si encara és null/undefined o NaN, comptem 0
      const cost = Number(costVal) || 0;

      return acc + cost;
    }, 0);

    console.log(`💰 [SAVE ACTION] Cost Total Calculat: ${totalCost.toFixed(2)}€`);

    let isAiGenerated = !!data.isAiGenerated;
    // Si és un update, intentem mantenir el flag original si no ens l'envien
    if (!isAiGenerated && data.id) {
      const { data: oldRecipe } = await supabase.from('saved_recipes').select('is_ai_generated').eq('id', data.id).single();
      if (oldRecipe) isAiGenerated = oldRecipe.is_ai_generated;
    }

    // 2. PROCESSAR INGREDIENTS (Amb lògica de vincle corregida)
    const ingredientsPayload = data.ingredients.map((ing) => {

      let finalId = ing.id;
      let finalEmoji = ing.emoji;
      const finalName = ing.name;

      const linkedProductId = ing.linkedProductId;
      const linkedProductImage = ing.linkedProductImage;
      const estimatedCost = ing.estimatedCost ? Number(ing.estimatedCost) : 0;

      // 🔥🔥🔥 CORRECCIÓ CRÍTICA 🔥🔥🔥
      // Comprovem si linkedProductId és un string vàlid i no està buit
      const hasLink = typeof linkedProductId === 'string' && linkedProductId.length > 0;

      if (hasLink) {
        // A) TÉ VINCLE -> PRESERVEM DADES D'INVENTARI
        console.log(`   💎 [KEEP] Vinculat: "${finalName}" -> ID: ${linkedProductId} (${estimatedCost.toFixed(2)}€)`);

        // Si l'ingredient no tenia ID propi, li assignem el del producte
        if (!finalId || finalId.length < 5) finalId = linkedProductId!;

        // Si no té emoji o és el genèric de cuina, li posem una caixa
        if (!finalEmoji || finalEmoji === '🥘') finalEmoji = '📦';
      }
      else {
        // B) NO TÉ VINCLE -> FEM SERVIR MATCHER (EmojiMatcherService)
        // Netejem noms de marques conegudes per millorar el match
        const cleanName = finalName
          .replace(/\b(BONPREU|PATCHEF|TERRALL|COOSUR|DE L'ERA|FERRARINI|GERMANOR|PESCANOVA)\b/gi, "")
          .trim();

        const preset = EmojiMatcherService.match(cleanName);

        if (preset) {
          finalId = preset.id;
          finalEmoji = preset.emoji;
        } else {
          if (!finalEmoji) finalEmoji = '🥘';
          if (!finalId) finalId = crypto.randomUUID();
        }
        console.log(`   🧩 [MATCHER] Genèric: "${finalName}" -> ${finalEmoji}`);
      }

      return {
        id: finalId,
        name: finalName,
        quantity: ing.quantity,
        unit: ing.unit,
        emoji: finalEmoji,
        linkedProductId: hasLink ? linkedProductId : null,
        linkedProductImage: hasLink ? linkedProductImage : null,
        estimatedCost
      };
    });

    // 3. PROCESSAR PASSOS (Normalitzar IDs)
    const stepsData = data.steps.map(s => {
      if (typeof s === 'string') return { id: crypto.randomUUID(), content: s };
      return { id: s.id || crypto.randomUUID(), content: s.content || "" };
    });

    // 4. CONSTRUIR PAYLOAD DE BASE DE DADES
    const recipePayload = {
      user_id: user.id,
      name: data.name,
      author_name: authorName,
      prep_time_minutes: Number(data.prepTimeMinutes) || 0,
      ingredients: ingredientsPayload,
      steps: stepsData,
      tags: data.tags || [],
      dietary_tags: data.dietaryTags || [],
      estimated_cost: totalCost,
      is_public: true,
      is_ai_generated: isAiGenerated,
      updated_at: new Date().toISOString()
    };

    const table = supabase.from('saved_recipes');
    let resultData: { id: string } | null = null;

    if (data.id) {
      // UPDATE o UPSERT
      const { data: existing } = await table.select('user_id').eq('id', data.id).single();
      if (existing) {
        if (existing.user_id !== user.id) return { success: false, error: "No tens permís." };
        const { data: updated, error } = await table.update(recipePayload).eq('id', data.id).select('id').single();
        if (error) throw error;
        resultData = updated;
      } else {
        // Si l'ID venia però no existeix a BD, fem insert amb aquell ID
        const { data: inserted, error } = await table.insert({ ...recipePayload, id: data.id }).select('id').single();
        if (error) throw error;
        resultData = inserted;
      }
    } else {
      // INSERT NOU (ID automàtic)
      const { data: inserted, error } = await table.insert(recipePayload).select('id').single();
      if (error) throw error;
      resultData = inserted;
    }

    console.log(`✅ [SUCCESS] Guardat amb cost: ${totalCost.toFixed(2)}€`);

    // Revalidar caché de Next.js
    revalidatePath('/recipes');
    if (data.id) revalidatePath(`/recipes/${data.id}`);

    return { success: true, recipeId: resultData!.id };

  } catch (error: unknown) {
    console.error("❌ Error saving recipe:", error);
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
    const service = container.getGenerateMenuService(supabase);

    // EXECUTEM EL SERVEI (L'Orchestrator decideix internament)
    const recipes = await service.execute(
      userId,
      mode,
      dishName,
      energy,
      time,
      lang
    );

    // CONVERSIÓ A PRIMITIVES
    // 1. Convertim a primitives (això ja ho fas)
    const plainRecipes = recipes.map(r => r.toPrimitives());

    // 2. ⚠️ ASSEGURA'T QUE estimatedCost EXISTEIX AQUÍ ⚠️
    // Si plainRecipes[0].estimatedCost és undefined, JSON.stringify l'esborrarà!
    if (plainRecipes.length > 0 && plainRecipes[0].estimatedCost === undefined) {
      console.error("⚠️ ALERTA: estimatedCost és undefined abans d'enviar al client!");
    }

    // 3. Sanitització
    const cleanRecipes = JSON.parse(JSON.stringify(plainRecipes));


    // 👇 DETECCIÓ DE L'ESTRATÈGIA UTILITZADA 👇
    // Si la primera recepta té isAiGenerated a true, és que hem usat el Generador.
    // Si no, és que hem recuperat de la BD (Basic/Legacy).
    const isAi = plainRecipes.length > 0 && plainRecipes[0].isAiGenerated;
    const strategyUsed = isAi ? "✨ GEN (IA Generativa)" : "📚 BASIC (Recuperat de BD)";

    console.log(`✅ [ACTION] Finalitzat. ${plainRecipes.length} receptes.`);
    console.log(`   🛠️ ESTRATÈGIA FINAL: [ ${strategyUsed} ]`);

    if (plainRecipes.length > 0) {
      // Validem visualment que el preu arriba
      const cost = plainRecipes[0].estimatedCost;
      console.log(`   💰 Cost 1a recepta: ${cost ? cost.toFixed(2) + '€' : 'MISSING ⚠️'}`);
    }

  

    return {
      success: true,
      recipes: cleanRecipes
    };

  } catch (error) {
    console.error('❌ [ACTION ERROR]:', error);
    return { success: false, error: "Error generant el menú." };
  }
}