import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMyShoppingRoomsAction } from '@/app/actions/room-actions';

const getUserMock = vi.fn();
const fromMock = vi.fn();

vi.mock('@/services/container', () => ({
  container: {}
}));

vi.mock('@/adapters/supabase/server', () => ({
  createClient: () => Promise.resolve({
    auth: { getUser: getUserMock },
    from: fromMock,
  }),
}));

describe('Server Action: getMyShoppingRoomsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hauria de retornar buit si no hi ha usuari', async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });

    const result = await getMyShoppingRoomsAction();

    expect(result).toEqual([]);
  });

  it('hauria de filtrar per sales amb shopping activat', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-1' } } });

    const returnsMock = vi.fn().mockResolvedValue({
      data: [
        { room: { id: 'r1', name: 'Casa', enable_inventory: true, enable_shopping_list: true } },
        { room: { id: 'r2', name: 'Oficina', enable_inventory: true, enable_shopping_list: false } },
        { room: null },
      ],
      error: null,
    });
    const eqMock = vi.fn().mockReturnValue({ returns: returnsMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    fromMock.mockReturnValue({ select: selectMock });

    const result = await getMyShoppingRoomsAction();

    expect(result).toEqual([{ id: 'r1', name: 'Casa' }]);
  });
});
