// features/rooms/actions/delete-room.ts
'use server';

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';

// ✅ Retorn tipat explícit
export type DeleteRoomResult = { success: boolean; error?: string };

export async function deleteRoom(roomId: string): Promise<DeleteRoomResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const { error } = await supabase
      .from('decision_rooms')
      .delete()
      .eq('id', roomId)
      .eq('host_user_id', user.id);

    if (error) {
      console.error('Error deleting room:', error);
      return { success: false, error: 'Error DB' };
    }

    revalidatePath('/rooms');
    return { success: true };

  } catch (error) {
    console.error(error);
    return { success: false, error: 'Unexpected error' };
  }
}