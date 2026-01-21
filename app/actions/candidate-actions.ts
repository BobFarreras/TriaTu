'use server'

import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';
import { debug } from '@/lib/logger';
import { logActionError } from '@/lib/observability/action-logger';

// 1. Accio per afegir un candidat (Restaurant, plat, etc.)
export async function addCandidateAction(roomId: string, content: string) {
  debug('[ACTION] addCandidateAction start');

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    logActionError('addCandidateAction', 'Auth error in addCandidateAction', authError);
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const useCase = container.getAddCandidate();
    debug('[ACTION] addCandidateAction execute');
    await useCase.execute(roomId, user.id, content);

    debug('[ACTION] addCandidateAction success');
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    logActionError('addCandidateAction', 'addCandidateAction failed', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

// 2. Accio per canviar el mode (Cego / Public)
export async function toggleVotingModeAction(roomId: string, mode: 'BLIND' | 'PUBLIC') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const useCase = container.getSetVotingMode();
    // Passem l'ID de l'usuari perque el Use Case verifiqui si es Host
    await useCase.execute(user.id, roomId, mode);

    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

// FIX: Afegim 'roomId' com a segon parametre per poder refrescar
export async function removeCandidateAction(candidateId: string, roomId: string) {
  debug('[ACTION] removeCandidate start');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    logActionError('removeCandidateAction', 'removeCandidate unauthorized');
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const useCase = container.getRemoveCandidate();
    await useCase.execute(candidateId, user.id);

    debug('[ACTION] removeCandidate success');
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    logActionError('removeCandidateAction', 'removeCandidate failed', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: msg };
  }
}
