import { RankingEntry } from '@/core/domain/entities/RankingEntry';
import { Star, Package, MessageSquare } from 'lucide-react';

interface Props {
    players: RankingEntry[];
    currentUserId?: string;
}

export function RankingList({ players, currentUserId }: Props) {
    if (players.length === 0) {
        return (
            <div className="p-8 text-center text-zinc-500 text-sm italic">
                Encara no hi ha més aspirants...
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-white/5">
            {players.map((player) => {
                const isMe = player.userId === currentUserId;
                
                return (
                    <div 
                        key={player.userId} 
                        className={`
                            flex items-center gap-3 p-3 md:p-4 transition-colors 
                            ${isMe ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : 'hover:bg-white/5 border-l-2 border-transparent'}
                        `}
                    >
                        {/* Posició */}
                        <div className="font-black text-zinc-500 w-6 text-center text-lg italic shrink-0">
                            #{player.rank}
                        </div>
                        
                        {/* Avatar Simple */}
                        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-lg shadow-inner border border-white/5 shrink-0">
                            👤
                        </div>

                        {/* Informació Principal */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className={`font-bold text-sm truncate ${isMe ? 'text-indigo-300' : 'text-zinc-200'}`}>
                                    {player.displayName} {isMe && '(Tu)'}
                                </span>
                                {/* Medalles extra */}
                                <div className="flex gap-1">
                                    {player.badges.map(badge => (
                                        <span key={badge} className="text-xs filter drop-shadow-lg" title="Medalla especial">{badge}</span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* 🔥 LES MÈTRIQUES DE REPUTACIÓ (El cor del sistema) */}
                            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                                {player.qualityScore > 0 && (
                                    <div className="flex items-center gap-1 text-yellow-500/80 bg-yellow-500/5 px-1.5 py-0.5 rounded" title="Qualitat (Estrelles rebudes)">
                                        <Star size={10} fill="currentColor" /> 
                                        <span>{player.qualityScore}</span>
                                    </div>
                                )}
                                {player.pantryScore > 0 && (
                                    <div className="flex items-center gap-1 text-blue-400/70 bg-blue-500/5 px-1.5 py-0.5 rounded" title="Hàbit (Rebost)">
                                        <Package size={10} /> 
                                        <span>{player.pantryScore}</span>
                                    </div>
                                )}
                                {player.communityScore > 0 && (
                                    <div className="flex items-center gap-1 text-purple-400/70 bg-purple-500/5 px-1.5 py-0.5 rounded" title="Participació (Vots fets)">
                                        <MessageSquare size={10} /> 
                                        <span>{player.communityScore}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Puntuació Total */}
                        <div className="flex flex-col items-end shrink-0">
                            <div className="font-black text-white text-base md:text-lg leading-none">
                                {player.totalScore}
                            </div>
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">PTS</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}