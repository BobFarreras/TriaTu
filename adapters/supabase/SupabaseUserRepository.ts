import { createClient } from '@/adapters/supabase/server';
import { UserRepository } from '@/core/ports/UserRepository';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export class SupabaseUserRepository implements UserRepository {
  
  // Implementació del mètode que et falta
  async findById(userId: string): Promise<UserProfile | null> {
    const supabase = await createClient();

    try {
      // 1. Busquem a la taula 'profiles' (o com es digui a la teva BD)
      const { data, error } = await supabase
        .from('profiles') 
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.warn(`⚠️ [SupabaseUserRepository] No s'ha trobat perfil per ${userId}. Retornant perfil buit.`);
        // Retornem un perfil buit per no trencar l'app
        return new UserProfile(userId, [], []);
      }

      // 2. Mapegem les dades de la BD a la teva Entitat
      // Assegurem que dietary_restrictions és un array
      const rawRestrictions = Array.isArray(data.dietary_restrictions) 
        ? data.dietary_restrictions 
        : [];
      
      const rawPreferences = Array.isArray(data.preferences) 
        ? data.preferences 
        : [];

      // Convertim strings a Enums de manera segura
      const restrictions = rawRestrictions.map((r: string) => r as DietaryRestriction);

      return new UserProfile(
        data.id,
        restrictions,
        rawPreferences
      );

    } catch (e) {
      console.error("Error al SupabaseUserRepository:", e);
      return null;
    }
  }

  // ... (Aquí hi haurien d'haver els altres mètodes saveProfile, getProfile, etc. MANTEN-LOS)
  async getProfile(userId: string): Promise<UserProfile> {
      // Reutilitzem la lògica de dalt o la teva existent
      const profile = await this.findById(userId);
      if (!profile) throw new Error("User not found");
      return profile;
  }
  
  async saveProfile(profile: UserProfile): Promise<void> {
      const supabase = await createClient();
      
      await supabase.from('profiles').upsert({
          id: profile.id,
          dietary_restrictions: profile.restrictions, // Usem el getter
          preferences: profile.preferences,
          updated_at: new Date().toISOString()
      });
  }
}