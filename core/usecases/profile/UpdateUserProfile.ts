import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';

type Input = {
  userId: string;
  foodPreferences: string[];
  socialTolerance: number;
  exclusions: string[];
};

export class UpdateUserProfile {
  constructor(private readonly repo: PreferenceRepository) {}

  async execute(input: Input): Promise<void> {
    // 1. Recuperar perfil actual (o crear-ne un de nou)
    let profile = await this.repo.findByUserId(input.userId);

    if (!profile) {
      profile = new PreferenceProfile({
        id: input.userId,
        foodPreferences: input.foodPreferences,
        socialTolerance: input.socialTolerance,
        exclusions: input.exclusions
      });
    } else {
      // 2. Actualitzar propietats
      // Nota: Hauríem de tenir setters a l'entitat o crear-ne una de nova.
      // Per immutabilitat i simplicitat DDD, sovint és millor instanciar de nou amb les noves dades.
      profile = new PreferenceProfile({
        id: input.userId,
        foodPreferences: input.foodPreferences,
        socialTolerance: input.socialTolerance,
        exclusions: input.exclusions
      });
    }

    // 3. Persistir
    await this.repo.save(profile);
  }
}