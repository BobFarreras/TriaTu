// =================== FILE: features/rooms/ui/ParticipantsDock.tsx ===================
'use client'

import { Crown, X, Plus } from 'lucide-react';

interface Participant {
  userId: string;
}

interface Props {
  participants: Participant[];
  currentUserId: string;
  hostUserId: string;
  onKick: (userId: string) => void;
  onInvite: () => void;
}

export function ParticipantsDock({ participants, currentUserId, hostUserId, onKick, onInvite }: Props) {
  const isAmHost = currentUserId === hostUserId;

  return (
    <div className="flex-1 w-full md:w-auto overflow-x-auto no-scrollbar py-2"> {/* Afegim py-2 per espai vertical extra */}
      <div className="flex items-center justify-start md:justify-end gap-3 px-2">
        {participants.map((p) => {
          const isMe = p.userId === currentUserId;
          const isRoomHost = p.userId === hostUserId;

          return (
            <div key={p.userId} className="relative group shrink-0 pt-2"> {/* pt-2 per donar espai a la corona */}
              
              {/* AVATAR */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-xs font-black border-[3px] transition-transform duration-200 group-hover:scale-105
                ${isMe 
                  ? 'bg-blue-500 border-blue-300 text-white shadow-lg shadow-blue-200/50' 
                  : 'bg-gray-100 border-white text-gray-500 dark:bg-zinc-800 dark:border-zinc-700'
                }
              `}>
                {p.userId.slice(0, 2).toUpperCase()}
              </div>

              {/* INDICADOR DE HOST (CORONA) */}
              {isRoomHost && (
                <div className="absolute -top-1 right-0 text-yellow-500 bg-white dark:bg-black rounded-full p-[1px] shadow-sm animate-bounce-click z-10">
                  <Crown size={14} fill="currentColor" />
                </div>
              )}

              {/* BOTÓ KICK (SOLUCIONAT EL GLITCH) */}
              {/* Use 'absolute' i coordenades negatives per sortir de l'avatar sense moure el layout */}
              {isAmHost && !isMe && (
                <button
                  onClick={() => onKick(p.userId)}
                  className="absolute -bottom-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-zinc-900 z-20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
                  title="Expulsar jugador"
                >
                  <X size={10} strokeWidth={4} />
                </button>
              )}
            </div>
          );
        })}

        {/* BOTÓ INVITAR */}
        <button 
          onClick={onInvite} 
          className="group w-12 h-12 rounded-full border-2 border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all shrink-0 mt-2"
          title="Copiar invitació"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}