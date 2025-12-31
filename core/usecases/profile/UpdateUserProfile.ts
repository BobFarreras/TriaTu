import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';

type Input = {
  userId: string;
  foodPreferences: string[];
  socialTolerance: number;
  exclusions: string[];
  username?: string;
  avatarEmoji?: string;
};

export class UpdateUserProfile {
  constructor(private repository: PreferenceRepository) {}

  async execute(input: Input): Promise<void> {
    
    // 🚨 LOG 3: Dades dins del UseCase
    console.log('3️⃣ [USECASE] Input rebut:', input);

    const profile = new PreferenceProfile({
      id: input.userId,
      username: input.username,       // Està arribant aquí?
      avatarEmoji: input.avatarEmoji, // Està arribant aquí?
      foodPreferences: input.foodPreferences,
      socialTolerance: input.socialTolerance,
      exclusions: input.exclusions
    });

    // 🚨 LOG 4: L'Entitat creada té les dades?
    console.log('4️⃣ [USECASE] Entitat creada:', {
        id: profile.id,
        username: profile.username,
        avatar: profile.avatarEmoji
    });

    await this.repository.save(profile);
  }
}