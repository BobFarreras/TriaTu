import { RankingEntry } from '@/core/domain/entities/RankingEntry';
import { Star, MessageSquare } from 'lucide-react';

interface Props {
    players: RankingEntry[];
    currentUserId?: string;
}

export function RankingList({ players, currentUserId }: Props) {
    if (players.length === 0) return <div className="p-10 text-center text-zinc-500 italic">Aquí no hi ha ningú... 👻</div>;

    return (
        <div className="flex flex-col gap-2">
            {players.map((player, index) => {
                const isMe = player.userId === currentUserId;
                
                // Càlcul del retard per l'animació en cascada
                const delay = `${index * 50}ms`;

                return (
                    <div 
                        key={player.userId}
                        style={{ animationDelay: delay }}
                        className={`
                            relative group flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300
                            animate-in slide-in-from-bottom-4 fade-in fill-mode-both
                            hover:scale-[1.02] hover:shadow-lg
                            ${isMe 
                                ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.2)]' 
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                            }
                        `}
                    >
                        {/* Rank */}
                        <div className={`
                            w-8 text-center font-black text-xl italic shrink-0
                            ${player.rank <= 10 ? 'text-white text-shadow-glow' : 'text-zinc-600'}
                        `}>
                            #{player.rank}
                        </div>
                        
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-zinc-800/80 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                            {player.avatarEmoji}
                        </div>

                        {/* Info Central */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                                <span className={`font-bold text-sm truncate ${isMe ? 'text-indigo-300' : 'text-zinc-200 group-hover:text-white'}`}>
                                    {player.displayName} {isMe && '(Tu)'}
                                </span>
                            </div>
                            
                            {/* Badges/Stats Mini */}
                            <div className="flex items-center gap-2 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                {player.qualityScore > 0 && (
                                    <span className="flex items-center text-[9px] text-yellow-400 gap-0.5"><Star size={8} fill="currentColor"/> {player.qualityScore}</span>
                                )}
                                {player.communityScore > 0 && (
                                    <span className="flex items-center text-[9px] text-purple-400 gap-0.5"><MessageSquare size={8} /> {player.communityScore}</span>
                                )}
                            </div>
                        </div>

                        {/* Puntuació */}
                        <div className="flex flex-col items-end shrink-0 pl-3 border-l border-white/5">
                            <div className="font-black text-white text-lg leading-none group-hover:text-yellow-400 transition-colors">
                                {player.totalScore}
                            </div>
                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">PTS</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}