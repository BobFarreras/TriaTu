import { createClient } from './server';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { UserProfileRepository } from '@/core/ports/UserProfileRepository';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';
import { debug, error as logError } from '@/lib/logger';

export class SupabaseUserProfileRepository implements UserProfileRepository {

  // 1. LLECTURA (Aquí és on tenies el problema segurament)
  async getById(userId: string): Promise<UserProfile | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('preference_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    // Mapeig d'Arrays
    const restrictions = (Array.isArray(data.exclusions) ? data.exclusions : [])
        .map((r: string) => r as DietaryRestriction);
    const preferences = Array.isArray(data.food_preferences) ? data.food_preferences : [];

    // Creem l'Entitat
    const profile = new UserProfile(
        data.user_id,
        restrictions,
        preferences,
        data.social_tolerance || 5
    );

    // 🚨🚨🚨 EL FIX CLAU ESTÀ AQUÍ 🚨🚨🚨
    // Si no fem els setters, l'entitat es queda amb el nom buit encara que a la DB hi sigui
    if (data.username) {
        profile.setUsername(data.username);
    }
    
    // Si a la DB és null, posem el default '👨‍🍳' si l'entitat no el té ja
    if (data.avatar_emoji) {
        profile.setAvatar(data.avatar_emoji);
    }

    return profile;
  }

  // 2. LLECTURA MÚLTIPLE (Per a la Room)
  async getProfilesByIds(userIds: string[]): Promise<UserProfile[]> {
    if (userIds.length === 0) return [];

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('preference_profiles')
      .select('*')
      .in('user_id', userIds);

    if (error) {
      console.error("Error fetching profiles:", error);
      return []; 
    }

    return (data || []).map(row => {
        const restrictions = (Array.isArray(row.exclusions) ? row.exclusions : [])
            .map((r: string) => r as DietaryRestriction);
        const preferences = Array.isArray(row.food_preferences) ? row.food_preferences : [];

        const p = new UserProfile(
            row.user_id,
            restrictions,
            preferences,
            row.social_tolerance || 5
        );
        
        // També aquí per si un cas l'algoritme necessita el nom en el futur
        if (row.username) p.setUsername(row.username);
        if (row.avatar_emoji) p.setAvatar(row.avatar_emoji);

        return p;
    });
  }

  // 3. ESCRIPTURA (Amb logs de confirmació)
  async save(profile: UserProfile): Promise<void> {
    const supabase = await createClient();

    const payload = {
        user_id: profile.id,
        exclusions: profile.restrictions, 
        food_preferences: profile.preferences,
        social_tolerance: profile.socialTolerance,
        updated_at: new Date().toISOString(),
        // Assegurat que aquestes claus coincideixen EXACTAMENT amb la teva taula SQL
        username: profile.username, 
        avatar_emoji: profile.avatarEmoji
    };

    console.log('📡 [REPO SENDING] Payload cap a DB:', payload);

    const { data, error } = await supabase
      .from('preference_profiles')
      .upsert(payload, { onConflict: 'user_id' })
      .select(); // Demanem retorn per confirmar

    if (error) {
        console.error('⛔ [DB ERROR] Error al save:', error);
        throw new Error(error.message);
    }
    
    console.log('✅ [DB CONFIRM] Dades persistides:', data);
  }
}