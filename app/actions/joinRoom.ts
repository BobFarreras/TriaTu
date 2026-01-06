'use server';

import { createClient } from '@/adapters/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function joinRoomByCode(inviteCode: string) {
  const supabase = await createClient();

  // 1. Obtenim l'usuari actual
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Si no està loguejat, retornem error o redirigim al login
    // (Això normalment es gestiona abans, a la pàgina)
    return { error: 'unauthenticated' };
  }

  // 2. Busquem la sala a 'decision_rooms' fent servir el codi
  const { data: room, error: roomError } = await supabase
    .from('decision_rooms') // ✅ El teu nom de taula correcte
    .select('id, name')
    .eq('invite_code', inviteCode)
    .single();

  if (roomError || !room) {
    return { error: 'invalid_code', message: 'Codi invàlid o sala no trobada' };
  }

  // 3. Comprovem si l'usuari JA està a 'room_participants'
  // (Per evitar error de clau duplicada)
  const { data: existingParticipant } = await supabase
    .from('room_participants') // ✅ La teva taula de relació
    .select('user_id')
    .eq('room_id', room.id)
    .eq('user_id', user.id)
    .single();

  if (existingParticipant) {
    // Si ja és dins, perfecte, l'enviem cap a la sala
    redirect(`/rooms/${room.id}`);
  }

  // 4. Si no hi és, fem l'INSERT a 'room_participants'
  const { error: joinError } = await supabase
    .from('room_participants')
    .insert({
      room_id: room.id,
      user_id: user.id,
      // joined_at s'omple sol amb default now() segons el teu SQL
    });

  if (joinError) {
    console.error("Error joining room:", joinError);
    return { error: 'db_error', message: 'No s\'ha pogut unir a la sala' };
  }

  // 5. Èxit! Netegem la caché i redirigim
  revalidatePath('/rooms'); // Actualitza la llista de "Les meves sales"
  revalidatePath(`/rooms/${room.id}`);
  redirect(`/rooms/${room.id}`);
}