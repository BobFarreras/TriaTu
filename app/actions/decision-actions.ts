'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { DecisionType } from '@/core/domain/entities/Decision';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { MakeDecisionSchema, IndividualDecisionSchema } from '@/core/application/schemas/inputSchemas';
import { SupabaseClient } from '@supabase/supabase-js';
import { checkRoomDailyLimit } from '@/lib/security/decision-limit';
import { findBestRecipe, ParticipantProfile, RecipeCandidate } from '@/core/domain/services/recommendation-service';
import { DbProfileRow, DbSavedRecipe, DbCommunityRecipe } from '@/adapters/supabase/types/database.dtos';

// ✅ 1. IMPORTEM ELS FITXERS D'IDIOMA DIRECTAMENT
import { ca } from '@/lib/i18n/locales/ca';
import { es } from '@/lib/i18n/locales/es';
import { en } from '@/lib/i18n/locales/en';

// Map de diccionaris per accedir-hi dinàmicament
const DICTIONARIES: Record<string, typeof ca> = { ca, es, en };

// =========================================================
// TYPES
// =========================================================

interface DecisionMeta {
  matchCount?: number;
  isManual?: boolean;
  totalOptions?: number;
  [key: string]: unknown; 
}

// =========================================================
// 2. ACCIÓ INDIVIDUAL (Sense canvis)
// =========================================================
type MakeDecisionInput = { userId: string; type: DecisionType; energyLevel: number; timeMinutes: number; };

export async function makeIndividualDecisionAction(input: MakeDecisionInput) {
  const validation = IndividualDecisionSchema.safeParse(input);
  if (!validation.success) return { success: false, error: validation.error.issues[0].message };
  
  try {
    const useCase = container.getMakeIndividualDecision();
    const context = new DecisionContext({ energyLevel: input.energyLevel, availableTimeMinutes: input.timeMinutes });
    const decision = await useCase.execute({ userId: input.userId, type: input.type as DecisionType, context });
    return { success: true, data: { id: decision.id, choice: decision.outcome?.choice, reason: decision.outcome?.reason } };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error';
    return { success: false, error: msg };
  }
}

// =========================================================
// 3. ACCIÓ GRUPAL UNIFICADA (Magic + Manual)
// =========================================================

