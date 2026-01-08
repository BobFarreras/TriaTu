// src/core/ports/UserProfileRepository.ts
import { UserProfile } from "../domain/entities/UserProfile";

export interface UserProfileRepository {
  // Recuperar un perfil per ID (per a pantalles individuals)
  getById(userId: string): Promise<UserProfile | null>;

  // Recuperar molts perfils (per a decisions grupals)
  getProfilesByIds(userIds: string[]): Promise<UserProfile[]>;

  // Guardar o actualitzar un perfil
  save(profile: UserProfile): Promise<void>;
}