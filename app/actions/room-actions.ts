// app/actions/room-actions.ts
'use server'

import { container } from '@/services/container';
import { revalidatePath } from 'next/cache';

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error occurred';
}

export async function createRoomAction(hostUserId: string, name: string) {
  try {
    const useCase = container.getCreateDecisionRoom();
    const roomId = await useCase.execute({ hostUserId, name });
    return { success: true, roomId };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function joinRoomAction(roomId: string, userId: string) {
  try {
    const useCase = container.getJoinDecisionRoom();
    await useCase.execute({ roomId, userId });
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// CANVI: Ara és makeGroupDecisionAction i accepta candidats
export async function makeGroupDecisionAction(
  roomId: string, 
  requesterUserId: string,
  candidates: string[] = [] // Opcional, per defecte buit
) {
  try {
    // 1. Obtenim el nou cas d'ús del container
    const useCase = container.getMakeGroupDecision();
    
    // 2. Executem passant els candidats (si n'hi ha)
    const outcome = await useCase.execute({ 
      roomId, 
      requesterUserId,
      candidates: candidates.length > 0 ? candidates : undefined
    });
    
    revalidatePath(`/rooms/${roomId}`);
    return { 
      success: true, 
      outcome: {
        choice: outcome.choice,
        reason: outcome.reason
      }
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}