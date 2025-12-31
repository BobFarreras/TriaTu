import { PreferenceRepository } from '@/core/ports/PreferenceRepository';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';
import { supabase } from './client';

// Helper per accedir a propietats privades sense 'any'
interface ProfileWithExclusions {
  exclusions: string[];
}

export class SupabasePreferenceRepository implements PreferenceRepository {

  async findByUserId(userId: string): Promise<PreferenceProfile | null> {
    const { data, error } = await supabase
      .from('preference_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    // 🚨 AQUÍ ESTÀ EL PROBLEMA:
    // Abans segurament no estaves mapejant 'username' i 'avatar_emoji'
    return new PreferenceProfile({
      id: data.user_id,

      // ✅ AFEGEIX AQUESTES DUES LÍNIES:
      username: data.username,           // De la DB (snake_case) al Domini
      avatarEmoji: data.avatar_emoji,    // De la DB (snake_case) al Domini

      foodPreferences: data.food_preferences || [],
      socialTolerance: data.social_tolerance,
      exclusions: data.exclusions || []
    });
  }

  // IMPLEMENTACIÓ DEL SAVE
  async save(profile: PreferenceProfile): Promise<void> {
    // Fem un cast segur per accedir a les exclusions (que són private/protected)
    // Això evita l'error de TypeScript sense usar 'any'
    const exclusions = (profile as unknown as ProfileWithExclusions).exclusions;

    const { error } = await supabase
      .from('preference_profiles')
      .upsert({
        user_id: profile.id,
        food_preferences: profile.foodPreferences,
        social_tolerance: profile.socialTolerance,
        exclusions: exclusions,
        username: profile.username,         // ✅ Nou camp SQL
        avatar_emoji: profile.avatarEmoji,  // ✅ Nou camp SQL (snake_case)
      });

    if (error) throw new Error(error.message);
  }
}