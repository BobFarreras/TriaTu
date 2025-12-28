'use server'

import { container } from "@/services/container";
import { createClient } from "@/adapters/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Acció per afegir un candidat (Restaurant, plat, etc.)
export async function addCandidateAction(roomId: string, content: string) {
  console.log(`🚀 [ACTION] Iniciant addCandidateAction...`);
  console.log(`📥 [INPUT] Room: ${roomId}, Content: "${content}"`);

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error("❌ [AUTH ERROR] No hi ha usuari autenticat:", authError);
    return { success: false, error: "Unauthorized" };
  }

  console.log(`👤 [USER] ID: ${user.id} (Email: ${user.email})`);

  try {
    const useCase = container.getAddCandidate();
    
    console.log(`🔄 [USECASE] Executant UseCase...`);
    await useCase.execute(roomId, user.id, content);
    
    console.log(`✅ [SUCCESS] Candidat afegit correctament.`);
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    // Aquest log és el que ens dirà la veritat
    console.error("❌ [CRITICAL ERROR] Error en l'execució:", error);
    
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

// 2. Acció per canviar el mode (Cego / Públic)
export async function toggleVotingModeAction(roomId: string, mode: 'BLIND' | 'PUBLIC') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const useCase = container.getSetVotingMode();
    // Passem l'ID de l'usuari perquè el Use Case verifiqui si és Host
    await useCase.execute(user.id, roomId, mode);
    
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

// ✅ FIX: Afegim 'roomId' com a segon paràmetre per poder refrescar
export async function removeCandidateAction(candidateId: string, roomId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const useCase = container.getRemoveCandidate();
    await useCase.execute(candidateId, user.id);
    
    // ✅ FIX: Ara sí que podem refrescar la sala
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}