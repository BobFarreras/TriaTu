'use server'

import { container } from '@/services/container';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';

type ProfileState = {
  success?: boolean;
  error?: string;
};

export async function updateProfileAction(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // 1. DADES NOVES: Identitat
    const username = formData.get('username')?.toString().trim();
    const avatarEmoji = formData.get('avatar_emoji')?.toString();
    console.log('1️⃣ [ACTION] Dades rebudes del Form:', { username, avatarEmoji });
    // 2. Processar Menjar
    const foodString = formData.get('foodPreferences') as string;
    const foodPreferences = foodString.split(',').map(s => s.trim()).filter(Boolean);

    // 3. Processar Exclusions (FUSIÓ: Base + Extra)
    const exclBaseString = formData.get('exclusions_base') as string;
    const exclExtraString = formData.get('exclusions_extra') as string;

    const exclusionsBase = exclBaseString.split(',').map(s => s.trim()).filter(Boolean);
    const exclusionsExtra = exclExtraString ? exclExtraString.split(',').map(s => s.trim()).filter(Boolean) : [];

    const allExclusions = Array.from(new Set([...exclusionsBase, ...exclusionsExtra]));

    const tolerance = Number(formData.get('socialTolerance'));

    // 4. Executar Use Case (Ara li passem els nous camps)
    const useCase = container.getUpdateUserProfile();
    // 🚨 LOG 2: Què enviem al UseCase?
    console.log('2️⃣ [ACTION] Executant UseCase amb:', { 
        userId: user.id, 
        username, 
        avatarEmoji,
        foodPreferences 
    });
    
    await useCase.execute({
      userId: user.id,
      username,      // ✅ Nou
      avatarEmoji,   // ✅ Nou
      foodPreferences,
      socialTolerance: tolerance,
      exclusions: allExclusions
    });

    // 5. Revalidacions (Important pel Rànquing!)
    revalidatePath('/profile');
    revalidatePath('/ranking'); // ✅ Perquè el nom s'actualitzi a la llista
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating profile';
    return { success: false, error: message };
  }
}