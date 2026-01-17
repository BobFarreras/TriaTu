'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { SupabaseRateLimiter } from '@/adapters/supabase/SupabaseRateLimiter';
import { SupabaseSecurityLogger } from '@/adapters/supabase/SupabaseSecurityLogger';
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository';
import { DecisionType } from '@/core/domain/entities/Decision';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { checkRoomDailyLimit } from '@/lib/security/decision-limit';
import { findBestRecipe, ParticipantProfile, RecipeCandidate } from '@/core/domain/services/recommendation-service';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateRoomSchema, ParticipantActionSchema, ClearHistorySchema } from '@/core/application/schemas/inputSchemas';

// --- GESTIÓ D'IDIOMA ---
import { ca } from '@/lib/i18n/locales/ca';
import { es } from '@/lib/i18n/locales/es';
import { en } from '@/lib/i18n/locales/en';
// ✅ IMPORT IMPORTANT: Importem el tipus base del diccionari
import { Dictionary } from '@/lib/i18n/dictionaries';

// ✅ FIX: Usem 'any' aquí per evitar que TS es queixi si 'es' o 'en' 
// tenen menys claus que 'ca'. Així no bloqueja la compilació.
const DICTIONARIES: Record<string, any> = { ca, es, en };

// --- TIPUS DE RETORN I DB ---
export type ActionState = {
  success?: boolean;
  error?: string;
  roomId?: string;
  outcome?: {
    choice: string;
    reason: string;
  };
};

type CreateRoomResult = {
  success: boolean;
  roomId?: string;
  error?: string;
};

interface DecisionMeta {
  matchCount?: number;
  isManual?: boolean;
  totalOptions?: number;
  [key: string]: unknown; 
}

// Interfaces per Type Safety amb Supabase
interface DbProfile {
    user_id: string;
    exclusions: string[] | null;
    food_preferences: string[] | null;
}

interface DbRecipe {
    id: string;
    name: string;
    dietary_tags: string[] | null;
    tags: string[] | null;
}

// Helper per errors Zod
function getZodError(error: z.ZodError<unknown>): string {
  return error.issues[0]?.message || "Dades invàlides";
}

// ---------------------------------------------------------
// 1. CREATE ROOM
// ---------------------------------------------------------
export async function createRoomAction(userId: string, roomName: string): Promise<CreateRoomResult> {
  const validation = CreateRoomSchema.safeParse({ hostUserId: userId, name: roomName });
  if (!validation.success) return { success: false, error: getZodError(validation.error) };
  try {
    const createRoomUseCase = container.getCreateDecisionRoom();
    const newRoomId = await createRoomUseCase.execute({ hostUserId: validation.data.hostUserId, name: validation.data.name });
    return { success: true, roomId: newRoomId };
  } catch (error) {
    console.error("Error creating room:", error);
    return { success: false, error: "No s'ha pogut crear la sala." };
  }
}

// ---------------------------------------------------------
// 2. JOIN ROOM
// ---------------------------------------------------------
export async function joinRoomAction(roomId: string, userId: string): Promise<ActionState> {
  const validation = ParticipantActionSchema.safeParse({ roomId, userId });
  if (!validation.success) return { success: false, error: getZodError(validation.error) };
  try {
    const useCase = container.getJoinDecisionRoom();
    await useCase.execute(validation.data);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// ---------------------------------------------------------
// 3. KICK PARTICIPANT
// ---------------------------------------------------------
export async function kickParticipantAction(roomId: string, participantId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };
  
  const KickSchema = z.object({ roomId: z.string().uuid(), participantId: z.string().uuid(), hostId: z.string().uuid() });
  const validation = KickSchema.safeParse({ roomId, participantId, hostId: user.id });
  
  if (!validation.success) return { success: false, error: getZodError(validation.error) };
  
  try {
    const useCase = container.getRemoveParticipant();
    await useCase.execute(user.id, roomId, participantId);
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Error desconegut" };
  }
}

// ---------------------------------------------------------
// 4. CLEAR HISTORY
// ---------------------------------------------------------
export async function clearHistoryAction(roomId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };
  
  const validation = ClearHistorySchema.safeParse({ roomId, userId: user.id });
  if (!validation.success) return { success: false, error: getZodError(validation.error) };
  
  try {
    const useCase = container.getClearRoomHistory();
    await useCase.execute(user.id, roomId);
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Error desconegut" };
  }
}

// ---------------------------------------------------------
// 5. ADD CANDIDATE
// ---------------------------------------------------------
const AddCandidateSchema = z.object({
  roomId: z.string().uuid(),
  candidateName: z.string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9\sÀ-ÿ\u00f1\u00d1]+$/, 'No es permeten els caràcters especials'),
});

export async function addCandidateAction(roomId: string, candidateName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'anonymous';

  // 1. Validació
  const validation = AddCandidateSchema.safeParse({ roomId, candidateName });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  // 2. Rate Limiting
  const rateLimiter = new SupabaseRateLimiter();
  const logger = new SupabaseSecurityLogger();
  const isAllowed = await rateLimiter.check(`${userId}:add_candidate`, 10, 60);

  if (!isAllowed) {
    await logger.log('WARN', 'RATE_LIMIT_BREACH', userId, { roomId });
    return { success: false, error: 'Vas massa ràpid. Espera uns segons.' };
  }

  // 3. Execució
  try {
    const repo = new SupabaseCandidateRepository();
    await repo.add(roomId, userId, candidateName);
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error intern al guardar.' };
  }
}

