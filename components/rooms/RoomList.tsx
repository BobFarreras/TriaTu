'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';

// Defineix el tipus segons el que retorni el teu cas d'ús (normalment DecisionRoom)
interface RoomSummary {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  participantsCount: number;
  status: 'VOTING' | 'DECIDED'; // Ajusta segons el teu domini
}

interface RoomListProps {
  rooms: any[]; // Posa el tipus correcte (DecisionRoom[])
  currentUserId: string;
}

export function RoomList({ rooms }: RoomListProps) {
  
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
        <p className="text-4xl mb-2 grayscale opacity-30">🕸️</p>
        <p className="text-slate-500 text-sm">No participes en cap sala encara.</p>
        <p className="text-slate-600 text-xs mt-1">Crea'n una o uneix-te amb un codi!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {rooms.map((room) => (
        <Link 
          key={room.id} 
          href={`/room/${room.code}`} // O room.id, depenent de la teva ruta
          className="group block bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {room.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-white font-bold leading-tight group-hover:text-indigo-300 transition-colors">
                        {room.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        #{room.code}
                    </span>
                </div>
            </div>
            
            {/* ESTAT */}
            {room.status === 'DECIDED' ? (
                <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-1 rounded-full font-bold border border-green-500/20">
                    Acabada
                </span>
            ) : (
                <span className="text-[10px] bg-indigo-900/30 text-indigo-400 px-2 py-1 rounded-full font-bold border border-indigo-500/20 animate-pulse">
                    Votant...
                </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-slate-800/50">
            <span className="flex items-center gap-1">
                👥 {room.participantsCount || 1} Persones
            </span>
            <span>
               {formatDistanceToNow(new Date(room.createdAt), { addSuffix: true, locale: ca })}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}