import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MakeGroupDecision } from '@/core/usecases/rooms/MakeGroupDecision';
import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
// ❌ ELIMINAT: PreferenceRepository
import { CandidateRepository } from '@/core/ports/CandidateRepository';
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { UserProfileRepository } from '@/core/ports/UserProfileRepository'; 
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
// ❌ ELIMINAT: PreferenceProfile
// ✅ NOU: Importem UserProfile perquè ara és qui té les preferències
import { UserProfile } from '@/core/domain/entities/UserProfile'; 
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

describe('MakeGroupDecision UseCase', () => {
  let useCase: MakeGroupDecision;
  let mockRoomRepo: DecisionRoomRepository;
  // let mockPrefRepo: PreferenceRepository; // ❌ FORA
  let mockCandidateRepo: CandidateRepository;
  let mockResolver: GroupDecisionResolver;
  let mockUserRepo: UserProfileRepository; 

  beforeEach(() => {
    mockRoomRepo = {
      findById: vi.fn(),
      saveDecision: vi.fn(),
      save: vi.fn(),
      removeParticipant: vi.fn(),
      clearHistory: vi.fn(),
      setVotingMode: vi.fn()
    } as unknown as DecisionRoomRepository;

    // mockPrefRepo... // ❌ FORA

    mockCandidateRepo = {
      add: vi.fn(),
      getAllForRoom: vi.fn(),
      deleteAllForRoom: vi.fn(),
    } as unknown as CandidateRepository; // Afegit cast per seguretat

    mockResolver = {
      resolve: vi.fn(),
    };

    mockUserRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      getProfilesByIds: vi.fn(), 
    } as unknown as UserProfileRepository;

    useCase = new MakeGroupDecision(
      mockRoomRepo,
      // mockPrefRepo, // ❌ JA NO ES PASSA
      mockUserRepo,   // ✅ ARA PASSEM EL USER REPO (que substitueix al de preferències)
      mockCandidateRepo,
      mockResolver
    );
  });

  it('should make a decision and add it to history without closing room', async () => {
    // ARRANGE
    const mockRoom = {
      id: 'room-1',
      hostUserId: 'host-1',
      name: 'Test Room',
      participants: [{ userId: 'user-1', joinedAt: new Date() }],
      history: [],
      addDecision: vi.fn((outcome) => {
         mockRoom.history.push(outcome); 
      }),
      votingMode: 'BLIND'
    } as unknown as DecisionRoom;

    vi.mocked(mockRoomRepo.findById).mockResolvedValue(mockRoom);

    // ✅ ARA CREEM UN USER PROFILE (que conté les preferències)
    // En lloc de PreferenceProfile, ara tot està unificat aquí
    const mockUser = { 
        id: 'user-1',
        name: 'Pepito',
        emoji: '😎',
        // Les preferències ara viuen aquí:
        foodPreferences: ['Pizza'],
        socialTolerance: 5,
        restrictions: []
    } as unknown as UserProfile;

    // ✅ Mockegem la crida al repositori d'usuaris
    vi.mocked(mockUserRepo.getProfilesByIds).mockResolvedValue([mockUser]);

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
    expect(mockUserRepo.getProfilesByIds).toHaveBeenCalled(); 
    expect(mockRoomRepo.saveDecision).toHaveBeenCalledWith('room-1', mockOutcome);
  });
});