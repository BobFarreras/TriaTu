// tests/usecases/UpdateUserProfile.test.ts
import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import { UpdateUserProfile } from '@/core/usecases/profile/UpdateUserProfile';
import { UserProfileRepository } from '@/core/ports/UserProfileRepository';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// Mock del repositori basat en la nova interfície UserProfileRepository
const mockRepo = {
  getById: vi.fn(),
  getProfilesByIds: vi.fn(),
  save: vi.fn()
} as unknown as UserProfileRepository;

describe('UpdateUserProfile UseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update an existing profile with new values', async () => {
    // 1. SETUP
    const useCase = new UpdateUserProfile(mockRepo);
    const userId = 'user-123';

    // Simulem perfil existent (Entitat UserProfile)
    // Constructor: id, restrictions, preferences, tolerance
    const existingProfile = new UserProfile(
      userId,
      [], 
      ['Pizza'], 
      1
    );
    // Simulem que ja tenia nom (opcional segons la teva lògica)
    existingProfile.setUsername('OldName');

    (mockRepo.getById as Mock).mockResolvedValue(existingProfile);

    // Dades noves (Input DTO)
    const input = {
      userId,
      foodPreferences: ['Sushi', 'Ramen'],
      socialTolerance: 8,
      exclusions: [DietaryRestriction.VEGAN], // Ara usem l'Enum o string segons el teu DTO
      username: 'NewName',
      avatarEmoji: '🦊'
    };

    // 2. EXECUTE
    await useCase.execute(input);

    // 3. VERIFY
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    
    // Capturem l'argument per validar l'estat de l'entitat
    const savedProfile = (mockRepo.save as Mock).mock.calls[0][0] as UserProfile;

    expect(savedProfile.id).toBe(userId);
    expect(savedProfile.socialTolerance).toBe(8);
    expect(savedProfile.foodPreferences).toEqual(['Sushi', 'Ramen']);
    expect(savedProfile.restrictions).toContain(DietaryRestriction.VEGAN);
    
    // Validem els nous camps
    expect(savedProfile.username).toBe('NewName');
    expect(savedProfile.avatarEmoji).toBe('🦊');
  });

  it('should create a profile if it does not exist (robustness)', async () => {
    const useCase = new UpdateUserProfile(mockRepo);
    const userId = 'new-user';
    
    // Simulem que no existeix (retorna null)
    (mockRepo.getById as Mock).mockResolvedValue(null);

    await useCase.execute({
      userId,
      foodPreferences: ['Pasta'],
      socialTolerance: 5,
      exclusions: [],
      username: 'NewUser'
    });

    expect(mockRepo.save).toHaveBeenCalled();
    const savedProfile = (mockRepo.save as Mock).mock.calls[0][0] as UserProfile;
    expect(savedProfile.id).toBe(userId);
    expect(savedProfile.username).toBe('NewUser');
  });
});