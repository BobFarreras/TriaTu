'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';

import { SupabaseRateLimiter } from '@/adapters/supabase/SupabaseRateLimiter';
import { SupabaseSecurityLogger } from '@/adapters/supabase/SupabaseSecurityLogger';
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository';

import {
  CreateRoomSchema,
  ParticipantActionSchema,
  ClearHistorySchema,
} from '@/core/application/schemas/inputSchemas';

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

function getZodError(error: z.ZodError<unknown>): string {
  return error.issues[0]?.message || "Dades invàlides";
}

// ... (createRoomAction, joinRoomAction, kickParticipantAction, clearHistoryAction es mantenen igual) ...
// (Per brevetat, no els repeteixo aquí, només canvia la funció final)

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
// 5. ADD CANDIDATE (ORDRE CORREGIT: Validació -> Rate Limit)
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

  // 1️⃣ VALIDACIÓ (PRIMER): Si és brossa (XSS), rebutgem ràpid sense molestar al Rate Limiter
  const validation = AddCandidateSchema.safeParse({ roomId, candidateName });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  // 2️⃣ RATE LIMITING (SEGON): Protegim l'infraestructura un cop sabem que la petició té sentit
  const rateLimiter = new SupabaseRateLimiter();
  const logger = new SupabaseSecurityLogger();

  const isAllowed = await rateLimiter.check(`${userId}:add_candidate`, 10, 60);
  
  if (!isAllowed) {
    await logger.log('WARN', 'RATE_LIMIT_BREACH', userId, { roomId });
    return { success: false, error: 'Vas massa ràpid. Espera uns segons.' };
  }

  // 3️⃣ EXECUCIÓ
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