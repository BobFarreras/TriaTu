'use client';


import { Crown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // ✅ Hook de traducció
import { RankingPodium } from './RankingPodium';
import { RankingList } from './RankingList';
// Assegura't d'importar el tipus Player correctament segons la teva estructura
import { Player } from '@/core/domain/entities/Player';
import { BackButton } from '@/components/ui/BackButton';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RankingInfoDialog } from './RankingInfoDialog';

interface Props {
    podiumPlayers: Player[];
    listPlayers: Player[];
    currentUserId?: string;
    totalPlayersCount: number;
}

export function RankingView({ podiumPlayers, listPlayers, currentUserId, totalPlayersCount }: Props) {
    const { t } = useLanguage(); // ✅ Accés a traduccions
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [players, setPlayers] = useState(listPlayers);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [totalCount, setTotalCount] = useState(totalPlayersCount);
    const listContainerRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const infoSteps = useMemo(() => [{ targetId: 'ranking-info-trigger', title: '', description: '' }], []);
    const baseOffset = podiumPlayers.length;

    useEffect(() => {
        setPlayers(listPlayers);
        setTotalCount(totalPlayersCount);
    }, [listPlayers, totalPlayersCount]);

    const loadMore = useCallback(async () => {
        if (isLoadingMore) return;

        const offset = baseOffset + players.length;
        if (totalCount && offset >= totalCount) return;

        setIsLoadingMore(true);
        try {
            const response = await fetch(`/api/ranking?offset=${offset}&limit=20`);
            if (!response.ok) return;
            const data = await response.json();
            if (Array.isArray(data.players) && data.players.length > 0) {
                setPlayers((prev) => [...prev, ...data.players]);
            }
            if (typeof data.totalCount === 'number') {
                setTotalCount(data.totalCount);
            }
        } finally {
            setIsLoadingMore(false);
        }
    }, [baseOffset, isLoadingMore, players.length, totalCount]);

    useEffect(() => {
        const container = listContainerRef.current;
        const target = loadMoreRef.current;
        if (!container || !target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loadMore();
                }
            },
            { root: container, rootMargin: '0px 0px 120px 0px', threshold: 0.1 }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <main className="min-h-dvh w-full bg-[#0d1117] relative overflow-hidden flex flex-col font-sans selection:bg-yellow-500/30">
            <RankingInfoDialog isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

            {/* --- FONS "PARTY" ANIMAT --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Llums que es mouen */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[20%] right-[-20%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

                {/* Patró de quadrícula subtil */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
            </div>

            <div className="flex-1 w-full max-w-2xl mx-auto p-4 flex flex-col relative z-10">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 pt-4">

                    <BackButton />


                    <div className="flex flex-col items-center px-4">
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 uppercase tracking-wider flex items-center gap-2 filter drop-shadow-lg animate-in zoom-in duration-500">
                            {t.ranking.title} {/* ✅ TRADUÏT */}
                            <Crown className="text-yellow-400 fill-yellow-400 animate-bounce-slow" size={28} />
                        </h1>
                        <span className="text-[10px] text-yellow-500/60 font-black tracking-[0.4em] uppercase animate-pulse">
                            {t.ranking.season} {/* ✅ TRADUÏT */}
                        </span>
                    </div>

                    <TourTrigger
                        tourId="ranking-info"
                        steps={infoSteps}
                        onClick={() => setIsInfoOpen(true)}
                        className="bg-slate-900 border-slate-800 text-yellow-400 hover:text-yellow-300"
                    />
                </div>

                {/* PODI (Top 3) */}
                <div className="mb-6 animate-in slide-in-from-bottom-10 fade-in duration-1000">
                    <RankingPodium players={podiumPlayers} />
                </div>

                {/* LLISTA (Resta) - Estil "Targeta Flotante" */}
                <div className="flex-1 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-20 fade-in duration-700 delay-200">
                    <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-purple-400" size={16} />
                            <span className="text-sm font-black text-white uppercase tracking-wider">
                                {t.ranking.aspirants} {/* ✅ TRADUÏT */}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold bg-black/40 px-3 py-1 rounded-full text-zinc-400 border border-white/5">
                            {t.ranking.top_label} {totalPlayersCount} {/* ✅ TRADUÏT */}
                        </span>
                    </div>

                    <div ref={listContainerRef} className="flex-1 overflow-y-auto min-h-0 p-3 no-scrollbar">
                        <RankingList players={players} currentUserId={currentUserId} />
                        <div ref={loadMoreRef} className="h-6" />
                        {isLoadingMore && (
                            <div className="text-center py-4 text-xs uppercase tracking-[0.2em] text-zinc-500">
                                {t.common.loading}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
}
