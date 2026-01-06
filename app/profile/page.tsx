// src/app/profile/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { SupabasePreferenceRepository } from '@/adapters/supabase/SupabasePreferenceRepository';
import { ProfileContent } from '@/features/profile/ui/ProfileContent';

// ✅ 1. IMPORTEM ELS COMPONENTS D'ONBOARDING
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';

interface ProfileDTO {
  username?: string;
  avatarEmoji?: string;
  foodPreferences?: string[];
  exclusions?: string[];
  socialTolerance?: number;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const repo = new SupabasePreferenceRepository();
  const rawProfile = await repo.findByUserId(user.id);

  // Casting segur
  const profile = rawProfile as unknown as ProfileDTO | null;

  const initialData = {
    username: profile?.username || '', 
    avatarEmoji: profile?.avatarEmoji || '👨‍🍳',
    foodPreferences: profile?.foodPreferences || [],
    exclusions: profile?.exclusions || [],
    socialTolerance: profile?.socialTolerance || 5
  };

  // ✅ 2. ENVOLTEM EL CONTINGUT AMB EL PROVIDER I AFEGIM L'OVERLAY
  return (
    <OnboardingProvider>
      {/* L'Overlay és el que pinta la capa fosca i les caixes de text */}
      <OnboardingOverlay />
      
      {/* El contingut de la pàgina ara ja té accés al context */}
      <ProfileContent initialData={initialData} />
    </OnboardingProvider>
  );
}