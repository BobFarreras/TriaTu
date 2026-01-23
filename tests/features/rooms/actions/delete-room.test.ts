// tests/features/rooms/actions/delete-room.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteRoom } from '@/features/rooms/actions/delete-room';
import * as RoomRepository from '@/features/rooms/repositories/room-repository';
import * as AuthModule from '@/lib/auth/session';
import { redirect } from 'next/navigation';

// Mocks
vi.mock('@/features/rooms/repositories/room-repository');
vi.mock('@/lib/auth/session');
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  revalidatePath: vi.fn()
}));

describe('Delete Room Feature', () => {
  const MOCK_ROOM_ID = 'room-123';
  const MOCK_HOST_ID = 'user-host-uuid';
  const MOCK_INTRUDER_ID = 'user-intruder-uuid';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw "Unauthorized" if current user is NOT the host', async () => {
    // 1. Setup: Usuari autenticat (Intrus)
    // ✅ CORRECCIÓ: Afegim l'email per complir amb el tipatge
    vi.spyOn(AuthModule, 'getCurrentUser').mockResolvedValue({ 
      id: MOCK_INTRUDER_ID, 
      email: 'intruder@example.com' 
    });
    
    // El host de la sala és un altre
    vi.spyOn(RoomRepository, 'getRoomHostId').mockResolvedValue(MOCK_HOST_ID);

    // 2. Act & Assert
    await expect(deleteRoom(MOCK_ROOM_ID))
      .rejects.toThrow('Unauthorized: Only the host can delete the room');
      
    expect(RoomRepository.deleteRoomById).not.toHaveBeenCalled();
  });

  it('should delete room and redirect if current user IS the host', async () => {
    // 1. Setup: Usuari autenticat (Host)
    // ✅ CORRECCIÓ: Afegim l'email aquí també
    vi.spyOn(AuthModule, 'getCurrentUser').mockResolvedValue({ 
      id: MOCK_HOST_ID, 
      email: 'host@example.com' 
    });
    
    vi.spyOn(RoomRepository, 'getRoomHostId').mockResolvedValue(MOCK_HOST_ID);

    // 2. Act
    await deleteRoom(MOCK_ROOM_ID);

    // 3. Assert
    expect(RoomRepository.deleteRoomById).toHaveBeenCalledWith(MOCK_ROOM_ID);
    expect(redirect).toHaveBeenCalledWith('/rooms');
  });
});