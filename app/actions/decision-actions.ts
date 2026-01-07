// app/actions/decision-actions.ts
'use server'
import { revalidatePath } from 'next/cache';
import { container } from '@/services/container';
import { DecisionType } from '@/core/domain/entities/Decision';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { IndividualDecisionSchema } from '@/core/application/schemas/inputSchemas'; // ✅ Import
// ✅ NOUS IMPORTS NECESSARIS PER LA FUNCIÓ MÀGICA
import { createClient } from '@/adapters/supabase/server';
import { findBestRecipe, ParticipantProfile, RecipeCandidate } from '@/core/domain/services/recommendation-service';
import { checkRoomDailyLimit } from '@/lib/security/decision-limit'; // ✅ IMPORT NOU
// ✅ IMPORTS CENTRALITZATS
import { DbProfileRow, DbSavedRecipe, DbCommunityRecipe } from '@/adapters/supabase/types/database.dtos';
// DTOs
type MakeDecisionInput = {
  userId: string;
  type: DecisionType;
  energyLevel: number;
  timeMinutes: number;
};

export async function makeIndividualDecisionAction(input: MakeDecisionInput) {
  // 1. 🛡️ VALIDACIÓ ZOD
  const validation = IndividualDecisionSchema.safeParse({
    userId: input.userId,
    type: input.type,
    energyLevel: input.energyLevel,
    timeMinutes: input.timeMinutes
  });

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const data = validation.data;

  try {
    const useCase = container.getMakeIndividualDecision();

    const context = new DecisionContext({
      energyLevel: data.energyLevel,
      availableTimeMinutes: data.timeMinutes
    });

    const decision = await useCase.execute({
      userId: data.userId,
      type: data.type as DecisionType, // Casting segur després de validació
      context
    });

    return {
      success: true,
      data: {
        id: decision.id,
        choice: decision.outcome?.choice,
        reason: decision.outcome?.reason
      }
    };
  } catch (error: unknown) {
    console.error('Action Error:', error);

    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return { success: false, error: errorMessage };
  }
}

export async function generateMagicDecisionAction(roomId: string) {
  console.log('\n⚡ MAGIC DECISION START --- Room:', roomId);
  const supabase = await createClient();

  // 1. 🛡️ VERIFICAR LÍMITS (Centralitzat)
  const limitCheck = await checkRoomDailyLimit(supabase, roomId);
  if (!limitCheck.allowed) {
    return { success: false, error: limitCheck.error };
  }

  try {
    // ---------------------------------------------------------
    // 1. 🛡️ SEGURETAT: RATE LIMITING
    // ---------------------------------------------------------
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabase
      .from('group_decisions')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId)
      .gte('created_at', oneDayAgo);

    if (countError) {
      console.error("Rate Limit Error:", countError);
    } else {
      const DAILY_LIMIT = 10;
      if (count !== null && count >= DAILY_LIMIT) {
        console.warn(`🛑 Room ${roomId} hit the daily limit (${count}/${DAILY_LIMIT})`);
        return {
          success: false,
          error: `Límit diari assolit! Heu fet ${count} decisions avui. Torneu-hi demà o trieu manualment.`
        };
      }
    }

    // ---------------------------------------------------------
    // 2. FETCH PARTICIPANTS & PROFILES
    // ---------------------------------------------------------
    const { data: participants, error: pError } = await supabase
      .from('room_participants')
      .select('user_id')
      .eq('room_id', roomId);

    if (pError) throw new Error("Error fetching participants: " + pError.message);
    if (!participants || participants.length === 0) throw new Error("Room is empty");

    const userIds = participants.map(p => p.user_id);
    console.log(`👥 Found ${userIds.length} participants. Fetching profiles...`);

    const { data: rawProfiles, error: profError } = await supabase
      .from('preference_profiles')
      .select('user_id, exclusions, food_preferences')
      .in('user_id', userIds)
      .returns<DbProfileRow[]>();

    if (profError) throw new Error("Error fetching profiles: " + profError.message);

    const groupProfile: ParticipantProfile[] = (rawProfiles || []).map((p) => ({
      id: p.user_id,
      allergies: p.exclusions || [],
      dislikes: [],
      preferences: p.food_preferences || []
    }));

    // ---------------------------------------------------------
    // 3. FETCH RECEPTES (Saved -> Fallback Community)
    // ---------------------------------------------------------
    const { data: rawSavedRecipes, error: rError } = await supabase
      .from('saved_recipes')
      .select('id, name, dietary_tags, tags')
      .limit(50)
      .returns<DbSavedRecipe[]>();

    if (rError) throw new Error("DB Error fetching saved_recipes: " + rError.message);

    const candidates: RecipeCandidate[] = (rawSavedRecipes || [])
      .map((r) => {
        const safeTags = Array.isArray(r.dietary_tags) ? r.dietary_tags : [];
        const extraTags = Array.isArray(r.tags) ? r.tags : [];
        return {
          id: r.id,
          title: r.name,
          tags: [...safeTags, ...extraTags],
          description: ''
        };
      });

    if (candidates.length === 0) {
      const { data: publicRecipes, error: pubError } = await supabase
        .from('community_recipes')
        .select('id, title, tags, description')
        .limit(20)
        .returns<DbCommunityRecipe[]>();

      if (pubError) console.error("Error fetching community recipes:", pubError.message);

      if (publicRecipes) {
        publicRecipes.forEach((r) => candidates.push({
          id: r.id,
          title: r.title,
          tags: r.tags || [],
          description: r.description || ''
        }));
      }
    }

    if (candidates.length === 0) throw new Error("No recipes found anywhere.");

    // ---------------------------------------------------------
    // 4. EXECUTAR ALGORITME
    // ---------------------------------------------------------
    const result = findBestRecipe(groupProfile, candidates);

    if (!result.success || !result.choice) {
      throw new Error(result.error || "Decision failed");
    }

    // ---------------------------------------------------------
    // 5. GUARDAR A DB
    // ---------------------------------------------------------
    const decisionEntry = {
      room_id: roomId,
      choice: result.choice,
      reason: result.reason,
      metadata: result.metadata,
      candidates_proposed: candidates.map(c => c.title)
    };

    const { error: dbError } = await supabase
      .from('group_decisions')
      .insert([decisionEntry]);

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      throw new Error("Error guardant la decisió: " + dbError.message);
    }

    // ✅ EXTRA: Actualitzem el timestamp de la sala (per coherència amb el Repository)
    await supabase
      .from('decision_rooms')
      .update({ last_decision_at: new Date().toISOString() })
      .eq('id', roomId);

    revalidatePath(`/room/${roomId}`);
    return { success: true };

  } catch (error: unknown) {
    console.error('❌ ACTION ERROR:', error);
    let errorMessage = "Error desconegut";
    if (error instanceof Error) errorMessage = error.message;
    else if (typeof error === "string") errorMessage = error;

    return { success: false, error: errorMessage };
  }
}