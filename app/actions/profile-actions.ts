'use server'

import { container } from '@/services/container';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { UpdateProfileSchema } from '@/core/application/schemas/inputSchemas'; // ✅ Import

type ProfileState = {
  success?: boolean;
  error?: string;
};

// Helper per netejar arrays de strings buits
const splitAndTrim = (str: unknown): string[] => {
    if (typeof str !== 'string') return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
};

export async function updateProfileAction(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // 1. PREPARAR DADES (Extracció)
    const rawUsername = formData.get('username')?.toString().trim();
    const rawEmoji = formData.get('avatar_emoji')?.toString();
    const rawFood = formData.get('foodPreferences');
    
    // Processar Exclusions (Base + Extra)
    const exclBase = splitAndTrim(formData.get('exclusions_base'));
    const exclExtra = splitAndTrim(formData.get('exclusions_extra'));
    const allExclusions = Array.from(new Set([...exclBase, ...exclExtra]));

    const foodPreferences = splitAndTrim(rawFood);
    const socialTolerance = Number(formData.get('socialTolerance'));

    // 2. 🛡️ VALIDACIÓ ZOD
    // Construïm l'objecte complet i el passem pel filtre de seguretat
    const validation = UpdateProfileSchema.safeParse({
        userId: user.id,
        username: rawUsername,
        avatarEmoji: rawEmoji,
        foodPreferences: foodPreferences,
        exclusions: allExclusions,
        socialTolerance: isNaN(socialTolerance) ? 0 : socialTolerance // Protecció contra NaN
    });

    if (!validation.success) {
        // Retornem el primer error de validació
        return { success: false, error: validation.error.issues[0].message };
    }

    // 3. DADES NETES
    const data = validation.data;

    console.log('2️⃣ [ACTION] Executant UseCase amb dades validades:', { userId: data.userId });
    
    // 4. EXECUTAR USE CASE
    const useCase = container.getUpdateUserProfile();
    
    await useCase.execute({
      userId: data.userId,
      username: data.username,
      avatarEmoji: data.avatarEmoji || undefined, // undefined si és null/buit
      foodPreferences: data.foodPreferences,
      socialTolerance: data.socialTolerance,
      exclusions: data.exclusions
    });

    // 5. REVALIDACIONS
    revalidatePath('/profile');
    revalidatePath('/ranking');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating profile';
    return { success: false, error: message };
  }
}