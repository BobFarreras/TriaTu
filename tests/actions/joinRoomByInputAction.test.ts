import { beforeEach, describe, expect, it, vi } from 'vitest';
import { joinRoomByInputAction } from '@/app/actions/room-actions';
import { createClient } from '@/adapters/supabase/server';

vi.mock('@/adapters/supabase/server', () => ({
  createClient: vi.fn()
}));

vi.mock('@/services/container', () => ({
  container: {}
}));

describe('joinRoomByInputAction', () => {
  const userId = '4b3e9d3a-2f6b-4d1f-9e7a-1b2c3d4e5f60';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns missing_code when input is empty', async () => {
    const result = await joinRoomByInputAction('   ', userId);
    expect(result).toEqual({ success: false, error: 'missing_code' });
  });

  it('joins by invite code when input is not a uuid', async () => {
    const selectRoom = vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({ data: { id: '9f03b1b5-2e6b-4b29-b0f2-c2c8c1f6b0aa' }, error: null })
      }))
    }));
    const insertParticipant = vi.fn().mockResolvedValue({ error: null });
    const fromMock = vi.fn((table: string) => {
      if (table === 'decision_rooms') return { select: selectRoom };
      if (table === 'room_participants') return { insert: insertParticipant };
      return null;
    });
    vi.mocked(createClient).mockResolvedValue({ from: fromMock } as never);

    const result = await joinRoomByInputAction('INVITE-CODE', userId);

    expect(result).toEqual({ success: true, roomId: '9f03b1b5-2e6b-4b29-b0f2-c2c8c1f6b0aa' });
    expect(insertParticipant).toHaveBeenCalledTimes(1);
  });

  it('falls back to invite code when uuid is not found', async () => {
    const selectRoom = vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({ data: { id: '0b9c7a02-8fdb-4f1e-9b5d-7b5c3b7e9a52' }, error: null })
      }))
    }));
    const insertParticipant = vi.fn()
      .mockResolvedValueOnce({ error: { code: '23503' } })
      .mockResolvedValueOnce({ error: null });
    const fromMock = vi.fn((table: string) => {
      if (table === 'decision_rooms') return { select: selectRoom };
      if (table === 'room_participants') return { insert: insertParticipant };
      return null;
    });
    vi.mocked(createClient).mockResolvedValue({ from: fromMock } as never);

    const result = await joinRoomByInputAction('3a43f713-d60c-4014-8628-ae31737acb96', userId);

    expect(result).toEqual({ success: true, roomId: '0b9c7a02-8fdb-4f1e-9b5d-7b5c3b7e9a52' });
    expect(insertParticipant).toHaveBeenCalledTimes(2);
  });
});
