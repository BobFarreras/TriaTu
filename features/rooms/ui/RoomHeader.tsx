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
    <header className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-xl p-3 rounded-[2.5rem] border border-zinc-800 shadow-sm animate-in slide-in-from-top-4 z-20 relative">
      
      {/* SECCIÓ ESQUERRA: SORTIDA + INFO */}
      <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
        
        {/* BOTÓ SORTIR (Fosc) */}
        <Link 
            href="/rooms" 
            className="group flex items-center justify-center w-14 h-14 bg-zinc-800 rounded-3xl border-2 border-transparent hover:border-red-900/50 hover:bg-red-900/10 transition-all shrink-0"
            title="Sortir al Dashboard"
        >
            <LogOut size={20} className="text-gray-500 group-hover:text-red-500 transition-colors transform group-hover:-translate-x-1" />
        </Link>

        {/* INFO SALA */}
        {/* AFEGIT: max-w-full i overflow-hidden per evitar desbordaments en mòbils petits */}
        <div className="flex items-center gap-4 bg-black/20 p-2 pr-6 rounded-3xl border border-zinc-800/50 flex-1 md:flex-none max-w-full min-w-0">
            <div className="bg-linear-to-br from-purple-500 to-pink-500 w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-purple-900/20 transform -rotate-3 group-hover:rotate-0 transition-transform shrink-0">
               🎪
            </div>
            
            <div className="min-w-0 flex flex-col">
                {/* TÍTOL */}
                <h1 className="font-black text-lg leading-none text-white truncate w-full">
                    {roomName}
                </h1>
                
                <button 
                    onClick={onCopyCode} 
                    className="text-[10px] font-mono font-bold text-gray-500 hover:text-purple-400 flex items-center gap-1 mt-0.5 group/code transition-colors text-left max-w-full"
                >
                    {/* CORRECCIÓ: Afegim un max-w i block perquè el truncate funcioni */}
                    <span className="truncate max-w-25 md:max-w-50 block">
                        ID: {roomId}
                    </span> 
                    <Share2 size={10} className="group-hover/code:scale-110 shrink-0"/>
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