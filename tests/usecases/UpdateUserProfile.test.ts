// tests/usecases/UpdateUserProfile.test.ts
import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import { UpdateUserProfile } from '@/core/usecases/profile/UpdateUserProfile';
import { UserProfileRepository } from '@/core/ports/UserProfileRepository';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

// Mock del repositori amb la interfície ACTUAL (UserProfileRepository)
const mockRepo = {
  getById: vi.fn(),        // Abans era findByUserId
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

    // Simulem perfil existent usant la nova classe UserProfile
    // Constructor: id, restrictions, preferences, tolerance
    const existingProfile = new UserProfile(
      userId,
      [],               // restrictions buides inicialment
      ['Pizza'],        // preferences
      1                 // socialTolerance
    );
    (mockRepo.getById as Mock).mockResolvedValue(existingProfile);

    // Dades noves (DTO d'entrada)
    // Nota: Assegura't que el teu UseCase accepta aquest format
    const input = {
      userId,
      foodPreferences: ['Sushi', 'Ramen'],
      socialTolerance: 8,
      exclusions: [DietaryRestriction.VEGAN], // Usem l'Enum o string segons la teva definició
      username: 'Goku',
      avatarEmoji: '🥕'
    };

    // 2. EXECUTE
    await useCase.execute(input);

    // 3. VERIFY
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    
    // Capturem l'argument per validar l'estat de l'entitat abans de guardar
    const savedProfile = (mockRepo.save as Mock).mock.calls[0][0] as UserProfile;

    expect(savedProfile.id).toBe(userId);
    expect(savedProfile.socialTolerance).toBe(8);
    expect(savedProfile.preferences).toEqual(['Sushi', 'Ramen']); // UserProfile fa servir 'preferences' o 'foodPreferences'
    
    // Validem invariants (DietaryRestriction)
    expect(savedProfile.restrictions).toContain(DietaryRestriction.VEGAN);
    
    // Validem els nous camps
    expect(savedProfile.username).toBe('Goku');
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
      exclusions: []
    });

    expect(mockRepo.save).toHaveBeenCalled();
    const savedProfile = (mockRepo.save as Mock).mock.calls[0][0] as UserProfile;
    
    expect(savedProfile.id).toBe(userId);
    // Verificar valors per defecte si cal
    expect(savedProfile.socialTolerance).toBe(5);
  });
});