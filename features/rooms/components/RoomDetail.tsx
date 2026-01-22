'use client';

import { startTransition, useState } from 'react';
import { useRealtimeRoom } from '../hooks/useRealtimeRoom';
import { kickParticipantAction } from '@/app/actions/room-actions';
import { DecisionControls, CandidateDTO } from './DecisionControls';
import { RoomHeader } from './RoomHeader';
import { HistoryList } from './HistoryList';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { useRoomTour } from '../hooks/useRoomTour';
import { useRoomSimulation } from '@/features/rooms/hooks/useRoomSimulation';
import { HistoryItem } from '../logic/history-types';
import { RoomSettingsDrawer } from './RoomSettingsDrawer';
import { useRoomFeatures } from '../hooks/useRoomFeatures'; // ✅ Importem el nou hook

// ------ TYPES ------
interface ModeToggleProps {
  mode: 'magic' | 'manual';
  setMode: (mode: 'magic' | 'manual') => void;
  t: { room: { mode_auto: string; mode_manual: string } };
}

export type RoomDTO = {
  id: string;
  name: string;
  inviteCode: string;
  hostUserId: string;
  participants: { userId: string }[];
  history: HistoryItem[];
  votingMode: 'BLIND' | 'PUBLIC';
  enableInventory: boolean;
  enableShoppingList: boolean;
};

interface RoomDetailProps {
  room: RoomDTO;
  initialCandidates: CandidateDTO[];
  currentUserId: string;
}

// ------ COMPONENT ------
export function RoomDetail({ room, currentUserId, initialCandidates }: RoomDetailProps) {
  useRealtimeRoom(room.id);
  const { t } = useLanguage();
  const isE2E = process.env.NEXT_PUBLIC_E2E === 'true';

  // State UI
  const [mode, setMode] = useState<'magic' | 'manual'>('manual');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isHost = room.hostUserId === currentUserId;

  // 1. Custom Hook per Features (Lògica extreta) ✅
  // ✅ 1. INICIALITZEM EL HOOK
  const { features, toggleFeature } = useRoomFeatures(
    room.id,
    room.enableInventory,
    room.enableShoppingList
  );
  // 2. Custom Hooks existents
  const { steps, isActive: isTourActive, currentStepIndex, nextStep } = useRoomTour();
  const simulation = useRoomSimulation(
    room, currentUserId, initialCandidates, isTourActive, currentStepIndex, nextStep
  );

  // 3. Actions Simples
  const handleKick = (userIdToKick: string) => {
    if (!confirm(t.room.kick_confirm)) return;
    startTransition(async () => {
      await kickParticipantAction(room.id, userIdToKick);
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
    <div className="max-w-6xl mx-auto pb-10 px-4 min-h-[calc(100vh-100px)] flex flex-col font-sans relative">

      <div id="tour-room-header">
        <RoomHeader
          roomName={room.name}
          roomId={room.id}
          hostUserId={room.hostUserId}
          participants={room.participants}
          currentUserId={currentUserId}
          onKick={handleKick}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onCopyCode={handleShare}
        />
      </div>

      <RoomSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        roomId={room.id}
        roomName={room.name}
        isHost={isHost}
        features={features} // Passem l'estat del hook
        onToggleFeature={toggleFeature} // Passem el handler del hook
        onCopyCode={handleShare}
        t={t}
      />

      {!isE2E && (
        <div className="fixed top-4 right-4 z-50">
          <TourTrigger tourId="room-guide" steps={steps} />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">
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
              candidates={simulation.displayCandidates}
              votingMode={room.votingMode}
              simulatedInputValue={simulation.simInput}
              isSimulatingLoading={simulation.isSimLoading}
              onSimulatedAdd={simulation.handlers.onSimulatedAdd}
            />
            {isTourActive && currentStepIndex === 4 && (
              <div onClick={simulation.handlers.onSimulatedDecide} className="absolute bottom-0 left-0 w-full h-24 z-50 cursor-pointer" />
            )}
          </div>
        </div>

        <div id="tour-room-history" className="lg:w-md w-full shrink-0 space-y-4 lg:sticky lg:top-4">
          <HistoryList history={simulation.displayHistory} />
        </div>
      </div>
    </div>
  );
}

// Subcomponent petit mantingut aquí per comoditat
function ModeToggle({ mode, setMode, t }: ModeToggleProps) {
  return (
    <>
      <button onClick={() => setMode('magic')} className={`px-5 py-2 rounded-full text-xs font-black transition-all duration-300 ${mode === 'magic' ? 'bg-zinc-800 shadow-lg text-purple-400 scale-105 ring-2 ring-purple-900' : 'text-gray-500 hover:text-gray-300'}`}>
        {t.room.mode_auto}
      </button>
      <button onClick={() => setMode('manual')} className={`px-5 py-2 rounded-full text-xs font-black transition-all duration-300 ${mode === 'manual' ? 'bg-zinc-800 shadow-lg text-blue-400 scale-105 ring-2 ring-blue-900' : 'text-gray-500 hover:text-gray-300'}`}>
        {t.room.mode_manual}
      </button>
    </>
  );
}