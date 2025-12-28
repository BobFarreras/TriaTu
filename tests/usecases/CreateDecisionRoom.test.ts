// tests/usecases/CreateDecisionRoom.test.ts
import { describe, it, expect, vi, type Mock } from 'vitest';
import { CreateDecisionRoom } from '@/core/usecases/rooms/CreateDecisionRoom';
import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';

// Definim el mock explícitament
const mockRepo = {
  save: vi.fn(),
  findById: vi.fn()
} as unknown as DecisionRoomRepository;

describe('CreateDecisionRoom UseCase', () => {
  it('should create a room, save it and return the id', async () => {
    // 1. Setup
    const useCase = new CreateDecisionRoom(mockRepo);
    const hostId = 'user-123';
    const roomName = 'Dinar Equip';

    // 2. Execute
    const roomId = await useCase.execute({ hostUserId: hostId, name: roomName });

    // 3. Verify
    expect(roomId).toBeDefined();
    expect(typeof roomId).toBe('string');
    
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    
    // CORRECCIÓ: Tipem el mock per accedir a les crides sense 'any'
    const saveMock = mockRepo.save as Mock;
    const savedRoom = saveMock.mock.calls[0][0] as DecisionRoom;

    expect(savedRoom.hostUserId).toBe(hostId);
    expect(savedRoom.name).toBe(roomName);
    expect(savedRoom.id).toBe(roomId);
  });
});