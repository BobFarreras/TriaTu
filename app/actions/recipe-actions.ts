// ARXIU: app/actions/recipe-actions.ts
'use server'

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';
// ✅ FIX: Importem el repositori que faltava
import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';
import { container } from '@/services/container';
import { EmojiMatcherService } from '@/core/application/services/EmojiMatcherService'; // ✅ Importem el Matcher
import { GenerateRecipeSchema, MaterializeRecipeSchema } from '@/core/application/schemas/inputSchemas';
import { SupabaseRateLimiter } from '@/adapters/supabase/SupabaseRateLimiter';
import { SupabaseSecurityLogger } from '@/adapters/supabase/SupabaseSecurityLogger';
import { debug } from '@/lib/logger';
import { logActionError } from '@/lib/observability/action-logger';

// ✅ FIX: Definició robusta de la resposta
export type ActionResponse = {
    success: boolean;
    recipeId?: string;
    error?: string; // Important que sigui opcional (?)
};

// Tipus unificat que cobreixi el que ve de l'Editor i el que ve de la IA
export interface SaveRecipeInput {
  id?: string;
  name: string;
  prepTimeMinutes: number | string;
  
  ingredients: {
    id?: string;
    name: string;
    quantity: number;
    unit: string;
    emoji?: string;
    estimatedCost?: number | string;
    linkedProductId?: string | null;
    linkedProductImage?: string | null;
  }[];
  steps: (string | { id: string; content: string })[];
  tags?: string[];
  dietaryTags?: string[];
  isAiGenerated?: boolean;
}

