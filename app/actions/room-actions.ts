'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
// 1. DEFINIM EL TIPUS D'ESTAT (Adéu 'any')
export type ActionState = {
  success?: boolean;
  error?: string;
  roomId?: string;     // Opcional: només per createRoom
  outcome?: {          // Opcional: només per makeDecision
    choice: string;
    reason: string;
  };
};

// Helper per extreure missatges d'error
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Definim un tipus de retorn serialitzable (DTO) per a la UI
type CreateRoomResult = {
  success: boolean;
  roomId?: string;
  error?: string;
};


export async function createRoomAction(userId: string, roomName: string): Promise<CreateRoomResult> {
  if (!userId || !roomName.trim()) {
    return { success: false, error: "Dades invàlides." };
  }

  try {
    const createRoomUseCase = container.getCreateDecisionRoom();

    // EL CANVI ÉS AQUÍ:
    // Com que 'execute' retorna un string (l'ID), l'assignem directament a 'roomId'.
    const newRoomId = await createRoomUseCase.execute({
      hostUserId: userId,
      name: roomName
    });

    // Passem 'newRoomId' directament, sense fer .id
    return { success: true, roomId: newRoomId };

  } catch (error) {
    console.error("Error creating room:", error);
    return { success: false, error: "No s'ha pogut crear la sala." };
  }
}
// ---------------------------------------------------------
// JOIN ROOM (Usat normalment sense useActionState, però el mantenim simple)
// ---------------------------------------------------------
export async function joinRoomAction(roomId: string, userId: string): Promise<ActionState> {
  try {
    const useCase = container.getJoinDecisionRoom();
    await useCase.execute({ roomId, userId });

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ---------------------------------------------------------
// MAKE DECISION (Cridat manualment amb startTransition)
// Nota: Aquí NO posem prevState perquè no s'usa amb useActionState a DecisionControls
// ---------------------------------------------------------
export async function makeGroupDecisionAction(roomId: string, mode: 'magic' | 'manual') {
  console.log(`🚀 [ACTION] Iniciant makeGroupDecisionAction...`);
  console.log(`📥 [PARAMS] Room: ${roomId}, Mode: ${mode}`);

  try {
    const supabase = await createClient();
    
    // 1. Verifiquem sessió
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized: No s'ha trobat la sessió." };
    }

    // 2. Executem Use Case
    const useCase = container.getMakeGroupDecision();
    
    // ❌ ELIMINAT: const domainMode = mode === 'manual' ? 'list' : 'magic'; 
    // ✅ CORRECCIÓ: Passem el mode directament, ja que el Use Case ara entén 'manual'
    
    const outcome = await useCase.execute({
        roomId,
        requesterUserId: user.id,
        mode: mode // <--- Passem 'magic' o 'manual' directament
    });

    console.log(`✅ [SUCCESS] Decisió presa:`, outcome.choice);

    revalidatePath(`/rooms/${roomId}`);
    return { success: true };

  } catch (error) {
    console.error("💥 [CRASH] Error a l'acció:", error);
    const msg = error instanceof Error ? error.message : "Error desconegut";
    return { success: false, error: msg };
  }
}
// Acció per fer fora gent
export async function kickParticipantAction(roomId: string, participantId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const useCase = container.getRemoveParticipant();
    await useCase.execute(user.id, roomId, participantId);
    
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) { 
    // ✅ CORRECCIÓ: No posem ': any'. TypeScript tracta això com 'unknown'.
    // Fem servir un 'Type Guard' per assegurar que és un objecte Error.
    const errorMessage = error instanceof Error 
      ? error.message 
      : "S'ha produït un error desconegut";
      
    return { success: false, error: errorMessage };
  }
}

// Acció per netejar historial
export async function clearHistoryAction(roomId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const useCase = container.getClearRoomHistory();
    await useCase.execute(user.id, roomId);

    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    // ✅ CORRECCIÓ: Mateixa lògica segura aquí
    const errorMessage = error instanceof Error 
      ? error.message 
      : "S'ha produït un error desconegut";

    return { success: false, error: errorMessage };
  }
}