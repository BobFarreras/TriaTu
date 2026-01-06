'use client'

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRealtimeRoom } from '../hooks/useRealtimeRoom';
import { kickParticipantAction, clearHistoryAction } from '@/app/actions/room-actions';
import { DecisionControls, CandidateDTO } from './DecisionControls';
import { RoomHeader } from './RoomHeader';
import { HistoryList } from './HistoryList';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { useRoomTour } from './components/useRoomTour';

// Definim el tipus de l'historial per evitar 'any'
type HistoryItem = { choice: string; reason: string; date: string };

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
  useRealtimeRoom(room.id);
  const { t } = useLanguage();
  
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<'magic' | 'manual'>('manual');
  const router = useRouter();
  
  const isHost = room.hostUserId === currentUserId;

  // --- 🪄 ESTATS DE LA SIMULACIÓ DEL TOUR ---
  const { steps, isActive: isTourActive, currentStepIndex, nextStep } = useRoomTour();
  
  const [simInput, setSimInput] = useState('');
  const [fakeCandidates, setFakeCandidates] = useState<CandidateDTO[]>([]);
  const [isSimLoading, setIsSimLoading] = useState(false);
  
  // ✅ CORRECCIÓ 2: Tipatge fort en lloc de 'any[]'
  const [fakeHistory, setFakeHistory] = useState<HistoryItem[]>([]);

  // 🤖 EFECTE: Control de la simulació pas a pas
  useEffect(() => {
    if (!isTourActive) return;

    // Pas 2: Simular escriure "Pizza 🍕"
    if (currentStepIndex === 2) {
        // ✅ CORRECCIÓ 3: 'let' a 'const'
        const text = "Pizza 🍕"; 
        let i = 0;
        
        const interval = setInterval(() => {
            // Això és segur perquè setSimInput no depèn de l'estat anterior de manera síncrona que bloquegi
            setSimInput(text.slice(0, i + 1));
            i++;
            if (i > text.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }

    // Pas 3: Simular que s'ha afegit el candidat
    if (currentStepIndex === 3) {
        // ✅ CORRECCIÓ 1: 'Cascading Renders'
        // Embolcallar en setTimeout trenca el cicle síncron de React.
        // A més, comprovem si ja tenim el candidat per no repetir l'acció innecessàriament.
        if (fakeCandidates.length === 0) {
            const timer = setTimeout(() => {
                setSimInput('');
                setFakeCandidates([{ id: 'fake-1', userId: currentUserId, content: "Pizza 🍕" }]);
            }, 0);
            return () => clearTimeout(timer);
        }
    }

    // Pas 4: Esperem l'acció de l'usuari (sense efectes automàtics aquí per evitar conflictes)

  }, [isTourActive, currentStepIndex, currentUserId, fakeCandidates.length]); // Afegida dependència safe


  // 🖱️ Interceptor del botó "Afegir" durant el tour
  const handleSimulatedAdd = () => {
      if (isTourActive && currentStepIndex === 2) {
          nextStep();
      }
  };

  // 🖱️ Interceptor del botó "Decidir" durant el tour
  const handleSimulatedDecide = () => {
       if (isTourActive && currentStepIndex === 4) {
           setIsSimLoading(true);
           
           // Simulem el temps de la IA
           setTimeout(() => {
               setIsSimLoading(false);
               
               // Afegim a l'historial fake
               setFakeHistory([{
                   choice: "Pizza 🍕",
                   reason: "La IA ha decidit que avui toca un clàssic! 🧀",
                   date: new Date().toISOString()
               }, ...room.history]);
               
               nextStep(); // Avancem a l'historial
           }, 1500);
       }
  };

  // --- FI SIMULACIÓ ---

  const handleKick = (userIdToKick: string) => {
    if (!confirm(t.room.kick_confirm)) return;
    startTransition(async () => {
      const res = await kickParticipantAction(room.id, userIdToKick);
      if (!res.success) alert(res.error || t.room.err_kick);
    });
  };

  const handleClearHistory = () => {
    if (!confirm(t.room.clean_confirm)) return;
    startTransition(async () => {
      const res = await clearHistoryAction(room.id);
      if (res.success) router.refresh();
      else alert(res.error || t.room.err_clean);
    });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/invite/${room.inviteCode}`;
    const shareData = {
      title: `Uneix-te a "${room.name}"`,
      text: `Ei! Ajuda'm a decidir a Triatu. Entra aquí:`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('✅ Enllaç copiat!');
    } catch (err) {
      console.log('Error copying:', err);
    }
  };


  // Combinem dades reals i fake
  const displayCandidates = isTourActive && fakeCandidates.length > 0 ? fakeCandidates : initialCandidates;
  const displayHistory = isTourActive && fakeHistory.length > 0 ? fakeHistory : room.history;

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

      <div className="fixed top-4 right-4 z-50">
          <TourTrigger tourId="room-guide" steps={steps} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">
        
        {/* ZONA CENTRAL */}
        <div className="flex-1 w-full bg-zinc-900/90 backdrop-blur-xl rounded-[2.5rem] border-[6px] border-zinc-800 shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-500 z-10">
            
            <div id="tour-room-mode" className="absolute top-5 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md rounded-full p-1.5 flex shadow-inner border border-zinc-700">
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
            </div>

            <div id="tour-room-controls" className="flex-1 p-4 pt-20 md:p-8 md:pt-24">
              <DecisionControls
                  roomId={room.id}
                  userId={currentUserId}
                  isHost={isHost}
                  mode={mode}
                  candidates={displayCandidates}
                  votingMode={room.votingMode}
                  
                  // ✅ PROPS DE SIMULACIÓ
                  simulatedInputValue={simInput}
                  isSimulatingLoading={isSimLoading}
                  onSimulatedAdd={handleSimulatedAdd}
              />
              
              {/* CAPA TRANSPARENT PER CAPTURAR EL CLICK FINAL (TRUC) */}
              {isTourActive && currentStepIndex === 4 && (
                  <div 
                    onClick={handleSimulatedDecide}
                    className="absolute bottom-0 left-0 w-full h-24 z-50 cursor-pointer"
                    title="Simular Decisió"
                  ></div>
              )}
            </div>
        </div>

        {/* SIDEBAR DRET */}
        <div id="tour-room-history" className="lg:w-80 w-full shrink-0 space-y-4 lg:sticky lg:top-4">
           <HistoryList history={displayHistory} />
           
           {isHost && room.history.length > 0 && (
            <button 
              onClick={handleClearHistory}
              disabled={isPending}
              className="w-full py-3 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-2xl transition-colors border border-transparent hover:border-red-900/50 flex items-center justify-center gap-2"
            >
              {t.room.clean_room}
            </button>
           )}
        </div>

      </div>
    </div >
  );
}