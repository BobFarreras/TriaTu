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

  try {
    // --- PAS 1: FETCH PARTICIPANT IDs ---
    const { data: participants, error: pError } = await supabase
      .from('room_participants')
      .select('user_id')
      .eq('room_id', roomId);

    if (pError) throw new Error("Error fetching participants: " + pError.message);
    if (!participants || participants.length === 0) throw new Error("Room is empty");

    const userIds = participants.map(p => p.user_id);
    console.log(`👥 Found ${userIds.length} participants. Fetching profiles...`);

    // --- PAS 2: FETCH PROFILS ---
    const { data: rawProfiles, error: profError } = await supabase
      .from('preference_profiles')
      .select('user_id, exclusions, food_preferences')
      .in('user_id', userIds)
      .returns<DbProfileRow[]>();

    if (profError) throw new Error("Error fetching profiles: " + profError.message);

    console.log("🥗 PROFILES FETCHED:", JSON.stringify(rawProfiles, null, 2));

    const groupProfile: ParticipantProfile[] = (rawProfiles || []).map((p) => ({
      id: p.user_id,
      // Mapegem exclusions a allergies per seguretat (Hard Constraint)
      allergies: p.exclusions || [],
      dislikes: [],
      preferences: p.food_preferences || []
    }));

    // --- PAS 3: FETCH RECEPTES (SAVED RECIPES) ---
    // Consultem DIRECTAMENT la taula, sense joins que no existeixen
    const { data: rawSavedRecipes, error: rError } = await supabase
      .from('saved_recipes')
      .select('id, name, dietary_tags, tags') // camps reals de la taula
      .limit(50)
      .returns<DbSavedRecipe[]>();

    if (rError) throw new Error("DB Error fetching saved_recipes: " + rError.message);

    const candidates: RecipeCandidate[] = (rawSavedRecipes || [])
      .map((r) => {
        // Combinem tags i dietary_tags per tenir més informació
        const safeTags = Array.isArray(r.dietary_tags) ? r.dietary_tags : [];
        // Si tags és un array jsonb, l'afegim
        const extraTags = Array.isArray(r.tags) ? r.tags : [];

        return {
          id: r.id,
          title: r.name, // Mapegem 'name' -> 'title'
          tags: [...safeTags, ...extraTags],
          description: '' // saved_recipes no té description, ho deixem buit
        };
      });

    console.log(`📂 Loaded ${candidates.length} saved recipes.`);

    // Fallback: COMMUNITY RECIPES (Receptes Públiques)
    if (candidates.length === 0) {
      console.log("⚠️ No saved recipes, fetching PUBLIC community recipes...");
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

    if (candidates.length === 0) throw new Error("No recipes found anywhere (Saved or Community).");

    // --- PAS 4: EXECUTAR ALGORITME ---
    const result = findBestRecipe(groupProfile, candidates);

    if (!result.success || !result.choice) {
      throw new Error(result.error || "Decision failed");
    }

    // --- PAS 5: GUARDAR A DB (CORREGIT) ---
    // Canviem 'room_history' per 'group_decisions' que és la taula real del teu esquema
    const decisionEntry = {
      room_id: roomId,
      choice: result.choice,
      reason: result.reason,
      metadata: result.metadata, // Ara funcionarà gràcies al SQL del Pas 1
      // Opcional: Si vols omplir candidates_proposed per tenir històric
      candidates_proposed: candidates.map(c => c.title)
    };

    const { error: dbError } = await supabase
      .from('group_decisions') // 👈 NOM CORREGIT
      .insert([decisionEntry]);

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      throw new Error("Error guardant la decisió: " + dbError.message);
    }

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