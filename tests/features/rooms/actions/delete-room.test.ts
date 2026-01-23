// tests/features/rooms/actions/delete-room.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteRoom } from '@/features/rooms/actions/delete-room';
import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';

// Mocks
vi.mock('@/adapters/supabase/server', () => ({
  createClient: vi.fn()
}));
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('Delete Room Feature', () => {
  const MOCK_ROOM_ID = 'room-123';
  const MOCK_HOST_ID = 'user-host-uuid';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return Unauthorized when there is no user', async () => {
    const getUser = vi.fn().mockResolvedValue({ data: { user: null } });
    const fromMock = vi.fn();

    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser },
      from: fromMock
    } as never);

    const result = await deleteRoom(MOCK_ROOM_ID);

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('should delete room and redirect if current user IS the host', async () => {
    const getUser = vi.fn().mockResolvedValue({ data: { user: { id: MOCK_HOST_ID } } });
    const chain = { eq: vi.fn(), error: null };
    chain.eq.mockReturnValue(chain);
    const deleteMock = vi.fn(() => chain);
    const fromMock = vi.fn(() => ({ delete: deleteMock }));

    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser },
      from: fromMock
    } as never);

    const result = await deleteRoom(MOCK_ROOM_ID);

    expect(fromMock).toHaveBeenCalledWith('decision_rooms');
    expect(deleteMock).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith('id', MOCK_ROOM_ID);
    expect(chain.eq).toHaveBeenCalledWith('host_user_id', MOCK_HOST_ID);
    expect(revalidatePath).toHaveBeenCalledWith('/rooms');
    expect(result).toEqual({ success: true });
  });
});
