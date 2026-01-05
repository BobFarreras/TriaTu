// =================== FILE: src/tests/core/usecases/GetDecisionRoom.test.ts ===================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetDecisionRoom } from '@/core/usecases/rooms/GetDecisionRoom';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { UnauthorizedAccessError, ResourceNotFoundError } from '@/core/domain/errors/DomainErrors';
import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';

describe('Use Case: GetDecisionRoom', () => {
  let mockRepo: DecisionRoomRepository;
  let useCase: GetDecisionRoom;

  // Dades de prova
  const ROOM_ID = 'room-1';
  const HOST_ID = 'host-user';
  const PARTICIPANT_ID = 'participant-user';
  const STRANGER_ID = 'stranger-user';

  const mockRoom = new DecisionRoom({
    id: ROOM_ID,
    name: 'Sala de Prova',
    hostUserId: HOST_ID,
    participants: [
        { userId: HOST_ID, joinedAt: new Date() }, 
        { userId: PARTICIPANT_ID, joinedAt: new Date() }
    ],
    votingMode: 'BLIND',
    history: []
  });

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      save: vi.fn(),
      findByParticipantId: vi.fn() // Afegit per complir interfície
    } as unknown as DecisionRoomRepository;

    useCase = new GetDecisionRoom(mockRepo);
  });

  it('hauria de retornar la sala si l\'usuari és el HOST', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(mockRoom);
    
    const result = await useCase.execute(ROOM_ID, HOST_ID);
    
    expect(result).toBe(mockRoom);
    expect(mockRepo.findById).toHaveBeenCalledWith(ROOM_ID);
  });

  it('hauria de retornar la sala si l\'usuari és PARTICIPANT', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(mockRoom);
    
    const result = await useCase.execute(ROOM_ID, PARTICIPANT_ID);
    expect(result).toBe(mockRoom);
  });

  it('hauria de llançar UnauthorizedAccessError si l\'usuari NO està a la sala', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(mockRoom);
    
    await expect(useCase.execute(ROOM_ID, STRANGER_ID))
      .rejects
      .toThrow(UnauthorizedAccessError);
  });

  it('hauria de llançar ResourceNotFoundError si la sala no existeix', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(null);
    
    await expect(useCase.execute('id-inexistent', HOST_ID))
      .rejects
      .toThrow(ResourceNotFoundError);
  });
});