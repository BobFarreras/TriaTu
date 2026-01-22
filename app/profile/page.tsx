// src/app/profile/page.tsx

import { redirect } from 'next/navigation';
// ✅ 1. CANVI IMPORTANT: Importem el repositori nou
import { SupabaseUserProfileRepository } from '@/adapters/supabase/SupabaseUserProfileRepository';
import { ProfileContent } from '@/features/profile/components/ProfileContent';
import { getCurrentUser } from '@/lib/auth/session';

import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');

  // ✅ 2. Instanciem el nou repositori
  const repo = new SupabaseUserProfileRepository();
  
  // ✅ 3. Cridem al mètode correcte ('getById')
  // Això ens retorna una entitat 'UserProfile' (o null)
  const userProfile = await repo.getById(user.id);

  // ✅ 4. Mapegem l'Entitat de Domini a les dades que espera la UI
  const initialData = {
    username: userProfile?.username || '', 
    avatarEmoji: userProfile?.avatarEmoji || '👨‍🍳',
    // Fem servir els getters de l'entitat
    foodPreferences: userProfile?.foodPreferences || [],
    exclusions: userProfile?.restrictions || [], // 'restrictions' són les exclusions
    // Important: fem servir ?? per si és 0 (que és un valor vàlid)
    socialTolerance: userProfile?.socialTolerance ?? 5 
  };

  return (
    <OnboardingProvider>
      <OnboardingOverlay />
      <ProfileContent initialData={initialData} />
    </OnboardingProvider>
  );
}
