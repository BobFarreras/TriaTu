'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';

// Imports del domini i esquemes
import {
  CreateRoomSchema,
  ParticipantActionSchema,
  ClearHistorySchema,
  // MakeDecisionSchema <-- JA NO EL NECESSITEM AQUÍ
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

// Helper per errors de Zod
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
// 3. KICK PARTICIPANT
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