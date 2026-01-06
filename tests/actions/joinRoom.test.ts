import { describe, it, expect, vi, beforeEach } from 'vitest';
import { joinRoomByCode } from '@/app/actions/joinRoom'; // Assegura't de la ruta
import { redirect } from 'next/navigation';



// 2. MOCK DE NEXT/NAVIGATION
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
}));

// 3. PREPAREM ELS ESPIES (MOCKS)
// Definim les funcions buides inicialment. Les configurarem a cada test.
const getUserMock = vi.fn();
const fromMock = vi.fn();

// 4. MOCK DEL MÒDUL SUPABASE
// Interceptem la creació del client i retornem el nostre objecte controlat.
vi.mock('@/adapters/supabase/server', () => ({
  createClient: () => Promise.resolve({
    auth: {
      getUser: getUserMock,
    },
    from: fromMock,
  }),
}));

describe('Server Action: joinRoomByCode', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('🔴 Hauria de retornar error si l\'usuari no està autenticat', async () => {
    // Configurar: getUser retorna null
    getUserMock.mockResolvedValue({ data: { user: null } });

    const result = await joinRoomByCode('codi-qualsevol');

    expect(result).toEqual({ error: 'unauthenticated' });
  });

  it('🔴 Hauria de retornar error si el codi d\'invitació no existeix', async () => {
    // Configurar: Usuari loguejat
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-1' } } });

    // Configurar: Cadena de Supabase per quan no troba la sala
    // from() -> select() -> eq() -> single()
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    
    // Quan cridem .from(), retornem l'objecte amb .select
    fromMock.mockReturnValue({ select: selectMock });

    const result = await joinRoomByCode('codi-inexistent');

    // Comprovem que l'error es propaga
    // Usem objectContaining per si l'objecte d'error té més propietats (missatge, etc)
    expect(result).toEqual(expect.objectContaining({ error: 'invalid_code' }));
  });

  it('🟢 Hauria de redirigir a la sala si tot és correcte', async () => {
    // --- DADES DE PROVA ---
    const fakeUser = { id: 'user-123' };
    const fakeRoom = { id: 'room-abc', name: 'Sopar', invite_code: 'XYZ123' };

    // --- CONFIGURACIÓ DELS MOCKS ---
    
    // 1. Auth OK
    getUserMock.mockResolvedValue({ data: { user: fakeUser } });

    // 2. Mock per a la consulta de la SALA (decision_rooms)
    // Cadena: select -> eq -> single
    const roomSingleMock = vi.fn().mockResolvedValue({ data: fakeRoom, error: null });
    const roomEqMock = vi.fn().mockReturnValue({ single: roomSingleMock });
    const roomSelectMock = vi.fn().mockReturnValue({ eq: roomEqMock });

    // 3. Mock per a la consulta de PARTICIPANTS (room_participants)
    // Cadena Select: select -> eq -> eq -> single (Comprova si ja existeix)
    const partSingleMock = vi.fn().mockResolvedValue({ data: null }); // Null = No hi és
    const partEq2Mock = vi.fn().mockReturnValue({ single: partSingleMock });
    const partEq1Mock = vi.fn().mockReturnValue({ eq: partEq2Mock });
    const partSelectMock = vi.fn().mockReturnValue({ eq: partEq1Mock });

    // Cadena Insert: insert -> Promise
    const partInsertMock = vi.fn().mockResolvedValue({ error: null });

    // 4. Implementació intel·ligent de .from(table)
    // Aquí decidim quina cadena retornar segons la taula que demani el codi
    fromMock.mockImplementation((table: string) => {
      if (table === 'decision_rooms') {
        return { select: roomSelectMock };
      }
      if (table === 'room_participants') {
        return { 
          select: partSelectMock,
          insert: partInsertMock 
        };
      }
      return {}; // Fallback segur
    });

    // --- EXECUCIÓ ---
    await joinRoomByCode('XYZ123');

    // --- VERIFICACIONS ---
    
    // Verifiquem que s'ha intentat insertar l'usuari correcte a la sala correcta
    expect(partInsertMock).toHaveBeenCalledWith(expect.objectContaining({
        room_id: fakeRoom.id,
        user_id: fakeUser.id
    }));

    // Verifiquem que finalment redirigeix
    expect(redirect).toHaveBeenCalledWith(`/rooms/${fakeRoom.id}`);
  });
});