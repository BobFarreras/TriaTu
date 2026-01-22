// features/rooms/components/RoomHeader.tsx
'use client';

import { Settings, LogOut, Share2 } from 'lucide-react';
import { ParticipantsDock } from './ParticipantsDock';
import Link from 'next/link';

interface Props {
  roomName: string;
  roomId: string;
  hostUserId: string;
  participants: { userId: string }[];
  currentUserId: string;
  onKick: (userId: string) => void;
  onOpenSettings: () => void;
  // ✅ CORRECCIÓ: Afegim la propietat que faltava
  onCopyCode: () => void; 
}

export function RoomHeader({ 
  roomName, 
  roomId, 
  hostUserId, 
  participants, 
  currentUserId, 
  onKick, 
  onOpenSettings,
  onCopyCode 
}: Props) {
  const isHost = currentUserId === hostUserId;

  return (
    <header className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-xl p-3 rounded-[2.5rem] border border-zinc-800 shadow-sm animate-in slide-in-from-top-4 z-20 relative">
      {/* ... (resta del codi igual, sense canvis visuals) ... */}
       <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
        <Link
          href="/rooms"
          className="group flex items-center justify-center w-14 h-14 bg-zinc-800 rounded-3xl border-2 border-transparent hover:border-red-900/50 hover:bg-red-900/10 transition-all shrink-0"
        >
          <LogOut size={20} className="text-gray-500 group-hover:text-red-500 transition-colors transform group-hover:-translate-x-1" />
        </Link>

        {/* INFO CARD */}
        <div 
          className={`flex items-center gap-4 bg-black/40 p-2 pr-4 rounded-3xl border border-zinc-800/50 flex-1 md:flex-none max-w-full min-w-0 shadow-inner ${isHost ? 'cursor-pointer hover:bg-black/60 transition-colors' : ''}`}
          onClick={isHost ? onOpenSettings : undefined}
        >
          <div className="bg-linear-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-purple-900/20 shrink-0">
            🎪
          </div>
          <div className="min-w-0 flex flex-col justify-center gap-1">
            <h1 className="font-black text-lg leading-none text-white truncate w-full pr-2">
              {roomName}
            </h1>
            <span className="text-[9px] font-mono text-zinc-600 leading-none">
              ID: {roomId.slice(0, 8)}...
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* Share Mobile */}
        <button
          onClick={onCopyCode}
          className="md:hidden flex items-center justify-center w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 active:scale-95 active:bg-emerald-500/30 transition-all"
        >
          <Share2 size={20} />
        </button>

        <ParticipantsDock
          participants={participants}
          currentUserId={currentUserId}
          hostUserId={hostUserId}
          onKick={onKick}
          onInvite={onCopyCode}
        />

        {isHost && (
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center w-12 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 rounded-2xl text-zinc-300 transition-all active:scale-95"
          >
            <Settings size={22} />
          </button>
        )}
      </div>
    </header>
  );
}