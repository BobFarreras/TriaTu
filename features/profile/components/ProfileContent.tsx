// src/features/profile/components/ProfileContent.tsx
'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ProfileForm } from './ProfileFrom';
import { useEffect, useMemo } from 'react';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { BackButton } from '@/components/ui/BackButton';

export type ProfileData = {
  username?: string;
  avatarEmoji?: string;
  foodPreferences: string[];
  exclusions: string[];
  socialTolerance: number;
};

interface Props {
  initialData: ProfileData;
}

export function ProfileContent({ initialData }: Props) {
  const { t } = useLanguage();
  const { startTour } = useOnboarding();

  const steps: TourStep[] = useMemo(() => [
    { targetId: 'tour-profile-identity', title: t.onboarding.profile.step1_title, description: t.onboarding.profile.step1_desc },
    { targetId: 'tour-profile-food', title: t.onboarding.profile.step2_title, description: t.onboarding.profile.step2_desc },
    { targetId: 'tour-profile-exclusions', title: t.onboarding.profile.step3_title, description: t.onboarding.profile.step3_desc },
    { targetId: 'tour-profile-tolerance', title: t.onboarding.profile.step4_title, description: t.onboarding.profile.step4_desc },
    { targetId: 'tour-profile-save', title: t.onboarding.profile.step5_title, description: t.onboarding.profile.step5_desc }
  ], [t]);

  useEffect(() => {
    startTour('profile-setup', steps);
  }, [startTour, steps]);

  const displayAvatar = initialData.avatarEmoji || '👨‍🍳';
  const displayName = initialData.username || (t.profile?.title || 'El teu Perfil');

  return (
    // ✅ CANVI 1: 'min-h-screen' en lloc de 'h-dvh', i traiem 'overflow-hidden'
    <div className="min-h-screen w-full flex flex-col bg-[#131f24] bg-gamified-pattern selection:bg-purple-500 selection:text-white relative">

      {/* DECORACIÓ */}
      <div className="fixed top-[-20%] right-[-10%] w-125 h-125 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HEADER (Sticky perque es quedi a dalt al fer scroll) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-white/5 bg-[#131f24]/80">
        <div className="max-w-5xl mx-auto p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton/>
            <div>
              <h1 className="text-xl font-black text-white leading-none truncate max-w-50 md:max-w-md">{displayName}</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{t.profile?.title || 'CONFIGURACIÓ'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TourTrigger tourId="profile-setup" steps={steps} className="w-10 h-10 bg-zinc-800/80 border-zinc-700" />
            <div className="hidden md:flex w-12 h-12 bg-linear-to-tr from-indigo-500/20 to-purple-500/20 border border-white/10 rounded-2xl items-center justify-center text-2xl shadow-lg animate-[float_4s_ease-in-out_infinite]">
              {displayAvatar}
            </div>
          </div>
        </div>
      </header>

      {/* CONTINGUT (Sense overflow-y-auto, deixem que el body faci scroll) */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 pb-32">
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <ProfileForm initialData={initialData} />
        </div>
      </div>
    </div>
  );
}
