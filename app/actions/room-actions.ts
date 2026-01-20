'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { SupabaseRateLimiter } from '@/adapters/supabase/SupabaseRateLimiter';
import { SupabaseSecurityLogger } from '@/adapters/supabase/SupabaseSecurityLogger';
import { debug, error as logError } from '@/lib/logger';
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { checkRoomDailyLimit } from '@/lib/security/decision-limit';

import { CreateRoomSchema, ParticipantActionSchema } from '@/core/application/schemas/inputSchemas';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';
// --- GESTIÓ D'IDIOMA ---
import { ca } from '@/lib/i18n/locales/ca';
import { es } from '@/lib/i18n/locales/es';
import { en } from '@/lib/i18n/locales/en';
import { RecipeEnricherService } from '@/core/application/services/RecipeEnricherService';



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

// Definim el tipus exacte del que ens retorna Supabase
interface RoomParticipantRow {
  room: {
    id: string;
    name: string;
    enable_inventory: boolean;
    enable_shopping_list: boolean;
  } | null;
}

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
    logError('createRoomAction failed', error);
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
    logError('addCandidateAction failed', error);
    return { success: false, error: 'Error intern al guardar.' };
  }
}


// ---------------------------------------------------------
// ---------------------------------------------------------

export async function makeGroupDecisionAction(
  roomId: string,
  mode: 'magic' | 'manual',
  locale: string = 'ca'
) {
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

      debug('[ACTION] group AI generate');



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
        debug('[ACTION] enrich winner recipe');
        const enricher = new RecipeEnricherService(container.getProductCatalogRepo(supabase));
        winnerRecipe = await enricher.enrichRecipe(winnerRecipe);

        const finalCost = winnerRecipe.estimatedCost || 0;

      } catch (err) {
        logError("⚠️ Error enriquint recepta:", err);
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
        debug('[ACTION] cleanup old decisions');
        await supabase
          .from('group_decisions')
          .delete()
          .in('id', idsToDelete);
      }
    }

    revalidatePath(`/rooms/${roomId}`);
    return { success: true, outcome: { choice: outcomeChoice, reason: outcomeReason } };

  } catch (error) {
    logError("❌ Room Action Error:", error);
    return { success: false, error: "Error en la decisió grupal" };
  }

}
export async function getMyInventoryRoomsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Tipem la resposta com a array de RoomParticipantRow
  const { data, error } = await supabase
    .from('room_participants')
    .select(`
      room:decision_rooms (
        id,
        name,
        enable_inventory 
      )
    `)
    .eq('user_id', user.id)
    .returns<RoomParticipantRow[]>(); // <--- Tipatge fort

  if (error) {
    logError("Error fetching rooms:", error);
    return [];
  }

  if (!data) return [];
  const availableRooms = data
    .map((row) => row.room)
    // ✅ CORRECCIÓ: Fem servir 'room' (l'argument), no 'row'
    .filter((room): room is NonNullable<typeof room> =>
      room !== null && room.enable_inventory === true
    )
    .map((room) => ({
      id: room.id,
      name: room.name
    }));



  return availableRooms;
}

export async function getMyShoppingRoomsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('room_participants')
    .select(`
      room:decision_rooms (
        id,
        name,
        enable_inventory,
        enable_shopping_list
      )
    `)
    .eq('user_id', user.id)
    .returns<RoomParticipantRow[]>();

  if (error) {
    logError("Error fetching shopping rooms:", error);
    return [];
  }

  if (!data) return [];
  return data
    .map((row) => row.room)
    .filter((room): room is NonNullable<typeof room> =>
      room !== null && room.enable_shopping_list === true
    )
    .map((room) => ({
      id: room.id,
      name: room.name
    }));
}

export async function toggleRoomFeatureAction(roomId: string, feature: 'INVENTORY' | 'SHOPPING', isEnabled: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  // 1. Verifiquem que l'usuari és el HOST de la sala (Seguretat)
  const { data: room } = await supabase
    .from('decision_rooms')
    .select('host_user_id')
    .eq('id', roomId)
    .single();

  if (!room || room.host_user_id !== user.id) {
    return { success: false, error: "Només l'administrador pot canviar això." };
  }

  // 2. Mapegem la feature a la columna de la BD
  const column = feature === 'INVENTORY' ? 'enable_inventory' : 'enable_shopping_list'; // (Si tens llista compra)

  // 3. Actualitzem
  const { error } = await supabase
    .from('decision_rooms')
    .update({ [column]: isEnabled })
    .eq('id', roomId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/rooms/${roomId}`);
  return { success: true };
}

