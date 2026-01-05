import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetDecisionRoom } from '@/core/usecases/rooms/GetDecisionRoom';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { UnauthorizedAccessError, ResourceNotFoundError } from '@/core/domain/errors/DomainErrors';
import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';

describe('Use Case: GetDecisionRoom', () => {
  let mockRepo: DecisionRoomRepository;
  let useCase: GetDecisionRoom;

  // Dades de prova (UUIDs reals)
  const ROOM_ID = '123e4567-e89b-12d3-a456-426614174000';
  const HOST_ID = '123e4567-e89b-12d3-a456-426614174001';
  const PARTICIPANT_ID = '123e4567-e89b-12d3-a456-426614174002';
  const STRANGER_ID = '123e4567-e89b-12d3-a456-426614174003';

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
      findByParticipantId: vi.fn(),
      setVotingMode: vi.fn(),
      removeParticipant: vi.fn(),
      clearHistory: vi.fn(),
      addParticipant: vi.fn(),
      saveDecision: vi.fn()
    } as unknown as DecisionRoomRepository;

    useCase = new GetDecisionRoom(mockRepo);
  });

  it('hauria de retornar la sala si l\'usuari és el HOST', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(mockRoom);
    const result = await useCase.execute(ROOM_ID, HOST_ID);
    expect(result).toBe(mockRoom);
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
    await expect(useCase.execute('123e4567-e89b-12d3-a456-000000000000', HOST_ID))
      .rejects
      .toThrow(ResourceNotFoundError);
  });
});