// src/features/dashboard/ui/DashboardContent.tsx
'use client';

import { DashboardHeader } from './DashboardHeader';
import { NavigationPanel } from './NavigationPanel';
import { QuickActionsPanel } from './QuickActionsPanel';
import { UserPreferencesSidebar } from './UserPreferencesSidebar';
import { MobileUserPreferences } from './MobileuserPreferences';

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
  return (
    <main className="min-h-dvh lg:h-dvh w-full flex flex-col relative bg-[#131f24] bg-gamified-pattern overflow-y-auto lg:overflow-hidden">

      {/* DECORACIÓ DE FONS */}
      <div className="fixed top-[-20%] left-[-10%] w-150 h-150 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="flex-1 w-full max-w-350 mx-auto p-4 md:px-6 md:pb-6 flex flex-col min-h-0 relative z-10">
        
        {/* HEADER */}
        <div className="shrink-0 pt-2 pb-2">
            <DashboardHeader userName={userName} />
        </div>

        {/* MÒBIL: Preferències Horitzontals */}
        <div className="block lg:hidden mb-6 animate-in slide-in-from-top-4 fade-in duration-500">
             <MobileUserPreferences 
                foodPreferences={profileData.foodPreferences}
                exclusions={profileData.exclusions}
             />
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:flex-1 lg:min-h-0">

          {/* 1. SIDEBAR (Escriptori) */}
          <div className="hidden lg:block lg:col-span-1 min-h-0 h-full">
             <div className="h-full bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm">
                <UserPreferencesSidebar 
                  foodPreferences={profileData.foodPreferences}
                  exclusions={profileData.exclusions}
                />
             </div>
          </div>

          {/* 2. ACCIONS RÀPIDES (Responsive Intern) */}
          <div className="lg:col-span-7 h-auto lg:h-full lg:min-h-0">
             <QuickActionsPanel userId={userId} />
          </div>

          {/* 3. NAVEGACIÓ */}
          <div className="lg:col-span-4 h-auto lg:h-full lg:min-h-0 pb-8 lg:pb-0">
             <NavigationPanel />
          </div>

        </div>
      </div>
    </main>
  );
}