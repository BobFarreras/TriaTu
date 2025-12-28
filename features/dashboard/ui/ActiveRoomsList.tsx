'use client'

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type RoomSummary = {
  id: string;
  name: string;
  isHost: boolean;
};

export function ActiveRoomsList({ rooms }: { rooms: RoomSummary[] }) {
  const { t } = useLanguage();

  if (rooms.length === 0) {
    return (
      <div className="p-6 text-center border-2 border-dashed border-zinc-800 rounded-4xl opacity-50 select-none bg-zinc-900/30">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            {t.dashboard.active_rooms_empty || "Cap sala activa"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
            {t.dashboard.active_rooms_title || "LES TEVES SALES"}
          </h3>
          <span className="bg-zinc-800 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {rooms.length}
          </span>
      </div>
      
      <div className="grid grid-cols-1 gap-3 max-h-75 overflow-y-auto pr-1 custom-scrollbar">
        {rooms.map((room) => (
          <Link 
            key={room.id} 
            href={`/rooms/${room.id}`}
            className="group flex items-center justify-between p-4 bg-zinc-900 rounded-3xl border-2 border-zinc-800 hover:border-purple-600 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 overflow-hidden">
               {/* ICONA: Fons fosc amb color accent */}
               <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg shadow-inner ${room.isHost ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                 {room.isHost ? '👑' : '🛋️'}
               </div>
               <div className="flex flex-col overflow-hidden">
                 <p className="font-bold text-white leading-tight group-hover:text-purple-400 transition-colors truncate">
                    {room.name}
                 </p>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                    {room.isHost ? 'Host' : 'Guest'}
                 </p>
               </div>
            </div>
            
            <div className="w-8 h-8 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all text-gray-400">
               <span className="text-sm font-bold">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}