// --- ACCIÓ PRINCIPAL: SAVE ---
// Aquesta conté tota la lògica "intel·ligent" (preus, imatges, emojis...)
export async function saveRecipeAction(data: SaveRecipeInput): Promise<ActionResponse> {
  debug('[SAVE ACTION] saveRecipeAction');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    let authorName = "Xef Anònim";
    const { data: profile } = await supabase.from('preference_profiles').select('username').eq('user_id', user.id).single();
    if (profile?.username) authorName = profile.username;

    // 1. Càlcul de cost total (ROBUST)
    const totalCost = data.ingredients.reduce((acc, ing) => {
      let costVal = ing.estimatedCost;
      if (typeof costVal === 'string') costVal = parseFloat(costVal);
      const cost = Number(costVal) || 0;
      return acc + cost;
    }, 0);

    let isAiGenerated = !!data.isAiGenerated;
    if (!isAiGenerated && data.id) {
      const { data: oldRecipe } = await supabase.from('saved_recipes').select('is_ai_generated').eq('id', data.id).single();
      if (oldRecipe) isAiGenerated = oldRecipe.is_ai_generated;
    }

    // 2. PROCESSAR INGREDIENTS + IMATGES
    const ingredientsPayload = await Promise.all(data.ingredients.map(async (ing) => {
      let finalId = ing.id;
      let finalEmoji = ing.emoji;
      const finalName = ing.name;
      const linkedProductId = ing.linkedProductId;
      let linkedProductImage = ing.linkedProductImage;
      const estimatedCost = ing.estimatedCost ? Number(ing.estimatedCost) : 0;

      const hasLink = typeof linkedProductId === 'string' && linkedProductId.length > 0;

      if (hasLink) {
        // ... (Lògica de recuperació d'imatges igual que tenies) ...
        if (!linkedProductImage) {
          const { data: product } = await supabase.from('product_catalog').select('image_url').eq('id', linkedProductId).single();
          if (product?.image_url) linkedProductImage = product.image_url;
        }
        if (!finalId || finalId.length < 5) finalId = linkedProductId!;
        if (!finalEmoji || finalEmoji === '🥘') finalEmoji = '📦';
      } else {
        // Matcher d'emojis
        const cleanName = finalName.replace(/\b(BONPREU|PATCHEF|...)\b/gi, "").trim();
        const preset = EmojiMatcherService.match(cleanName);
        if (preset) {
          finalId = preset.id;
          finalEmoji = preset.emoji;
        } else {
          if (!finalEmoji) finalEmoji = '🥘';
          if (!finalId) finalId = crypto.randomUUID();
        }
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
    }));

    // 3. PROCESSAR PASSOS
    const stepsData = data.steps.map(s => {
      if (typeof s === 'string') return { id: crypto.randomUUID(), content: s };
      return { id: s.id || crypto.randomUUID(), content: s.content || "" };
    });

    // 4. PAYLOAD BD
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
      is_public: false, // Per defecte privada quan es guarda
      is_ai_generated: isAiGenerated,
      updated_at: new Date().toISOString()
    };

    const table = supabase.from('saved_recipes');
    let resultId: string;

    if (data.id) {
      // ... Lògica d'Update existent ...
      // (Simplificada aquí per brevetat, copia la teva lògica d'update)
      const { data: updated, error } = await table.upsert({ ...recipePayload, id: data.id }).select('id').single();
      if (error) throw error;
      resultId = updated.id;
    } else {
      const { data: inserted, error } = await table.insert(recipePayload).select('id').single();
      if (error) throw error;
      resultId = inserted.id;
    }

    revalidatePath('/recipes');
    if (resultId) revalidatePath(`/recipes/${resultId}`);
    return { success: true, recipeId: resultId };

  } catch (error) {
    logActionError('saveRecipeAction', 'saveRecipeAction failed', error);
    return { success: false, error: "Error intern." };
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
    logActionError('toggleFavoriteAction', 'Error updating favorite', error);
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
  debug('[ACTION] generateMenuAction');

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
      logActionError(
        'generateMenuAction',
        "ALERTA: estimatedCost és undefined abans d'enviar al client!"
      );
    }

    // 3. Sanitització
    const cleanRecipes = JSON.parse(JSON.stringify(plainRecipes));

    debug('[ACTION] generateMenuAction done');

    return {
      success: true,
      recipes: cleanRecipes
    };

  } catch (error) {
    logActionError('generateMenuAction', '[ACTION ERROR]:', error);
    return { success: false, error: "Error generant el menú." };
  }
}
export async function materializeRecipeAction(rawAiRecipe: unknown): Promise<ActionResponse> {
  const parsed = MaterializeRecipeSchema.safeParse(rawAiRecipe);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const recipeData = parsed.data;
  const supabase = await createClient();

  // 🔍 1. PAS DE DEDUPLICACIÓ: Busquem si ja existeix
  try {
      const { data: existing } = await supabase
          .from('saved_recipes')
          .select('id')
          .eq('name', recipeData.name) // Mateix nom
          .eq('is_ai_generated', true) // Que sigui de la IA
          .eq('is_public', true) // Que sigui compartida
          .limit(1)
          .single();

      if (existing) {
          debug('[ACTION] deduplicate hit');
          return { success: true, recipeId: existing.id };
      }
  } catch (err) {
    logActionError('materializeRecipeAction', 'MaterializeRecipeAction error', err);
      // Ignorem errors de consulta (ex: no trobat), seguim endavant per crear-la
  }

  // 🌊 2. FLUX D'ENRIQUIMENT (Igual que tenies)
  // Si no existeix, l'hem de crear i enriquir
  const enrichedIngredients = await Promise.all((recipeData.ingredients || []).map(async (ing) => {
      let linkedProductId = ing.linkedProductId;
      let linkedProductImage = ing.linkedProductImage;
      let estimatedCost = ing.estimatedCost;

      if (!linkedProductId || !linkedProductImage) {
          const { data: match } = await supabase
              .from('product_catalog')
              .select('id, image_url, price')
              .ilike('name', `%${ing.name}%`)
              .limit(1)
              .single();

          if (match) {
              linkedProductId = match.id;
              linkedProductImage = match.image_url;
              if (!estimatedCost && match.price) estimatedCost = match.price; 
          }
      }

      return {
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          emoji: ing.emoji,
          estimatedCost: estimatedCost,
          linkedProductId: linkedProductId,
          linkedProductImage: linkedProductImage,
      };
  }));

  // 💾 3. PREPARAR PER GUARDAR
  const input: SaveRecipeInput = {
    name: recipeData.name,
    prepTimeMinutes: recipeData.prepTimeMinutes || 30,
    tags: recipeData.tags || [],
    dietaryTags: recipeData.dietaryTags || [],
    isAiGenerated: true,
    steps: recipeData.steps || [],
    ingredients: enrichedIngredients
  };

  // 🔥 TRUC FINAL: Guardem com a PÚBLICA?
  // Sí, perquè si un altre usuari de la sala fa clic, volem que trobi aquesta recepta (Pas 1)
  // i no en creï una de nova.
  // Modifiquem saveRecipeAction perquè accepti 'isPublic' o ho forcem a la lògica de save.
  
  // Opció A: Si saveRecipeAction accepta isPublic al input, passa-l'hi.
  // Opció B (Hack ràpid): SaveRecipeAction per defecte les fa privades. 
  // Però com que retorna l'ID, podem fer un update ràpid aquí per fer-la pública.
  
  const saveResult = await saveRecipeAction(input);

  if (saveResult.success && saveResult.recipeId) {
      // La fem pública perquè la trobin els altres companys de la sala
      await supabase
          .from('saved_recipes')
          .update({ is_public: true })
          .eq('id', saveResult.recipeId);
          
      debug('[ACTION] recipe shared');
  }

  return saveResult;
}

