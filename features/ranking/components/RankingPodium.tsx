'use client';

import { Player } from '@/core/domain/entities/Player';
import { Crown } from 'lucide-react';
import Image from 'next/image';

interface Props {
  players: Player[];
}

export function RankingPodium({ players }: Props) {
  // Assegurem que sempre tenim 3 posicions (encara que siguin undefined)
  const [first, second, third] = [players[0], players[1], players[2]];

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4 h-48 sm:h-56 mt-8">
      
      {/* 🥈 SEGON LLOC */}
      <PodiumStep player={second} position={2} />

      {/* 🥇 PRIMER LLOC */}
      <PodiumStep player={first} position={1} />

      {/* 🥉 TERCER LLOC */}
      <PodiumStep player={third} position={3} />

    </div>
  );
}

// Subcomponent intern per netejar el codi
function PodiumStep({ player, position }: { player?: Player, position: number }) {
  if (!player) {
    // Placeholder buit si no hi ha jugador
    return <div className="flex-1 h-full opacity-0"></div>;
  }

  const isFirst = position === 1;
  const isSecond = position === 2;
  
  // Alçades relatives
  const heightClass = isFirst ? 'h-full' : isSecond ? 'h-4/5' : 'h-3/5';
  
  // Colors segons posició
  const colorClass = isFirst 
    ? 'bg-linear-to-b from-yellow-400 to-yellow-600 border-yellow-300 shadow-yellow-900/40' 
    : isSecond 
      ? 'bg-linear-to-b from-slate-300 to-slate-500 border-slate-200 shadow-slate-900/40' 
      : 'bg-linear-to-b from-orange-400 to-orange-700 border-orange-300 shadow-orange-900/40';

  const glowColor = isFirst ? 'bg-yellow-500' : isSecond ? 'bg-slate-400' : 'bg-orange-500';

  return (
    <div className={`flex flex-col items-center justify-end w-1/3 max-w-[120px] ${heightClass} relative group`}>
      
      {/* Avatar flotant */}
      <div className={`absolute -top-6 sm:-top-8 w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-white/20 shadow-xl overflow-hidden z-20 flex items-center justify-center bg-zinc-800 transition-transform group-hover:scale-110 duration-300`}>
         {player.avatarUrl ? (
            <Image
              src={player.avatarUrl}
              alt={player.username}
              width={56}
              height={56}
              unoptimized
              className="w-full h-full object-cover"
            />
         ) : (
            <span className="text-white font-bold">{player.username.charAt(0)}</span>
         )}
         {isFirst && <Crown size={20} className="absolute -top-3 -right-2 text-yellow-300 fill-yellow-300 animate-bounce" />}
      </div>

      {/* Barra del Podi */}
      <div className={`w-full flex-1 rounded-t-2xl border-t-4 ${colorClass} relative flex flex-col items-center justify-start pt-8 sm:pt-10 shadow-lg`}>
         
         {/* Brillo */}
         <div className="absolute top-0 inset-x-0 h-1/2 bg-linear-to-b from-white/20 to-transparent pointer-events-none rounded-t-xl" />

         <span className="text-2xl sm:text-4xl font-black text-white/90 drop-shadow-md">
            {position}
         </span>
         
         <div className="mt-1 flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold text-white/80 truncate max-w-[80px]">
                {player.username}
            </span>
            <span className="text-[9px] font-black bg-black/20 px-1.5 py-0.5 rounded text-white/60 mt-0.5">
                {player.score}
            </span>
         </div>
      </div>

      {/* Efecte Glow al terra */}
      <div className={`absolute bottom-0 w-full h-4 ${glowColor} blur-xl opacity-30`} />
    </div>
  );
}