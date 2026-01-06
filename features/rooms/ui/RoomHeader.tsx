'use client'

import { Share2, LogOut } from 'lucide-react';
import { ParticipantsDock } from './ParticipantsDock';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  roomName: string;
  roomId: string;
  hostUserId: string;
  participants: { userId: string }[];
  currentUserId: string;
  onKick: (userId: string) => void;
  onCopyCode: () => void;
}

export function RoomHeader({ roomName, roomId, hostUserId, participants, currentUserId, onKick, onCopyCode }: Props) {
  const { t } = useLanguage();

  return (
    <header className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-xl p-3 rounded-[2.5rem] border border-zinc-800 shadow-sm animate-in slide-in-from-top-4 z-20 relative">

      {/* SECCIÓ ESQUERRA: SORTIDA + INFO */}
      <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">

        {/* BOTÓ SORTIR */}
        <Link
          href="/rooms"
          className="group flex items-center justify-center w-14 h-14 bg-zinc-800 rounded-3xl border-2 border-transparent hover:border-red-900/50 hover:bg-red-900/10 transition-all shrink-0"
          title={t.common?.back || "Sortir"}
        >
          <LogOut size={20} className="text-gray-500 group-hover:text-red-500 transition-colors transform group-hover:-translate-x-1" />
        </Link>

        {/* TARGETA D'INFO PRINCIPAL */}
        <div className="flex items-center gap-4 bg-black/40 p-2 pr-4 rounded-3xl border border-zinc-800/50 flex-1 md:flex-none max-w-full min-w-0 shadow-inner">

          {/* Icona Sala */}
          <div className="bg-linear-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-purple-900/20 transform -rotate-3 group-hover:rotate-0 transition-transform shrink-0">
            🎪
          </div>

          <div className="min-w-0 flex flex-col justify-center gap-1">
            {/* TÍTOL DE LA SALA */}
            <h1 className="font-black text-lg leading-none text-white truncate w-full pr-2">
              {roomName}
            </h1>

            {/* ID discret */}
            <span className="text-[9px] font-mono text-zinc-600 leading-none">
              ID: {roomId.slice(0, 8)}...
            </span>
          </div>

          {/* SEPARADOR VERTICAL (Només visible en Desktop) */}
          <div className="h-8 w-px bg-zinc-700/50 mx-1 hidden md:block"></div>

          {/* 🟢 BOTÓ D'INVITAR (VERSIÓ DESKTOP) 
              Fixa't en 'hidden md:flex': S'amaga en mòbil, es veu en pantalles mitjanes/grans
          */}
          <button
            onClick={onCopyCode}
            className="
                  hidden md:flex 
                  group relative items-center gap-2 
                  bg-emerald-500/10 hover:bg-emerald-500/20 
                  border border-emerald-500/30 hover:border-emerald-500/60
                  px-4 py-2 rounded-xl transition-all active:scale-95
                  shrink-0 ml-auto
                "
          >
            <div className="bg-emerald-500/20 p-1 rounded-full group-hover:bg-emerald-500 text-emerald-500 group-hover:text-white transition-colors">
              <Share2 size={14} strokeWidth={3} />
            </div>

            <span className="text-xs font-bold text-emerald-100">
              {t.room.invite_cta || "Invitar"}
            </span>
          </button>
        </div>
      </div>

      {/* SECCIÓ DRETA: PARTICIPANTS (+ BOTÓ MÒBIL) 
          En mòbil això és la segona fila.
      */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        
        {/* 🟢 BOTÓ D'INVITAR (VERSIÓ MÒBIL - NOMÉS ICONA)
            Fixa't en 'md:hidden': Es veu en mòbil, s'amaga en desktop.
            Està a l'esquerra dels participants (justify-between ho separa).
        */}
        <button
            onClick={onCopyCode}
            className="md:hidden flex items-center justify-center w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 active:scale-95 active:bg-emerald-500/30 transition-all"
        >
            <Share2 size={20} />
        </button>

        {/* ELS PARTICIPANTS */}
        <ParticipantsDock
          participants={participants}
          currentUserId={currentUserId}
          hostUserId={hostUserId}
          onKick={onKick}
          onInvite={onCopyCode}
        />
      </div>
    </header>
  );
}