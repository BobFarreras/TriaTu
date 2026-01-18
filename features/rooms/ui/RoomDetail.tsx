// src/components/room/RoomDetail.tsx
'use client';

import { startTransition, useState } from 'react';

import { useRealtimeRoom } from '../hooks/useRealtimeRoom';
import { kickParticipantAction } from '@/app/actions/room-actions';
import { DecisionControls, CandidateDTO } from './DecisionControls';
import { RoomHeader } from './RoomHeader';
import { HistoryList } from './HistoryList';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { useRoomTour } from './components/useRoomTour';
import { useRoomSimulation } from '@/features/rooms/hooks/useRoomSimulation'; // <--- NOU HOOK
import { HistoryItem } from './history/types';

export type RoomDTO = {
  id: string;
  name: string;
  inviteCode: string;
  hostUserId: string;
  participants: { userId: string }[];
  history: HistoryItem[];
  votingMode: 'BLIND' | 'PUBLIC';
};

interface RoomDetailProps {
  room: RoomDTO;
  initialCandidates: CandidateDTO[];
  currentUserId: string;
}

export function RoomDetail({ room, currentUserId, initialCandidates }: RoomDetailProps) {
  // 1. Infrastructure Hooks
  useRealtimeRoom(room.id);
  
  const { t } = useLanguage();
 

  // 2. Local UI State
  const [mode, setMode] = useState<'magic' | 'manual'>('manual');
  const isHost = room.hostUserId === currentUserId;

  // 3. Tour Logic (Extracted)
  const { steps, isActive: isTourActive, currentStepIndex, nextStep } = useRoomTour();

  const simulation = useRoomSimulation(
    room,
    currentUserId,
    initialCandidates,
    isTourActive,
    currentStepIndex,
    nextStep
  );

  // 4. Action Handlers (Controller Logic)
  const handleKick = (userIdToKick: string) => {
    if (!confirm(t.room.kick_confirm)) return;
    startTransition(async () => {
      const res = await kickParticipantAction(room.id, userIdToKick);
      if (!res.success) alert(res.error || t.room.err_kick);
    });
  };



  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/invite/${room.inviteCode}`;
    if (navigator.share) {
      try { await navigator.share({ title: room.name, url: shareUrl }); return; }
      catch (err) { console.log(err); }
    }
    await navigator.clipboard.writeText(shareUrl);
    alert('✅ Enllaç copiat!');
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4 min-h-[calc(100vh-100px)] flex flex-col font-sans">

      {/* HEADER */}
      <div id="tour-room-header">
        <RoomHeader
          roomName={room.name}
          roomId={room.id}
          hostUserId={room.hostUserId}
          participants={room.participants}
          currentUserId={currentUserId}
          onKick={handleKick}
          onCopyCode={handleShare}
        />
      </div>

      {/* TOUR TRIGGER */}
      <div className="fixed top-4 right-4 z-50">
        <TourTrigger tourId="room-guide" steps={steps} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">

        {/* ZONA CENTRAL (DECISION CONTROLS) */}
        <div className="flex-1 w-full bg-zinc-900/90 backdrop-blur-xl rounded-[2.5rem] border-[6px] border-zinc-800 shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-500 z-10">

          <div id="tour-room-mode" className="absolute top-5 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md rounded-full p-1.5 flex shadow-inner border border-zinc-700">
            <ModeToggle mode={mode} setMode={setMode} t={t} />
          </div>

          <div id="tour-room-controls" className="flex-1 p-4 pt-20 md:p-8 md:pt-24">
            <DecisionControls
              roomId={room.id}
              userId={currentUserId}
              isHost={isHost}
              mode={mode}
              candidates={simulation.displayCandidates} // Usant dades de simulació o reals
              votingMode={room.votingMode}

              // Props de simulació netes
              simulatedInputValue={simulation.simInput}
              isSimulatingLoading={simulation.isSimLoading}
              onSimulatedAdd={simulation.handlers.onSimulatedAdd}
            />

            {/* INTERCEPTOR PER AL TOUR */}
            {isTourActive && currentStepIndex === 4 && (
              <div
                onClick={simulation.handlers.onSimulatedDecide}
                className="absolute bottom-0 left-0 w-full h-24 z-50 cursor-pointer"
              ></div>
            )}
          </div>
        </div>

        {/* SIDEBAR DRET (HISTORY) */}
        <div id="tour-room-history" className="lg:w-md w-full shrink-0 space-y-4 lg:sticky lg:top-4">
          <HistoryList history={simulation.displayHistory} />

          {/* Opcional: Pots posar un petit text informatiu */}
          <p className="text-center text-[10px] text-zinc-600 font-medium uppercase tracking-widest opacity-50">
            Es guarden les darreres 10 decisions
          </p>
        </div>

      </div>
    </div >
  );
}

// Definim els tipus exactes que necessita el component
interface ModeToggleProps {
  mode: 'magic' | 'manual';
  setMode: (mode: 'magic' | 'manual') => void;
  // Tipem 't' estructuralment només amb el que usem (Duck Typing)
  // Això permet passar l'objecte 't' sencer sense haver d'importar tipus complexos de traducció
  t: {
    room: {
      mode_auto: string;
      mode_manual: string;
    };
  };
}

function ModeToggle({ mode, setMode, t }: ModeToggleProps) {
  return (
    <>
      <button
        onClick={() => setMode('magic')}
        className={`px-5 py-2 rounded-full text-xs font-black transition-all duration-300 ${mode === 'magic' ? 'bg-zinc-800 shadow-lg text-purple-400 scale-105 ring-2 ring-purple-900' : 'text-gray-500 hover:text-gray-300'}`}
      >
        {t.room.mode_auto}
      </button>
      <button
        onClick={() => setMode('manual')}
        className={`px-5 py-2 rounded-full text-xs font-black transition-all duration-300 ${mode === 'manual' ? 'bg-zinc-800 shadow-lg text-blue-400 scale-105 ring-2 ring-blue-900' : 'text-gray-500 hover:text-gray-300'}`}
      >
        {t.room.mode_manual}
      </button>
    </>
  );
}