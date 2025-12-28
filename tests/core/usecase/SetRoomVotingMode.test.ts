import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SetRoomVotingMode } from '@/core/usecases/rooms/SetRoomVotingMode';
import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';

describe('SetRoomVotingMode UseCase', () => {
  let useCase: SetRoomVotingMode;
  let mockRepo: DecisionRoomRepository;

  beforeEach(() => {
    // Mock del repositori
    mockRepo = {
      findById: vi.fn(),
      setVotingMode: vi.fn(),
      // Altres mètodes no necessaris pel test...
      save: vi.fn(),
      saveDecision: vi.fn(),
      removeParticipant: vi.fn(),
      clearHistory: vi.fn(),
    } as unknown as DecisionRoomRepository;

    useCase = new SetRoomVotingMode(mockRepo);
  });

  it('should allow HOST to change voting mode', async () => {
    // ARRANGE: Simulem una sala on l'usuari 'host-1' és el propietari
    const mockRoom = { id: 'room-1', hostUserId: 'host-1' } as DecisionRoom;
    vi.mocked(mockRepo.findById).mockResolvedValue(mockRoom);

    // ACT: El host intenta canviar a BLIND
    await useCase.execute('host-1', 'room-1', 'BLIND');

    // ASSERT: S'ha de cridar al repositori
    expect(mockRepo.setVotingMode).toHaveBeenCalledWith('room-1', 'BLIND');
  });

  it('should PREVENT non-host from changing voting mode', async () => {
    // ARRANGE: El host és 'host-1', però qui ho demana és 'user-2'
    const mockRoom = { id: 'room-1', hostUserId: 'host-1' } as DecisionRoom;
    vi.mocked(mockRepo.findById).mockResolvedValue(mockRoom);

    // ACT & ASSERT: Ha de petar
    await expect(useCase.execute('user-2', 'room-1', 'PUBLIC'))
      .rejects.toThrow('Only the host can change the voting mode');
    
    // Assegurem que NO s'ha canviat res
    expect(mockRepo.setVotingMode).not.toHaveBeenCalled();
  });
});