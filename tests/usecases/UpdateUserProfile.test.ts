import { describe, it, expect, vi, type Mock } from 'vitest';
import { UpdateUserProfile } from '@/core/usecases/profile/UpdateUserProfile';
import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';

// Mock del repositori
const mockRepo = {
  findByUserId: vi.fn(),
  save: vi.fn()
} as unknown as PreferenceRepository;

describe('UpdateUserProfile UseCase', () => {
  it('should update an existing profile with new values', async () => {
    // 1. SETUP
    const useCase = new UpdateUserProfile(mockRepo);
    const userId = 'user-123';

    // Simulem perfil existent
    const existingProfile = new PreferenceProfile({
      id: userId,
      foodPreferences: ['Pizza'],
      socialTolerance: 1,
      exclusions: []
    });
    (mockRepo.findByUserId as Mock).mockResolvedValue(existingProfile);

    // Dades noves
    const input = {
      userId,
      foodPreferences: ['Sushi', 'Ramen'],
      socialTolerance: 8,
      exclusions: ['Cilantro']
    };

    // 2. EXECUTE
    await useCase.execute(input);

    // 3. VERIFY
    // Verifiquem que s'ha cridat a save amb les dades fusionades/actualitzades
    expect(mockRepo.save).toHaveBeenCalled();
    const savedProfile = (mockRepo.save as Mock).mock.calls[0][0] as PreferenceProfile;

    expect(savedProfile.id).toBe(userId);
    expect(savedProfile.socialTolerance).toBe(8);
    expect(savedProfile.foodPreferences).toEqual(['Sushi', 'Ramen']);
    // CORRECCIÓ: Esperem 'cilantro' en minúscules
    // L'entitat normalitza automàticament per evitar duplicats per majúscules/minúscules
    expect(savedProfile['exclusions']).toContain('cilantro');
  });

  it('should create a profile if it does not exist (robustness)', async () => {
    const useCase = new UpdateUserProfile(mockRepo);
    const userId = 'new-user';
    (mockRepo.findByUserId as Mock).mockResolvedValue(null);

    await useCase.execute({
      userId,
      foodPreferences: ['Pasta'],
      socialTolerance: 5,
      exclusions: []
    });

    expect(mockRepo.save).toHaveBeenCalled();
  });
});