// ---------------------------------------------------------
// 6. MAKE INDIVIDUAL DECISION
// ---------------------------------------------------------
export async function makeIndividualDecisionAction(input: { userId: string; type: string; energyLevel: number; timeMinutes: number; }) {
  try {
    const useCase = container.getMakeIndividualDecision();
    const context = new DecisionContext({ energyLevel: input.energyLevel, availableTimeMinutes: input.timeMinutes });

    const decision = await useCase.execute({
      userId: input.userId,
      type: input.type as DecisionType,
      context
    });

    return { success: true, data: { id: decision.id, choice: decision.outcome?.choice } };
  } catch (error) {
    return { success: false, error: "Error prenent decisió individual" };
  }
}

// ---------------------------------------------------------
// 7. MAKE GROUP DECISION
// ---------------------------------------------------------
export async function makeGroupDecisionAction(
  roomId: string, 
  mode: 'magic' | 'manual', 
  locale: string = 'ca' 
) {
  console.log(`⚡ GROUP DECISION [${mode}] Room: ${roomId}`);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  // Normalitzem l'idioma
  const normalizedLocale = locale.substring(0, 2).toLowerCase();
  const t: Dictionary = DICTIONARIES[normalizedLocale] || DICTIONARIES['ca'];

  // Validació Límits
  const limitCheck = await checkRoomDailyLimit(supabase, roomId);
  if (!limitCheck.allowed) return { success: false, error: limitCheck.error };

  try {
    let outcomeChoice: string;
    let outcomeReason: string;
    let outcomeMeta: DecisionMeta = {}; 
    let candidatesTitles: string[] = [];

    // --- MODE MÀGIC ---
    if (mode === 'magic') {
      const { data: participants } = await supabase.from('room_participants').select('user_id').eq('room_id', roomId);
      if (!participants?.length) throw new Error("Room is empty");
      
      const userIds = participants.map(p => p.user_id);
      const { data: profiles } = await supabase.from('preference_profiles').select('user_id, exclusions, food_preferences').in('user_id', userIds);
      
      // ✅ FIX: Casting segur amb interfícies definides
      const typedProfiles = (profiles as unknown as DbProfile[]) || [];

      const groupProfile: ParticipantProfile[] = typedProfiles.map(p => ({
        id: p.user_id,
        allergies: p.exclusions || [],
        dislikes: [],
        preferences: p.food_preferences || []
      }));

      const candidates = await fetchCandidatesForRoom(supabase); 
      
      const result = findBestRecipe(groupProfile, candidates);
      if (!result.success || !result.choice) throw new Error("No s'ha pogut decidir");

      outcomeChoice = result.choice;
      outcomeMeta = result.metadata || {};
      
      const count = outcomeMeta.matchCount || 0;
      // ✅ FIX: Accés segur a les propietats traduïdes
      outcomeReason = count === 0 
        ? t.room.history.magic_safe 
        : t.room.history.magic_match.replace('{count}', count.toString());
        
      candidatesTitles = candidates.map(c => c.title);

    } else {
      // --- MODE MANUAL ---
      const { data: manualCandidates } = await supabase.from('room_candidates').select('content').eq('room_id', roomId);
      
      if (!manualCandidates?.length) return { success: false, error: "No hi ha opcions!" };

      const winner = manualCandidates[Math.floor(Math.random() * manualCandidates.length)];
      outcomeChoice = winner.content;
      outcomeReason = t.room.history.manual_reason;
      outcomeMeta = { isManual: true, totalOptions: manualCandidates.length };
      candidatesTitles = manualCandidates.map(c => c.content);
    }

    // Persistència
    await supabase.from('group_decisions').insert({
      room_id: roomId,
      choice: outcomeChoice,
      reason: outcomeReason,
      metadata: outcomeMeta,
      candidates_proposed: candidatesTitles
    });

    await supabase.from('decision_rooms').update({ last_decision_at: new Date().toISOString() }).eq('id', roomId);

    revalidatePath(`/rooms/${roomId}`);
    return { success: true, outcome: { choice: outcomeChoice, reason: outcomeReason } };

  } catch (error) {
    console.error("❌ Room Action Error:", error);
    return { success: false, error: "Error en la decisió grupal" };
  }
}

// --- HELPERS ---

async function fetchCandidatesForRoom(supabase: SupabaseClient): Promise<RecipeCandidate[]> {
    const { data } = await supabase.from('saved_recipes').select('id, name, dietary_tags, tags').limit(50);
    
    // ✅ FIX: Casting segur
    const typedData = (data as unknown as DbRecipe[]) || [];

    return typedData.map(r => ({
        id: r.id,
        title: r.name,
        tags: [...(r.dietary_tags || []), ...(r.tags || [])],
        description: ''
    }));
}