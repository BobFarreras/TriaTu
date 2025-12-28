import { describe, it, expect, vi, type Mock } from 'vitest';
import { MakeGroupDecision } from '@/core/usecases/rooms/MakeGroupDecision'; // El nou UseCase
import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

// Mocks
const mockRoomRepo = { findById: vi.fn(), save: vi.fn(), saveDecision: vi.fn() } as unknown as DecisionRoomRepository;
const mockPrefRepo = { findByUserId: vi.fn() } as unknown as PreferenceRepository;
const mockResolver = { resolve: vi.fn() } as unknown as GroupDecisionResolver;

describe('MakeGroupDecision UseCase', () => {
  it('should make a decision and add it to history without closing room', async () => {
    // 1. SETUP
    const useCase = new MakeGroupDecision(mockRoomRepo, mockPrefRepo, mockResolver);
    const roomId = 'r1';
    const userId = 'user-1';
    
    const room = new DecisionRoom({ id: roomId, hostUserId: userId, name: 'Dinner' });
    (mockRoomRepo.findById as Mock).mockResolvedValue(room);
    
    (mockPrefRepo.findByUserId as Mock).mockResolvedValue(
        new PreferenceProfile({ id: userId, foodPreferences: [], socialTolerance: 5, exclusions: [] })
    );

    const expectedOutcome = new DecisionOutcome({ choice: 'Pizza', reason: 'Consensus' });
    (mockResolver.resolve as Mock).mockResolvedValue(expectedOutcome);

    // 2. EXECUTE
    const result = await useCase.execute({ roomId, requesterUserId: userId });

    // 3. VERIFY
    expect(result.choice).toBe('Pizza');
    
    // Verifiquem que s'ha afegit a l'historial de l'entitat
    expect(room.history).toHaveLength(1);
    expect(room.history[0]).toEqual(expectedOutcome);
    
    // Verifiquem que s'ha cridat al mètode específic de guardar decisió
    expect(mockRoomRepo.saveDecision).toHaveBeenCalledWith(roomId, expectedOutcome);
  });
});