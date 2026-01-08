// src/app/actions/profile-actions.ts
'use server'

import { container } from '@/services/container';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { UpdateProfileSchema } from '@/core/application/schemas/inputSchemas';

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
  console.log('🏁 [ACTION] updateProfileAction INITIATED');
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error('❌ [ACTION] No user found via supabase.auth');
        throw new Error('Unauthorized');
    }

    console.log('👤 [ACTION] User ID:', user.id);

    // 1. DADES DEL FORMULARI (LOGGING)
    const rawUsername = formData.get('username')?.toString().trim();
    const rawEmoji = formData.get('avatar_emoji')?.toString();
    const rawFood = formData.get('foodPreferences');
    const rawExclBase = formData.get('exclusions_base');
    const rawExclExtra = formData.get('exclusions_extra');
    const rawTolerance = formData.get('socialTolerance');

    console.log('📥 [ACTION] Raw Form Data:', {
        username: rawUsername,
        emoji: rawEmoji,
        food: rawFood,
        exclBase: rawExclBase,
        tolerance: rawTolerance
    });
    
    // Processar Exclusions
    const exclBase = splitAndTrim(rawExclBase);
    const exclExtra = splitAndTrim(rawExclExtra);
    const allExclusions = Array.from(new Set([...exclBase, ...exclExtra]));

    const foodPreferences = splitAndTrim(rawFood);
    const socialTolerance = Number(rawTolerance);

    // 2. VALIDACIÓ ZOD
    const validation = UpdateProfileSchema.safeParse({
        userId: user.id,
        username: rawUsername,
        avatarEmoji: rawEmoji,
        foodPreferences: foodPreferences,
        exclusions: allExclusions,
        socialTolerance: isNaN(socialTolerance) ? 0 : socialTolerance
    });

    if (!validation.success) {
        console.error('❌ [ACTION] Zod Validation Failed:', validation.error.format());
        return { success: false, error: validation.error.issues[0].message };
    }

    const data = validation.data;
    console.log('✅ [ACTION] Validation Passed. Executing UseCase...');
    
    // 3. EXECUTAR USE CASE
    const useCase = container.getUpdateUserProfile();
    
    await useCase.execute({
      userId: data.userId,
      username: data.username,
      avatarEmoji: data.avatarEmoji || undefined,
      foodPreferences: data.foodPreferences,
      socialTolerance: data.socialTolerance,
      exclusions: data.exclusions
    });

    console.log('🎉 [ACTION] UseCase Executed Successfully');

    // 4. REVALIDACIONS
    revalidatePath('/profile');
    revalidatePath('/ranking');
    revalidatePath('/dashboard');

    return { success: true };

  } catch (error: unknown) {
    console.error('💥 [ACTION CRITICAL ERROR]:', error);
    const message = error instanceof Error ? error.message : 'Error updating profile';
    return { success: false, error: message };
  }
}