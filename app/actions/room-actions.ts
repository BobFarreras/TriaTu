'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
// ✅ Imports correctes dels Adapters
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository';
import { SupabaseRateLimiter } from '@/adapters/supabase/SupabaseRateLimiter';
import { SupabaseSecurityLogger } from '@/adapters/supabase/SupabaseSecurityLogger';

import {
  CreateRoomSchema,
  ParticipantActionSchema,
  MakeDecisionSchema,
  ClearHistorySchema,
  AddCandidateSchema
} from '@/core/application/schemas/inputSchemas';
// Imports de la teva nova lògica AUTO
import { ResolveAutoDecision } from '@/core/usecases/decision/ResolveAutoDecision';
import { SupabaseDecisionRoomRepository } from '@/adapters/supabase/SupabaseDecisionRoomRepository';
import { SupabaseUserProfileRepository } from '@/adapters/supabase/SupabaseUserProfileRepository';
import { RuleBasedDecisionProvider } from '@/adapters/ai/RuleBaseDecisionProvider';
import { checkRoomDailyLimit } from '@/lib/security/decision-limit'; // ✅ IMPORT NOU


// Tipus de retorn
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

// Helper per errors de Zod (unknown per passar linter)
function getZodError(error: z.ZodError<unknown>): string {
  return error.issues[0]?.message || "Dades invàlides";
}

// ---------------------------------------------------------
// 1. CREATE ROOM
// ---------------------------------------------------------
export async function createRoomAction(userId: string, roomName: string): Promise<CreateRoomResult> {
  const validation = CreateRoomSchema.safeParse({ hostUserId: userId, name: roomName });

  if (!validation.success) {
    return { success: false, error: getZodError(validation.error) };
  }

  const { hostUserId, name } = validation.data;

  try {
    const createRoomUseCase = container.getCreateDecisionRoom();
    const newRoomId = await createRoomUseCase.execute({ hostUserId, name });

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

  if (!validation.success) {
    return { success: false, error: getZodError(validation.error) };
  }

  try {
    const useCase = container.getJoinDecisionRoom();
    await useCase.execute(validation.data);

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, error: msg };
  }
}

// ---------------------------------------------------------
// 3. AFEGIR CANDIDAT (AMB SEGURETAT COMPLETA)
// ---------------------------------------------------------
export async function addCandidateAction(roomId: string, content: string): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  // A. VALIDACIÓ INPUT (Zod)
  const validation = AddCandidateSchema.safeParse({
    roomId,
    userId: user.id,
    content
  });

  if (!validation.success) {
    return { success: false, error: getZodError(validation.error) };
  }

  // B. RATE LIMITING (Anti-Spam)
  const limiter = new SupabaseRateLimiter();

  // Clau única: usuari + acció + sala (perquè pugui escriure a altres sales si vol)
  const canProceed = await limiter.check(
    `add_cand:${user.id}:${roomId}`,
    10, // Max 10 candidats
    60  // En 60 segons
  );

  // C. LOGGING DE SEGURETAT (Si supera el límit)
  if (!canProceed) {
    const logger = new SupabaseSecurityLogger();

    // Registrem l'intent de spam
    await logger.log('WARN', 'RATE_LIMIT_BREACH', user.id, {
      action: 'add_candidate',
      roomId: roomId,
      limit: 10
    });

    return { success: false, error: "Estàs enviant opcions massa ràpid. Relaxa't un moment." };
  }

  try {
    const repo = new SupabaseCandidateRepository();
    await repo.add(validation.data.roomId, validation.data.userId, validation.data.content);

    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Error afegint opció" };
  }
}

// ---------------------------------------------------------
// 4. MAKE DECISION (DISPATCHER: MANUAL vs MAGIC)
// ---------------------------------------------------------
export async function makeGroupDecisionAction(roomId: string, mode: 'magic' | 'manual') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  // Validem input
  const validation = MakeDecisionSchema.safeParse({
    roomId,
    requesterUserId: user.id,
    mode
  });

  if (!validation.success) {
    return { success: false, error: getZodError(validation.error) };
  }


  // 1. 🛡️ VERIFICAR LÍMITS (Ara la manual també està protegida!)
  const limitCheck = await checkRoomDailyLimit(supabase, roomId);
  if (!limitCheck.allowed) {
    return { success: false, error: limitCheck.error };
  }
  try {
    let outcome;

    if (mode === 'magic') {
      // 🔮 MODE AUTO (Nou fluxe amb les teves entitats)
      // Instanciem les dependències aquí per claredat (o utilitzem container si ho registrem allà)
      const roomRepo = new SupabaseDecisionRoomRepository();
      const profileRepo = new SupabaseUserProfileRepository(); // ✅ El teu repo
      const provider = new RuleBasedDecisionProvider();        // ✅ El provider simple

      const useCase = new ResolveAutoDecision(roomRepo, profileRepo, provider);

      // Execute llençarà error si estem en Cooldown (Time Invariant)
      outcome = await useCase.execute(roomId, user.id);

    } else {
      // 🎲 MODE MANUAL (Flux existent)
      // Utilitza els candidats que els usuaris han escrit manualment
      const useCase = container.getMakeGroupDecision();
      outcome = await useCase.execute({
        roomId,
        requesterUserId: user.id,
        mode
      });
    }

    revalidatePath(`/rooms/${roomId}`);

    return {
      success: true,
      outcome: {
        choice: outcome.choice,
        reason: outcome.reason
      }
    };

  } catch (error: unknown) {
    console.error("Action Error:", error);
    const msg = error instanceof Error ? error.message : "Error desconegut";

    // Gestió visual de l'error de Cooldown que ve de la teva entitat DecisionRoom
    if (msg.includes("Wait")) {
      return { success: false, error: `⏳ ${msg}` };
    }

    return { success: false, error: msg };
  }
}

// ---------------------------------------------------------
// 5. KICK PARTICIPANT
// ---------------------------------------------------------
export async function kickParticipantAction(roomId: string, participantId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const KickSchema = z.object({
    roomId: z.string().uuid(),
    participantId: z.string().uuid(),
    hostId: z.string().uuid()
  });

  const validation = KickSchema.safeParse({ roomId, participantId, hostId: user.id });

  if (!validation.success) {
    return { success: false, error: getZodError(validation.error) };
  }

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
// 6. CLEAR HISTORY
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