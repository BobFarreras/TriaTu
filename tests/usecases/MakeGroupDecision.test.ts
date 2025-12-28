import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MakeGroupDecision } from '@/core/usecases/rooms/MakeGroupDecision';
import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
import { CandidateRepository } from '@/core/ports/CandidateRepository';
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile'; // Import necessari
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

describe('MakeGroupDecision UseCase', () => {
  let useCase: MakeGroupDecision;
  let mockRoomRepo: DecisionRoomRepository;
  let mockPrefRepo: PreferenceRepository;
  let mockCandidateRepo: CandidateRepository;
  let mockResolver: GroupDecisionResolver;

  beforeEach(() => {
    mockRoomRepo = {
      findById: vi.fn(),
      saveDecision: vi.fn(),
      save: vi.fn(),
      removeParticipant: vi.fn(),
      clearHistory: vi.fn(),
      setVotingMode: vi.fn()
    } as unknown as DecisionRoomRepository;

    mockPrefRepo = {
      findByUserId: vi.fn(),
    } as unknown as PreferenceRepository;

    mockCandidateRepo = {
      add: vi.fn(),
      getAllForRoom: vi.fn(),
      deleteAllForRoom: vi.fn(),
    };

    mockResolver = {
      resolve: vi.fn(),
    };

    useCase = new MakeGroupDecision(
      mockRoomRepo,
      mockPrefRepo,
      mockCandidateRepo,
      mockResolver
    );
  });

  it('should make a decision and add it to history without closing room', async () => {
    // ARRANGE
    
    // 1. Creem un objecte que "sembla" una DecisionRoom, però és un objecte pla.
    // Això evita l'error de constructor i ens permet espiar el mètode 'addDecision'.
    const mockRoom = {
      id: 'room-1',
      hostUserId: 'host-1',
      name: 'Test Room',
      // Simulem l'estructura interna que espera el UseCase
      participants: [{ userId: 'user-1', joinedAt: new Date() }],
      history: [],
      // MOCK del mètode de l'entitat (Important!)
      addDecision: vi.fn((outcome) => {
         // Simulem el que fa el mètode real push al array
       
         mockRoom.history.push(outcome); 
      }),
      votingMode: 'BLIND'
    } as unknown as DecisionRoom; // <--- TRUC MÀGIC: Castegem a l'entitat

    vi.mocked(mockRoomRepo.findById).mockResolvedValue(mockRoom);

    // 2. Solució a l'error de 'any': Castegem primer a unknown i després al tipus correcte
    const mockProfile = { 
        userId: 'user-1',
        foodPreferences: ['Pizza'],
        socialTolerance: 5
    } as unknown as PreferenceProfile;

    vi.mocked(mockPrefRepo.findByUserId).mockResolvedValue(mockProfile);
    
    // Simulem una resolució
    const mockOutcome: DecisionOutcome = { 
        choice: 'Pizza', 
        reason: 'Yum', 
        generatedAt: new Date() 
    };
    vi.mocked(mockResolver.resolve).mockResolvedValue(mockOutcome);

    // ACT
    const result = await useCase.execute({
      roomId: 'room-1',
      requesterUserId: 'user-1',
      mode: 'magic'
    });

    // ASSERT
    expect(result).toEqual(mockOutcome);
    expect(mockResolver.resolve).toHaveBeenCalled();
    
    // Verifiquem que s'ha cridat al mètode de l'entitat
    expect(mockRoom.addDecision).toHaveBeenCalledWith(mockOutcome);
    
    // Verifiquem persistència
    expect(mockRoomRepo.saveDecision).toHaveBeenCalledWith('room-1', mockOutcome);
  });
});