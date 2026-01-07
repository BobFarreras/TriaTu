// =================== FILE: src/adapters/supabase/SupabaseUserProfileRepository.ts ===================

import { createClient } from './server';
import { UserProfile } from '@/core/domain/entities/UserProfile';
// Importa el teu Enum!
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction'; 

export class SupabaseUserProfileRepository {
  
  async getProfilesByIds(userIds: string[]): Promise<UserProfile[]> {
    if (userIds.length === 0) return [];

    const supabase = await createClient();
    
    // Query directa a la teva taula existent
    const { data, error } = await supabase
      .from('preference_profiles')
      .select('user_id, food_preferences, exclusions') // 'exclusions' maparà a restrictions
      .in('user_id', userIds);

    if (error) {
      console.error("Error fetching profiles:", error);
      return []; // Fail safe: retornem buit, el mode auto treballarà sense dades
    }

    return data.map(row => {
        // Mapeig segur de strings (DB) a Enum (Domini)
        // Assumim que a la DB guardes strings que coincideixen amb l'Enum o fem un cast segur
        const dbRestrictions = (Array.isArray(row.exclusions) ? row.exclusions : []) as string[];
        
        // Convertim strings de la DB al teu Enum
        const restrictions: DietaryRestriction[] = dbRestrictions
            .map(r => r as DietaryRestriction) // ⚠️ Assegura't que els valors de DB coincideixen amb l'Enum
            .filter(r => Object.values(DietaryRestriction).includes(r));

        const prefs = Array.isArray(row.food_preferences) ? row.food_preferences : [];

        return new UserProfile(
            row.user_id,
            restrictions,
            prefs
        );
    });
  }
}