export async function makeGroupDecisionAction(
  roomId: string, 
  mode: 'magic' | 'manual', 
  locale: string = 'ca' 
) {
  console.log(`\n⚡ GROUP DECISION [${mode.toUpperCase()}] --- Room: ${roomId} Locale: ${locale}`);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  // ✅ 2. NORMALITZEM I CARREGUEM EL DICCIONARI
  // Això converteix 'en-US' -> 'en', 'es-ES' -> 'es' per evitar fallback incorrecte a català
  const normalizedLocale = locale.substring(0, 2).toLowerCase();
  const t = DICTIONARIES[normalizedLocale] || DICTIONARIES['ca'];

  // Validació
  const validation = MakeDecisionSchema.safeParse({ roomId, requesterUserId: user.id, mode });
  if (!validation.success) return { success: false, error: validation.error.issues.map(e => e.message).join(', ') };

  // Límits
  const limitCheck = await checkRoomDailyLimit(supabase, roomId);
  if (!limitCheck.allowed) return { success: false, error: limitCheck.error };

  try {
    let outcomeChoice: string;
    let outcomeReason: string;
    let outcomeMeta: DecisionMeta = {}; 
    let candidatesTitles: string[] = [];

    // --- BRANCA 1: MODE MÀGIC 🔮 ---
    if (mode === 'magic') {
      const { data: participants } = await supabase.from('room_participants').select('user_id').eq('room_id', roomId);
      if (!participants?.length) throw new Error("Room is empty");
      
      const userIds = participants.map(p => p.user_id);
      const { data: rawProfiles } = await supabase.from('preference_profiles').select('user_id, exclusions, food_preferences').in('user_id', userIds);
      const typedProfiles = rawProfiles as unknown as DbProfileRow[];

      const groupProfile: ParticipantProfile[] = (typedProfiles || []).map((p) => ({
        id: p.user_id,
        allergies: p.exclusions || [],
        dislikes: [],
        preferences: p.food_preferences || []
      }));

      const candidates: RecipeCandidate[] = await fetchCandidatesForRoom(supabase); 
      const result = findBestRecipe(groupProfile, candidates);
      
      if (!result.success || !result.choice) throw new Error(result.error || "Decision failed");

      outcomeChoice = result.choice;
      outcomeMeta = result.metadata || {};
      
      // ✅ 3. LÒGICA DE TEXT TRADUÏT (MATCH vs SAFE)
      const count = outcomeMeta.matchCount || 0;
      if (count === 0) {
        // "Opció Segura" (o "Safe Bet" en anglès)
        outcomeReason = t.room.history.magic_safe;
      } else {
        // Substituïm la variable {count} manualment
        outcomeReason = t.room.history.magic_match.replace('{count}', count.toString());
      }

      candidatesTitles = candidates.map(c => c.title);
    } 
    
    // --- BRANCA 2: MODE MANUAL 🎲 ---
    else {
      // ✅ Usem 'room_candidates' (la teva taula correcta)
      const { data: manualCandidates } = await supabase.from('room_candidates').select('content').eq('room_id', roomId);

      if (!manualCandidates || manualCandidates.length === 0) {
        // Usem el diccionari també per l'error si vols
        return { success: false, error: normalizedLocale === 'es' ? "¡No hay opciones!" : "No hi ha opcions!" };
      }

      const winner = manualCandidates[Math.floor(Math.random() * manualCandidates.length)];
      
      outcomeChoice = winner.content;
      
      // ✅ 4. TEXT MANUAL TRADUÏT
      outcomeReason = t.room.history.manual_reason;
      
      outcomeMeta = { isManual: true, totalOptions: manualCandidates.length };
      candidatesTitles = manualCandidates.map(c => c.content);
    }

    // Persistència
    const { error: insertError } = await supabase.from('group_decisions').insert({
      room_id: roomId,
      choice: outcomeChoice,
      reason: outcomeReason, // Es guarda el text traduït final (com a fallback)
      metadata: outcomeMeta,
      candidates_proposed: candidatesTitles
    });

    if (insertError) throw new Error(insertError.message);

    await supabase.from('decision_rooms').update({ last_decision_at: new Date().toISOString() }).eq('id', roomId);

    revalidatePath(`/rooms/${roomId}`);

    return { success: true, outcome: { choice: outcomeChoice, reason: outcomeReason } };

  } catch (error: unknown) {
    console.error("❌ Action Error:", error);
    const msg = error instanceof Error ? error.message : "Error desconegut";
    return { success: false, error: msg };
  }
}

// Helper per buscar receptes
async function fetchCandidatesForRoom(supabase: SupabaseClient): Promise<RecipeCandidate[]> {
    const { data: rawSaved } = await supabase.from('saved_recipes').select('id, name, dietary_tags, tags').limit(50);
    const typedSaved = rawSaved as unknown as DbSavedRecipe[];

    const candidates: RecipeCandidate[] = (typedSaved || []).map((r) => ({
        id: r.id,
        title: r.name,
        tags: [...(r.dietary_tags || []), ...(r.tags || [])],
        description: ''
    }));

    if (candidates.length === 0) {
         const { data: publicRecipes } = await supabase.from('community_recipes').select('id, title, tags, description').limit(20);
         const typedCommunity = publicRecipes as unknown as DbCommunityRecipe[];
        (typedCommunity || []).forEach(r => candidates.push({
            id: r.id, title: r.title, tags: r.tags || [], description: r.description || ''
        }));
    }
    
    if (candidates.length === 0) throw new Error("No recipes found");
    return candidates;
}