import { RankingEntry } from '@/core/domain/entities/RankingEntry';
import { Trophy, Medal, Crown } from 'lucide-react';

interface Props {
    players: RankingEntry[];
}

export function RankingPodium({ players }: Props) {
    // Si no hi ha prou jugadors, protegim el renderitzat
    if (players.length === 0) return null;

    // Ordenació visual per al podi: [2n, 1r, 3r]
    // Això fa que el 1r quedi al mig
    const first = players[0];
    const second = players[1];
    const third = players[2];
    
    // Array ordenat visualment
    const podiumOrder = [second, first, third].filter(Boolean);

    return (
        <div className="flex items-end justify-center gap-2 md:gap-4 h-56 md:h-64 w-full max-w-lg mx-auto mb-8">
            {podiumOrder.map((player) => {
                const isFirst = player.rank === 1;
                const isSecond = player.rank === 2;
                
                // Estils dinàmics segons posició
                const heightClass = isFirst ? 'h-48 md:h-56 w-1/3' : (isSecond ? 'h-36 md:h-40 w-1/4' : 'h-24 md:h-32 w-1/4');
                
                const colorConfig = isFirst 
                    ? { border: 'border-yellow-500', bg: 'from-yellow-500/20 to-yellow-900/5', text: 'text-yellow-400', icon: <Crown size={24} className="fill-yellow-500 text-yellow-100" /> }
                    : (isSecond 
                        ? { border: 'border-zinc-400', bg: 'from-zinc-400/20 to-zinc-800/5', text: 'text-zinc-300', icon: <Medal size={20} className="text-zinc-300" /> }
                        : { border: 'border-orange-600', bg: 'from-orange-600/20 to-orange-900/5', text: 'text-orange-500', icon: <Trophy size={18} className="text-orange-600" /> }
                    );

                return (
                    <div key={player.userId} className={`flex flex-col items-center relative ${isFirst ? '-mt-6 z-10' : 'z-0'} ${heightClass}`}>
                         
                         {/* Avatar / Icona flotant */}
                         <div className={`
                            absolute -top-6 rounded-full border-2 bg-zinc-900 flex items-center justify-center shadow-2xl animate-in zoom-in duration-500
                            ${colorConfig.border}
                            ${isFirst ? 'w-16 h-16' : 'w-12 h-12'}
                         `}>
                             <span className="text-2xl">{isFirst ? '👨‍🍳' : (isSecond ? '🔪' : '🥄')}</span>
                             
                             {/* Badge de posició */}
                             <div className="absolute -bottom-2 -right-1 bg-zinc-950 rounded-full p-1 border border-zinc-800">
                                {colorConfig.icon}
                             </div>
                         </div>

                         {/* Bloc del Podi */}
                         <div className={`
                            w-full h-full rounded-t-2xl border-x border-t backdrop-blur-md bg-linear-to-b flex flex-col justify-end pb-4 items-center text-center transition-all hover:brightness-110
                            ${colorConfig.border} ${colorConfig.bg}
                         `}>
                             <span className={`text-3xl font-black mb-1 ${colorConfig.text}`}>
                                 {player.rank}
                             </span>
                             <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide px-1 truncate w-full opacity-90 text-white">
                                 {player.displayName}
                             </span>
                             <span className="text-[10px] font-mono bg-black/40 px-2 rounded-full mt-1 text-zinc-400">
                                 {player.totalScore} pts
                             </span>
                         </div>
                    </div>
                );
            })}
        </div>
    );
}