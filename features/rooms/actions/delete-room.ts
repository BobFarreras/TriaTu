// src/features/rooms/actions/delete-room.ts
'use server';
import { getCurrentUser } from '@/lib/auth/session'; // ✅ Ara ja existeix
import { getRoomHostId, deleteRoomById } from '@/features/rooms/repositories/room-repository';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteRoom(roomId: string) {
  // 1. Auth Check
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthenticated');
  }

  // 2. Domain Logic Check
  const hostId = await getRoomHostId(roomId);
  
  if (!hostId) {
    throw new Error('Room not found');
  }

  if (hostId !== user.id) {
    throw new Error('Unauthorized: Only the host can delete the room');
  }

  // 3. Execution
  try {
    await deleteRoomById(roomId);
  } catch (error) {
    console.error('Error deleting room:', error);
    throw new Error('Could not delete the room. Please try again.');
  }

  // 4. Feedback
  revalidatePath('/rooms');
  redirect('/rooms');
}