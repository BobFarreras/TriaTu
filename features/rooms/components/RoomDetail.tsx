'use client';

import { startTransition, useEffect, useState } from 'react';
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
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  participants: { userId: string; name?: string }[];
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
  const [areControlsCollapsed, setAreControlsCollapsed] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'decisions' | 'history'>('decisions');
  const isHost = room.hostUserId === currentUserId;

  // 1. Custom Hook per Features (Lògica extreta) ✅
  // ✅ 1. INICIALITZEM EL HOOK
  const { features, toggleFeature } = useRoomFeatures(
    room.id,
    room.enableInventory,
    room.enableShoppingList
  );
  // 2. Custom Hooks existents
  const { steps, isActive: isTourActive, currentStepIndex, nextStep } = useRoomTour({
    includeSettingsStep: isHost
  });
  const simulation = useRoomSimulation(
    room, currentUserId, initialCandidates, isTourActive, currentStepIndex, nextStep, steps
  );

  useEffect(() => {
    if (!isTourActive) return;
    const historyStepIndex = steps.findIndex((step) => step.targetId === 'tour-room-history');
    if (historyStepIndex !== -1 && currentStepIndex >= historyStepIndex) {
      setMobilePanel('history');
      return;
    }
    setMobilePanel('decisions');
  }, [currentStepIndex, isTourActive, steps]);

  useEffect(() => {
    if (!isTourActive) return;
    const settingsStepIndex = steps.findIndex((step) => step.targetId === 'tour-room-settings');
    if (settingsStepIndex === -1) return;
    if (currentStepIndex === settingsStepIndex) {
      setIsSettingsOpen(true);
      return;
    }
    setIsSettingsOpen(false);
  }, [currentStepIndex, isTourActive, steps]);

  useEffect(() => {
    if (isTourActive) return;
    if (typeof window === 'undefined') return;
    const key = `room-mobile-first-visit:${room.id}`;
    const hasVisited = window.localStorage.getItem(key);
    if (!hasVisited) {
      setMobilePanel('history');
      window.localStorage.setItem(key, '1');
    }
  }, [isTourActive, room.id]);

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
          headerActions={!isE2E ? <TourTrigger tourId="room-guide" steps={steps} /> : null}
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

      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">
        <div className="flex-1 w-full bg-zinc-900/90 backdrop-blur-xl rounded-[2.5rem] border-[6px] border-zinc-800 shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-500 z-10">
          <div className="flex-1 p-4 md:p-8 flex flex-col gap-4">
            <div id="tour-room-mode" className="bg-black/60 backdrop-blur-md rounded-full p-1.5 flex shadow-inner border border-zinc-700 self-center">
              <ModeToggle mode={mode} setMode={setMode} t={t} />
              <button
                type="button"
                onClick={() => setAreControlsCollapsed((prev) => !prev)}
                className="ml-2 h-8 w-8 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-gray-300 hover:bg-zinc-700 transition-colors"
                aria-expanded={!areControlsCollapsed}
                aria-label="Toggle controls"
              >
                {areControlsCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>

            {!areControlsCollapsed && (
              <>
                <div className="lg:hidden flex items-center justify-center gap-2 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-1">
                  <button
                    type="button"
                    onClick={() => setMobilePanel('decisions')}
                    className={`px-4 py-2 text-xs font-black rounded-xl transition-colors ${mobilePanel === 'decisions' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                    {t.room.decisions_tab}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobilePanel('history')}
                    className={`px-4 py-2 text-xs font-black rounded-xl transition-colors ${mobilePanel === 'history' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                    {t.room.history_tab}
                  </button>
                </div>

                <div id="tour-room-controls" className="flex-1">
                  <div className="lg:hidden">
                    {mobilePanel === 'history' ? (
                      <div id="tour-room-history">
                        <HistoryList history={simulation.displayHistory} />
                      </div>
                    ) : (
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
                    )}
                  </div>
                  <div className="hidden lg:block">
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
                  </div>
                {isTourActive && currentStepIndex === simulation.actionStepIndex && (
                  <div onClick={simulation.handlers.onSimulatedDecide} className="absolute bottom-0 left-0 w-full h-24 z-50 cursor-pointer" />
                )}
                </div>
              </>
            )}
          </div>
        </div>

        <div id="tour-room-history" className="hidden lg:block lg:w-md w-full shrink-0 space-y-4 lg:sticky lg:top-4">
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
