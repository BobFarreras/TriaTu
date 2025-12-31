import { RankingEntry } from '@/core/domain/entities/RankingEntry';
import { Sparkles,} from 'lucide-react';

interface Props {
    players: RankingEntry[];
}

export function RankingPodium({ players }: Props) {
    if (players.length === 0) return null;

    const first = players[0];
    const second = players[1];
    const third = players[2];
    
    // Ordre visual: 2n - 1r - 3r
    const podiumOrder = [second, first, third].filter(Boolean);

    return (
        <div className="flex items-end justify-center gap-2 md:gap-4 h-80 w-full pt-16 perspective-1000">
            {podiumOrder.map((player) => {
                const isFirst = player.rank === 1;
                const isSecond = player.rank === 2;
                
                // Mides i Estils
                const heightClass = isFirst ? 'h-64 w-1/3' : (isSecond ? 'h-48 w-1/4' : 'h-40 w-1/4');
                
                const style = isFirst 
                    ? { 
                        bar: 'bg-gradient-to-t from-yellow-900/40 via-yellow-600/20 to-yellow-400/10 border-yellow-500/50 shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)]', 
                        text: 'text-yellow-400',
                        emoji: 'text-6xl',
                        avatarBorder: 'border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]',
                        delay: 'delay-200'
                      }
                    : (isSecond 
                        ? { 
                            bar: 'bg-gradient-to-t from-zinc-900/40 via-zinc-600/20 to-zinc-400/10 border-zinc-500/50', 
                            text: 'text-zinc-300',
                            emoji: 'text-4xl',
                            avatarBorder: 'border-zinc-400',
                            delay: 'delay-100'
                          }
                        : { 
                            bar: 'bg-gradient-to-t from-orange-900/40 via-orange-600/20 to-orange-400/10 border-orange-500/50', 
                            text: 'text-orange-400',
                            emoji: 'text-4xl',
                            avatarBorder: 'border-orange-600',
                            delay: 'delay-0'
                          }
                    );

                return (
                    <div 
                        key={player.userId} 
                        className={`relative flex flex-col justify-end ${heightClass} group z-10 hover:z-20 transition-all duration-300 hover:scale-105`}
                    >
                         {/* 1. BARRA (GLASSMORPHISM) */}
                         <div className={`
                            relative w-full h-full rounded-t-3xl border-x border-t backdrop-blur-md flex flex-col justify-end pb-6 items-center text-center
                            animate-in slide-in-from-bottom-full duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] fill-mode-both ${style.delay}
                            ${style.bar} overflow-hidden
                         `}>
                             {/* Número de fons */}
                             <span className={`absolute top-2 text-8xl font-black ${style.text} opacity-10 select-none`}>
                                 {player.rank}
                             </span>

                             <div className="w-full px-1 z-10">
                                <span className="block text-[10px] md:text-xs font-black uppercase tracking-widest truncate text-white drop-shadow-md">
                                    {player.displayName}
                                </span>
                             </div>

                             <div className="mt-2 bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                                 <span className="text-[10px] font-mono font-bold text-white">
                                     {player.totalScore} pts
                                 </span>
                             </div>
                         </div>

                         {/* 2. AVATAR (POSAT DESPRÉS PERQUÈ QUEDI A SOBRE) */}
                         <div className={`
                            absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center
                            animate-in zoom-in slide-in-from-bottom-10 duration-1000 fill-mode-both ${style.delay}
                         `}>
                             {isFirst && (
                                <Sparkles className="text-yellow-300 absolute -top-8 animate-bounce" size={32} fill="currentColor" />
                             )}
                             
                             <div className={`
                                w-auto h-auto aspect-square rounded-full bg-[#131f24] flex items-center justify-center p-2 border-4
                                ${style.avatarBorder}
                             `}>
                                 <span className={`${style.emoji} filter drop-shadow-lg group-hover:animate-wiggle`}>
                                    {player.avatarEmoji}
                                 </span>
                             </div>
                         </div>
                    </div>
                );
            })}
        </div>
    );
}