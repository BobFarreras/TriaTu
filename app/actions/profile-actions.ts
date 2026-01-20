// src/app/actions/profile-actions.ts
'use server'

import { container } from '@/services/container';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { UpdateProfileSchema } from '@/core/application/schemas/inputSchemas';
import { debug, error as logError } from '@/lib/logger';

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
  debug('[ACTION] updateProfileAction start');

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      logError('updateProfileAction unauthorized');
      throw new Error('Unauthorized');
    }

    // 1. Dades del formulari
    const rawUsername = formData.get('username')?.toString().trim();
    const rawEmoji = formData.get('avatar_emoji')?.toString();
    const rawFood = formData.get('foodPreferences');
    const rawExclBase = formData.get('exclusions_base');
    const rawExclExtra = formData.get('exclusions_extra');
    const rawTolerance = formData.get('socialTolerance');

    const exclBase = splitAndTrim(rawExclBase);
    const exclExtra = splitAndTrim(rawExclExtra);
    const allExclusions = Array.from(new Set([...exclBase, ...exclExtra]));

    const foodPreferences = splitAndTrim(rawFood);
    const socialTolerance = Number(rawTolerance);

    // 2. Validacio Zod
    const validation = UpdateProfileSchema.safeParse({
      userId: user.id,
      username: rawUsername,
      avatarEmoji: rawEmoji,
      foodPreferences: foodPreferences,
      exclusions: allExclusions,
      socialTolerance: isNaN(socialTolerance) ? 0 : socialTolerance
    });

    if (!validation.success) {
      logError('updateProfileAction validation failed', validation.error.format());
      return { success: false, error: validation.error.issues[0].message };
    }

    const data = validation.data;
    debug('[ACTION] updateProfileAction execute');

    // 3. Executar Use Case
    const useCase = container.getUpdateUserProfile();

    await useCase.execute({
      userId: data.userId,
      username: data.username,
      avatarEmoji: data.avatarEmoji || undefined,
      foodPreferences: data.foodPreferences,
      socialTolerance: data.socialTolerance,
      exclusions: data.exclusions
    });

    debug('[ACTION] updateProfileAction success');

    // 4. Revalidacions
    revalidatePath('/profile');
    revalidatePath('/ranking');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: unknown) {
    logError('updateProfileAction failed', error);
    const message = error instanceof Error ? error.message : 'Error updating profile';
    return { success: false, error: message };
  }
}
