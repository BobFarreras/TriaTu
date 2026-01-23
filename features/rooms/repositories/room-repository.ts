// src/features/rooms/repositories/room-repository.ts
import { createClient } from '@/adapters/supabase/server';

export async function getRoomHostId(roomId: string): Promise<string | null> {
  const supabase = await createClient(); // ⚠️ Afegeix await aquí
  
  const { data, error } = await supabase
    .from('decision_rooms')
    .select('host_user_id')
    .eq('id', roomId)
    .single();

  if (error || !data) return null;
  return data.host_user_id;
}

export async function deleteRoomById(roomId: string): Promise<void> {
  const supabase = await createClient(); // ⚠️ Afegeix await aquí
  
  const { error } = await supabase
    .from('decision_rooms')
    .delete()
    .eq('id', roomId);

  if (error) {
    throw new Error(`Failed to delete room: ${error.message}`);
  }
}