'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useRealtimeRoom } from '../hooks/useRealtimeRoom';
import { kickParticipantAction, clearHistoryAction } from '@/app/actions/room-actions';
import { DecisionControls, CandidateDTO } from './DecisionControls';
import { RoomHeader } from './RoomHeader';
import { HistoryList } from './HistoryList';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // <---

export type RoomDTO = {
  id: string;
  name: string;
  hostUserId: string;
  participants: { userId: string }[];
  history: { choice: string; reason: string; date: string }[];
  votingMode: 'BLIND' | 'PUBLIC';
};

interface RoomDetailProps {
  room: RoomDTO;
  initialCandidates: CandidateDTO[];
  currentUserId: string;
}

export function RoomDetail({ room, currentUserId, initialCandidates }: RoomDetailProps) {
  useRealtimeRoom(room.id);
  const { t } = useLanguage(); // <---
  
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<'magic' | 'manual'>('magic');
  const router = useRouter();
  
  const isHost = room.hostUserId === currentUserId;

  const handleKick = (userIdToKick: string) => {
    if (!confirm(t.room.kick_confirm)) return; // <--- Traducció
    startTransition(async () => {
      const res = await kickParticipantAction(room.id, userIdToKick);
      if (!res.success) alert(res.error || t.room.err_kick);
    });
  };

  const handleClearHistory = () => {
    if (!confirm(t.room.clean_confirm)) return; // <--- Traducció
    startTransition(async () => {
      const res = await clearHistoryAction(room.id);
      if (res.success) router.refresh();
      else alert(res.error || t.room.err_clean);
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.id);
    alert(t.room.code_copied); // <--- Traducció
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 px-4 min-h-[calc(100vh-100px)] flex flex-col font-sans">
      
      {/* 1. HEADER I DOCK */}
      <RoomHeader 
        roomName={room.name}
        roomId={room.id}
        hostUserId={room.hostUserId}
        participants={room.participants}
        currentUserId={currentUserId}
        onKick={handleKick}
        onCopyCode={handleCopyCode}
      />

      {/* 2. LAYOUT PRINCIPAL */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">
        
        {/* ZONA CENTRAL */}
        <div className="flex-1 w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] border-[6px] border-gray-100 dark:border-zinc-800/50 shadow-xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-500 z-10">
           
           {/* SWITCHER FLOTANT */}
           <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 bg-gray-100/90 dark:bg-black/60 backdrop-blur-md rounded-full p-1.5 flex shadow-inner border border-gray-200 dark:border-zinc-700">
             <button
                onClick={() => setMode('magic')}
                className={`px-5 py-2 rounded-full text-xs font-black transition-all duration-300 ${mode === 'magic' ? 'bg-white dark:bg-zinc-800 shadow-lg text-purple-600 scale-105 ring-2 ring-purple-100 dark:ring-purple-900' : 'text-gray-400 hover:text-gray-600'}`}
             >
               {t.room.mode_auto}
             </button>
             <button
                onClick={() => setMode('manual')}
                className={`px-5 py-2 rounded-full text-xs font-black transition-all duration-300 ${mode === 'manual' ? 'bg-white dark:bg-zinc-800 shadow-lg text-blue-600 scale-105 ring-2 ring-blue-100 dark:ring-blue-900' : 'text-gray-400 hover:text-gray-600'}`}
             >
               {t.room.mode_manual}
             </button>
           </div>

           {/* CONTROLS */}
           <div className="flex-1 p-4 pt-20 md:p-8 md:pt-24">
             <DecisionControls
                 roomId={room.id}
                 userId={currentUserId}
                 isHost={isHost}
                 mode={mode}
                 candidates={initialCandidates}
                 votingMode={room.votingMode}
               />
           </div>
        </div>

        {/* SIDEBAR DRET */}
        <div className="lg:w-80 w-full shrink-0 space-y-4 lg:sticky lg:top-4">
           <HistoryList history={room.history} />
           
           {isHost && room.history.length > 0 && (
             <button 
               onClick={handleClearHistory}
               disabled={isPending}
               className="w-full py-3 text-xs font-bold text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors border border-transparent hover:border-red-100 flex items-center justify-center gap-2"
             >
               {t.room.clean_room}
             </button>
           )}
        </div>

      </div>
    </div>
  );
}