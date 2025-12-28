import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';

export interface PreferenceRepository {
  findByUserId(userId: string): Promise<PreferenceProfile | null>;
  // AFEGIM AQUESTA LÍNIA:
  save(profile: PreferenceProfile): Promise<void>;
}