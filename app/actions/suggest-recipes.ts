'use server';

import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export async function getRecipeSuggestionsAction(userId: string, energy: number, time: number) {
  try {
    const supabase = await createClient();
    
    // 1. OBTENIR PERFIL (Llegim 'exclusions' i 'food_preferences')
    // Nota: Segons el teu JSON, el camp ID potser es diu 'user_id' a la taula,
    // però normalment a Supabase es fa servir 'id' com a PK. Si falla, prova .eq('user_id', userId)
    const { data: profile, error } = await supabase
        .from('preference_profiles') // Assegura't que la taula es diu 'profiles'
        .select('*')
        .eq('user_id', userId) // Canviat a 'user_id' basat en el teu JSON
        .single();

    if (error) {
        console.error("❌ Error llegint perfil:", error.message);
    }

    // 2. MAPEJAR DADES (DB -> Domini)
    
    // A. EXCLUSIONS (Al·lèrgies)
    const rawExclusions = profile?.exclusions || [];
    
    // Fem un "casteig" pragmàtic. La IA entendrà "gluten" encara que no sigui exactament "GLUTEN_FREE".
    // L'important és que li arribi el text.
    const restrictions = Array.isArray(rawExclusions) 
        ? rawExclusions as DietaryRestriction[] 
        : [];

    // B. PREFERÈNCIES (Extra per al Xef!)
    const preferences = Array.isArray(profile?.food_preferences)
        ? profile.food_preferences.join(', ')
        : "";

    console.log(`🚀 [ACTION] Dades recuperades:`);
    console.log(`   - Exclusions: ${restrictions}`);
    console.log(`   - Preferències: ${preferences}`);

    // 3. EXECUTAR EL CAS D'ÚS
    const useCase = container.getSuggestRecipes(supabase); 
    
    // Nota: Si vols passar les preferències, hauríem de modificar el Cas d'Ús,
    // però de moment assegurem les restriccions que és el més crític.
    const recipes = await useCase.execute(userId, { energy, time }, restrictions);
    
    return { 
      success: true, 
      recipes: recipes.map(r => r.props) 
    };

  } catch (error) {
    console.error('Error getting suggestions:', error);
    return { 
      success: false, 
      error: "Error generant suggeriments." 
    };
  }
}