'use client';

import { Player } from '@/core/domain/entities/Player'; // ✅ Usem l'entitat de domini
import Image from 'next/image';

interface Props {
  players: Player[];
  currentUserId?: string;
}

export function RankingList({ players, currentUserId }: Props) {
  
  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">
        No hi ha més jugadors... encara.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {players.map((player) => {
        // Si el jugador no té rank definit, calculem segons la posició a la llista (+4 perquè els 3 primers són al podi)
        const rank = player.rank || 0; 
        const isMe = currentUserId === player.id;

        return (
          <div 
            key={player.id}
            className={`
              flex items-center justify-between p-3 rounded-xl border transition-all
              ${isMe 
                ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                : 'bg-zinc-800/30 border-white/5 hover:bg-zinc-800/60'
              }
            `}
          >
            {/* ESQUERRA: Rank + Info */}
            <div className="flex items-center gap-4">
              
              {/* POSICIÓ */}
              <div className="w-8 flex justify-center font-black text-zinc-500 font-mono text-sm">
                #{rank}
              </div>

              {/* AVATAR + NOM */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner ${isMe ? 'bg-purple-600 text-white' : 'bg-zinc-700 text-zinc-400'}`}>
                   {player.avatarUrl ? (
                      <Image
                        src={player.avatarUrl}
                        alt={player.username}
                        width={40}
                        height={40}
                        unoptimized
                        className="w-full h-full rounded-full object-cover"
                      />
                   ) : (
                      <span>{player.username.charAt(0).toUpperCase()}</span>
                   )}
                </div>
                
                <div className="flex flex-col">
                  <span className={`font-bold text-sm leading-none ${isMe ? 'text-purple-300' : 'text-zinc-200'}`}>
                    {player.username} {isMe && '(Tu)'}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-wide">
                    {player.wins} Victòries
                  </span>
                </div>
              </div>
            </div>

            {/* DRETA: Puntuació */}
            <div className="flex flex-col items-end">
              <span className="font-black text-white text-base leading-none">
                {player.score.toLocaleString()}
              </span>
              <span className="text-[9px] text-zinc-600 font-bold uppercase">PTS</span>
            </div>

          </div>
        );
      })}
    </div>
  );
}
