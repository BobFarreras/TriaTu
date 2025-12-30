import { UserProfile } from '../domain/entities/UserProfile';

export interface UserRepository {
  getProfile(userId: string): Promise<UserProfile>;
  saveProfile(profile: UserProfile): Promise<void>;
  // Aquest és el mètode que et faltava:
  findById(userId: string): Promise<UserProfile | null>;
}