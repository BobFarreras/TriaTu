'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { SupabaseRateLimiter } from '@/adapters/supabase/SupabaseRateLimiter';
import { SupabaseSecurityLogger } from '@/adapters/supabase/SupabaseSecurityLogger';
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { checkRoomDailyLimit } from '@/lib/security/decision-limit';

import { CreateRoomSchema, ParticipantActionSchema} from '@/core/application/schemas/inputSchemas';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';



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


// --- GESTIÓ D'IDIOMA ---
import { ca } from '@/lib/i18n/locales/ca';
import { es } from '@/lib/i18n/locales/es';
import { en } from '@/lib/i18n/locales/en';
import { RecipeEnricherService } from '@/core/services/RecipeEnrocherSercie';

// ✅ TIPATGE SEGUR: Definim el tipus del diccionari per evitar 'any'
const DICTIONARIES: Record<string, Dictionary> = { ca, es, en };

// ✅ INTERFÍCIES NOVES PER EVITAR 'ANY'
interface DbProfile {
  user_id: string;
  exclusions: string[] | null;
  food_preferences: string[] | null;
}

interface DecisionMeta {
  isAiGenerated?: boolean;
  isManual?: boolean;
  vibe?: string;
  tags?: string[];
  fullRecipe?: unknown; // O el tipus RecipeProps si el tens importat
  totalOptions?: number;
  matchCount?: number;
  [key: string]: unknown; // Permet extensibilitat sense usar 'any' descontrolat
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
// 7. MAKE GROUP DECISION (FINAL AMB TOTES LES FEATURES)
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

  const normalizedLocale = locale.substring(0, 2).toLowerCase();
  const t: Dictionary = DICTIONARIES[normalizedLocale] || DICTIONARIES['ca'];

  // 1. Validació Límits
  const limitCheck = await checkRoomDailyLimit(supabase, roomId);
  if (!limitCheck.allowed) return { success: false, error: limitCheck.error };

  try {
    let outcomeChoice: string;
    let outcomeReason: string;
    let outcomeMeta: DecisionMeta = {};
    let candidatesTitles: string[] = [];

    // --- MODE MÀGIC (IA GENERATIVA) ---
    if (mode === 'magic') {
      const { data: participants } = await supabase.from('room_participants').select('user_id').eq('room_id', roomId);
      if (!participants?.length) throw new Error("Room is empty");

      const userIds = participants.map(p => p.user_id);

      // Recuperar perfils
      const { data: rawProfiles } = await supabase
        .from('preference_profiles')
        .select('user_id, exclusions, food_preferences')
        .in('user_id', userIds);

      const profiles = (rawProfiles || []) as unknown as DbProfile[];

      // Fusió de Dades
      const groupRestrictions = new Set<string>();
      const groupPreferences: string[] = [];

      profiles.forEach((p) => {
        if (p.exclusions) p.exclusions.forEach((e) => groupRestrictions.add(e));
        if (p.food_preferences) p.food_preferences.forEach((pref) => groupPreferences.push(pref));
      });

      const finalRestrictions = Array.from(groupRestrictions) as DietaryRestriction[];

      // Triar Vibe
      let vibe = "Sorpresa creativa per a grups";
      if (groupPreferences.length > 0) {
        const randomPref = groupPreferences[Math.floor(Math.random() * groupPreferences.length)];
        vibe = `Estil ${randomPref} (Consens Grupal)`;
      }

      console.log(`👥 [GROUP AI] Generant menú per a ${userIds.length} persones.`);
      console.log(`   🚫 Restriccions: ${finalRestrictions.join(', ') || 'CAP'}`);
      console.log(`   ✨ Vibe triat: "${vibe}"`);

      // Generar Receptes
      const generator = container.getRecipeGenerator();

      const context = {
        mode: 'FATE' as const,
        count: 4,
        language: locale,
        inventory: [],
        restrictions: finalRestrictions,
        dislikes: [],
        energyLevel: 'MEDIUM' as const,
        timeAvailableMinutes: 45,
        focusDish: undefined,
        vibe: vibe
      };

      const aiRecipes = await generator.generate(context);

      if (!aiRecipes || aiRecipes.length === 0) throw new Error("La IA no ha generat res.");

      // Seleccionar Guanyadora
      let winnerRecipe = aiRecipes[Math.floor(Math.random() * aiRecipes.length)];

      // 🔥 ENRIQUIMENT MÀGIC (Buscar fotos i preus)
      try {
        console.log(`✨ [ENRICH] Millorant la recepta guanyadora: "${winnerRecipe.name}"...`);
        winnerRecipe = await RecipeEnricherService.enrichRecipe(winnerRecipe);
        
        const finalCost = winnerRecipe.estimatedCost || 0;
        console.log(`   💰 Cost calculat: ${finalCost.toFixed(2)}€`);
      } catch (err) {
        console.error("⚠️ Error enriquint recepta:", err);
      }

      outcomeChoice = winnerRecipe.name;
      outcomeReason = `Proposta basada en l'estil "${vibe}" i segura per a tots els participants.`;

      outcomeMeta = {
        isAiGenerated: true,
        vibe,
        tags: winnerRecipe.tags,
        // Ara fullRecipe tindrà linkedProductImage i estimatedCost plens!
        fullRecipe: winnerRecipe.toPrimitives()
      };

      candidatesTitles = aiRecipes.map(r => r.name);

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

    // 2. Persistència (INSERTAR LA NOVA DECISIÓ)
    await supabase.from('group_decisions').insert({
      room_id: roomId,
      choice: outcomeChoice,
      reason: outcomeReason,
      metadata: outcomeMeta,
      candidates_proposed: candidatesTitles
    });

    await supabase.from('decision_rooms').update({ last_decision_at: new Date().toISOString() }).eq('id', roomId);

    // 🔥 3. ROTACIÓ AUTOMÀTICA (Mantenir màxim 10) 🔥
    const { data: allHistory } = await supabase
        .from('group_decisions')
        .select('id')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false }); // Més recents primer

    if (allHistory && allHistory.length > 10) {
        // Agafem els IDs a partir de la posició 10 (els més vells)
        const idsToDelete = allHistory.slice(10).map(d => d.id);
        
        if (idsToDelete.length > 0) {
            console.log(`🧹 [AUTO-CLEANUP] Eliminant ${idsToDelete.length} decisions antigues...`);
            await supabase
                .from('group_decisions')
                .delete()
                .in('id', idsToDelete);
        }
    }

    revalidatePath(`/rooms/${roomId}`);
    return { success: true, outcome: { choice: outcomeChoice, reason: outcomeReason } };

  } catch (error) {
    console.error("❌ Room Action Error:", error);
    return { success: false, error: "Error en la decisió grupal" };
  }
}