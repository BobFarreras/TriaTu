// =================== FILE: features/rooms/ui/RoomHeader.tsx ===================
'use client'

import { Share2, LogOut } from 'lucide-react';
import { ParticipantsDock } from './ParticipantsDock';
import Link from 'next/link';

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
  return (
    <header className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-3 rounded-[2.5rem] border border-gray-200 dark:border-zinc-800 shadow-sm animate-in slide-in-from-top-4 z-20 relative">
      
      {/* SECCIÓ ESQUERRA: SORTIDA + INFO */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        
        {/* BOTÓ SORTIR (NOU) */}
        <Link 
            href="/" 
            className="group flex items-center justify-center w-14 h-14 bg-gray-100 dark:bg-zinc-800 rounded-3xl border-2 border-transparent hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all shrink-0"
            title="Sortir al Dashboard"
        >
            <LogOut size={20} className="text-gray-400 group-hover:text-red-500 transition-colors transform group-hover:-translate-x-1" />
        </Link>

        {/* INFO SALA */}
        <div className="flex items-center gap-4 bg-white dark:bg-black/20 p-2 pr-6 rounded-3xl border border-gray-100 dark:border-zinc-800/50">
            <div className="bg-linear-to-br from-purple-500 to-pink-500 w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-purple-500/20 transform -rotate-3 group-hover:rotate-0 transition-transform">
            🎪
            </div>
            <div className="min-w-0 flex flex-col">
                <h1 className="font-black text-lg leading-none text-gray-800 dark:text-white truncate max-w-37.5 md:max-w-xs">
                    {roomName}
                </h1>
                <button 
                    onClick={onCopyCode} 
                    className="text-[10px] font-mono font-bold text-gray-400 hover:text-purple-500 flex items-center gap-1 mt-0.5 group/code transition-colors text-left"
                >
                    <span className="truncate">ID: {roomId}</span> 
                    <Share2 size={10} className="group-hover/code:scale-110"/>
                </button>
            </div>
        </div>
      </div>

      {/* SECCIÓ DRETA: PARTICIPANTS */}
      <ParticipantsDock 
        participants={participants}
        currentUserId={currentUserId}
        hostUserId={hostUserId}
        onKick={onKick}
        onInvite={onCopyCode}
      />
    </header>
  );
}