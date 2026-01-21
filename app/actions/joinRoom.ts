'use server';

import { createClient } from '@/adapters/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { debug } from '@/lib/logger';
import { logActionError } from '@/lib/observability/action-logger';

export async function joinRoomByCode(inviteCode: string) {
  debug('[ACTION] joinRoomByCode start');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'unauthenticated' };

  // Busquem la sala
  const { data: room, error: roomError } = await supabase
    .from('decision_rooms')
    .select('id, name, invite_code')
    .eq('invite_code', inviteCode)
    .single();

  if (roomError || !room) {
    return { error: 'invalid_code', message: 'Codi invalid' };
  }

  // Comprovem si l'usuari ja es a 'room_participants'
  const { data: existingParticipant } = await supabase
    .from('room_participants')
    .select('user_id')
    .eq('room_id', room.id)
    .eq('user_id', user.id)
    .single();

  if (existingParticipant) {
    redirect(`/rooms/${room.id}`);
  }

  // Si no hi es, fem l'INSERT a 'room_participants'
  const { error: joinError } = await supabase
    .from('room_participants')
    .insert({
      room_id: room.id,
      user_id: user.id
    });

  if (joinError) {
    logActionError('joinRoomByCode', 'joinRoomByCode insert failed', joinError);
    return { error: 'db_error', message: "No s'ha pogut unir a la sala" };
  }

  // Exit: netegem la cache i redirigim
  revalidatePath('/rooms');
  revalidatePath(`/rooms/${room.id}`);
  redirect(`/rooms/${room.id}`);
}
