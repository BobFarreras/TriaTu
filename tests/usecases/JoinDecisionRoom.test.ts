// tests/usecases/JoinDecisionRoom.test.ts
import { describe, it, expect, vi, type Mock } from 'vitest';
import { JoinDecisionRoom } from '@/core/usecases/rooms/JoinDecisionRoom';
import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';

const mockRepo = {
  findById: vi.fn(),
  addParticipant: vi.fn(),
  save: vi.fn(),
  saveDecision: vi.fn() 
} as unknown as DecisionRoomRepository;

describe('JoinDecisionRoom UseCase', () => {
  it('should add a user to an existing room', async () => {
    const useCase = new JoinDecisionRoom(mockRepo);
    const roomId = 'room-1';
    const hostId = 'host-1';
    const newUserId = 'new-user';

    const existingRoom = new DecisionRoom({ id: roomId, hostUserId: hostId, name: 'Lunch' });
    (mockRepo.findById as Mock).mockResolvedValue(existingRoom);

    await useCase.execute({ roomId, userId: newUserId });

    expect(existingRoom.participants.some(p => p.userId === newUserId)).toBe(true);
    expect(mockRepo.addParticipant).toHaveBeenCalledWith(roomId, newUserId);
  });

  it('should throw error if room does not exist', async () => {
    const useCase = new JoinDecisionRoom(mockRepo);
    (mockRepo.findById as Mock).mockResolvedValue(null);

    await expect(useCase.execute({ roomId: 'ghost', userId: 'u1' }))
      .rejects.toThrow(/Room not found/);
  });

  it('should succeed silently if user is already in room', async () => {
    const useCase = new JoinDecisionRoom(mockRepo);
    const roomId = 'room-1';
    const hostId = 'host-1';
    
    // El host ja hi és
    const existingRoom = new DecisionRoom({ id: roomId, hostUserId: hostId, name: 'Lunch' });
    (mockRepo.findById as Mock).mockResolvedValue(existingRoom);

    // Ara NO ha de fallar
    await expect(useCase.execute({ roomId, userId: hostId })).resolves.not.toThrow();
  });
});