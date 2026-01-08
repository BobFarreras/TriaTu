// src/core/usecases/profile/UpdateUserProfile.ts

// ✅ 1. Imports Nous
import { UserProfileRepository } from '@/core/ports/UserProfileRepository';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

type Input = {
  userId: string;
  foodPreferences: string[];
  socialTolerance: number;
  exclusions: string[];
  username?: string;
  avatarEmoji?: string;
};

export class UpdateUserProfile {
  // ✅ 2. Injectem el Repositori NOU
  constructor(private repository: UserProfileRepository) {}

  async execute(input: Input): Promise<void> {
    
    console.log('3️⃣ [USECASE] Input rebut:', input);

    // 3. Convertim strings a Enums (Seguretat de tipus)
    const restrictions = input.exclusions.map(ex => ex as DietaryRestriction);

    // 4. Creem l'Entitat NOVA
    // (Constructor: id, restrictions, preferences, tolerance)
    const profile = new UserProfile(
      input.userId,
      restrictions,
      input.foodPreferences,
      input.socialTolerance
    );

    // 5. Assignem els camps opcionals via Setters
    if (input.username) profile.setUsername(input.username);
    if (input.avatarEmoji) profile.setAvatar(input.avatarEmoji);

    console.log('4️⃣ [USECASE] Entitat creada i a punt de guardar:', profile);

    // 6. Guardem usant el repositori nou
    await this.repository.save(profile);
  }
}