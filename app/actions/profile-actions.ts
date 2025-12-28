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

    // 1. Processar Menjar
    const foodString = formData.get('foodPreferences') as string;
    const foodPreferences = foodString.split(',').map(s => s.trim()).filter(Boolean);

    // 2. Processar Exclusions (FUSIÓ: Base + Extra)
    const exclBaseString = formData.get('exclusions_base') as string;
    const exclExtraString = formData.get('exclusions_extra') as string; // Ve del TagInput

    const exclusionsBase = exclBaseString.split(',').map(s => s.trim()).filter(Boolean);
    const exclusionsExtra = exclExtraString ? exclExtraString.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    // Ajuntem tot i eliminem duplicats
    const allExclusions = Array.from(new Set([...exclusionsBase, ...exclusionsExtra]));

    const tolerance = Number(formData.get('socialTolerance'));

    const useCase = container.getUpdateUserProfile();
    await useCase.execute({
      userId: user.id,
      foodPreferences,
      socialTolerance: tolerance,
      exclusions: allExclusions
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating profile';
    return { success: false, error: message };
  }
}