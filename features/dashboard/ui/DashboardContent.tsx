'use client';

import { DashboardHeader } from './DashboardHeader';
import { NavigationPanel } from './NavigationPanel';
import { QuickActionsPanel } from './QuickActionsPanel';

interface Props {
  userName: string;
  userId: string;
  userRooms: { id: string; name: string; isHost: boolean }[];
}

export function DashboardContent({ userName, userId }: Props) {
  return (
    // CANVI 1: 'min-h-dvh' en lloc de 'h-dvh' per a mòbil. 'overflow-y-auto' permet l'scroll.
    // Només en pantalla gran (lg:) bloquegem l'alçada amb 'lg:h-dvh' i 'lg:overflow-hidden'.
    <main className="min-h-dvh lg:h-dvh w-full flex flex-col relative bg-[#131f24] bg-gamified-pattern overflow-y-auto lg:overflow-hidden">

      {/* DECORACIÓ */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:px-6 md:pb-6 flex flex-col min-h-0 relative z-10">
        
        {/* Header */}
        <div className="shrink-0 pt-2 pb-2">
            <DashboardHeader userName={userName} />
        </div>

        {/* CANVI 2: GRID */}
        {/* Mòbil: h-auto (s'adapta al contingut). Desktop: flex-1 (ocupa l'espai restant). */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:flex-1 lg:min-h-0">

          {/* ESQUERRA: PANELL RÀPID */}
          {/* Mòbil: min-h-[500px] per assegurar que es vegi sencer. Desktop: h-full */}
          <div className="lg:col-span-8 min-h-[500px] lg:min-h-0 lg:h-full">
             <QuickActionsPanel userId={userId} />
          </div>

          {/* DRETA: NAVEGACIÓ */}
          {/* Mòbil: Alçada automàtica. Desktop: h-full */}
          <div className="lg:col-span-4 h-auto lg:h-full lg:min-h-0 pb-8 lg:pb-0">
             <NavigationPanel />
          </div>

        </div>
      </div>
    </main>
  );
}