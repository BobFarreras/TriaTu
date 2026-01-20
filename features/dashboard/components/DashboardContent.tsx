'use client';

import { useEffect, useMemo } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { NavigationPanel } from './NavigationPanel';
import { QuickActionsPanel } from './QuickActionsPanel';
import { UserPreferencesSidebar } from './UserPreferencesSidebar';
import { MobileUserPreferences } from './MobileuserPreferences';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Props {
  userName: string;
  userId: string;
  userRooms: { id: string; name: string; isHost: boolean }[];
  profileData: {
    foodPreferences: string[];
    exclusions: string[];
  };
}

export function DashboardContent({ userName, userId, profileData }: Props) {
  const { t } = useLanguage();
  const { startTour } = useOnboarding();

  // El hook ja gestiona la hidratació
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const onboardingSteps: TourStep[] = useMemo(() => [
    {
      targetId: 'tour-dash-header',
      title: t.onboarding.dashboard.step1_title,
      description: t.onboarding.dashboard.step1_desc
    },
    {
      targetId: isDesktop ? 'tour-dash-prefs-desktop' : 'tour-dash-prefs-mobile',
      title: t.onboarding.dashboard.step2_title,
      description: t.onboarding.dashboard.step2_desc
    },
    {
      targetId: 'tour-dash-quick',
      title: t.onboarding.dashboard.step3_title,
      description: t.onboarding.dashboard.step3_desc
    },
    {
      targetId: 'tour-dash-nav',
      title: t.onboarding.dashboard.step4_title,
      description: t.onboarding.dashboard.step4_desc
    },
    {
      targetId: 'tour-dash-create',
      title: t.onboarding.dashboard.step5_title,
      description: t.onboarding.dashboard.step5_desc
    },
    {
      targetId: 'tour-dash-join',
      title: t.onboarding.dashboard.step6_title,
      description: t.onboarding.dashboard.step6_desc
    },
    { targetId: 'tour-dash-recipes', title: t.onboarding.dashboard.step7_title, description: t.onboarding.dashboard.step7_desc },
    { targetId: 'tour-dash-ranking', title: t.onboarding.dashboard.step8_title, description: t.onboarding.dashboard.step8_desc },
    { targetId: 'tour-dash-rooms', title: t.onboarding.dashboard.step9_title, description: t.onboarding.dashboard.step9_desc },
    { targetId: 'tour-dash-inventory', title: t.onboarding.dashboard.step10_title, description: t.onboarding.dashboard.step10_desc },
    { targetId: 'tour-dash-profile', title: t.onboarding.dashboard.step11_title, description: t.onboarding.dashboard.step11_desc }, 
  ], [t, isDesktop]);

  // INICI AUTOMÀTIC DEL TOUR
  useEffect(() => {
     if (typeof window !== 'undefined') {
        startTour('dashboard', onboardingSteps);
     }
  }, [startTour, onboardingSteps]);

  return (
    <main className="min-h-dvh lg:h-dvh w-full flex flex-col relative bg-[#131f24] bg-gamified-pattern overflow-y-auto lg:overflow-hidden">
        
      {/* ✅ MILLORA UX: POSICIONAMENT DEL TRIGGER */}
      <div className={`
          z-100 transition-all duration-500
          /* MÒBIL: Fixed a baix dreta (Tipus botó d'ajuda flotant) */
          fixed bottom-6 right-6
          /* ESCRIPTORI: Absolute a dalt dreta (Integrat al disseny) */
          lg:absolute lg:bottom-auto lg:top-6 lg:right-8
      `}>
        <TourTrigger 
            tourId="dashboard" 
            steps={onboardingSteps} 
            // Afegim ombra extra en mòbil perquè destaqui sobre el contingut
            className="shadow-2xl shadow-purple-900/50 lg:shadow-none"
        />
      </div>

      {/* FONS */}
      <div className="fixed top-[-20%] left-[-10%] w-150 h-150 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex-1 w-full max-w-350 mx-auto p-4 md:px-6 md:pb-6 flex flex-col min-h-0 relative z-10">

        <div id="tour-dash-header" className="shrink-0 pt-2 pb-2">
          <DashboardHeader userName={userName} />
        </div>

        {/* MÒBIL */}
        <div id="tour-dash-prefs-mobile" className="block lg:hidden mb-6 animate-in slide-in-from-top-4 fade-in duration-500">
          <MobileUserPreferences
            foodPreferences={profileData.foodPreferences}
            exclusions={profileData.exclusions}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:flex-1 lg:min-h-0">

          {/* ESCRIPTORI */}
          <div id="tour-dash-prefs-desktop" className="hidden lg:block lg:col-span-1 min-h-0 h-full">
            <div className="h-full bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm">
              <UserPreferencesSidebar
                foodPreferences={profileData.foodPreferences}
                exclusions={profileData.exclusions}
              />
            </div>
          </div>

          <div id="tour-dash-quick" className="lg:col-span-7 h-auto lg:h-full lg:min-h-0">
             <QuickActionsPanel userId={userId} />
          </div>

          <div className="lg:col-span-4 h-auto lg:h-full lg:min-h-0 pb-8 lg:pb-0">
            <NavigationPanel />
          </div>

        </div>
      </div>
    </main>
  );
}