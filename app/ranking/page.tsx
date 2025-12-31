import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { RankingPodium } from '@/features/ranking/ui/RankingPodium';
import { RankingList } from '@/features/ranking/ui/RankingList';
import { DashboardHeader } from '@/features/dashboard/ui/DashboardHeader';
import { ArrowLeft, Crown } from 'lucide-react';
import Link from 'next/link';

// Revalidem cada minut per no carregar la base de dades, però tenir dades fresques
export const revalidate = 60; 

export default async function RankingPage() {
    // 1. Connexió a Infraestructura
    const supabase = await createClient();
    const rankingRepo = container.getRankingRepository(supabase);
    
    // 2. Recuperar dades (En paral·lel per eficiència)
    const [topPlayers, { data: { user } }] = await Promise.all([
        rankingRepo.getTopPlayers(50),
        supabase.auth.getUser()
    ]);

    // 3. Separar lògica visual (Top 3 vs Resta)
    const podiumPlayers = topPlayers.slice(0, 3);
    const listPlayers = topPlayers.slice(3);

    return (
        <main className="min-h-dvh w-full bg-[#131f24] bg-gamified-pattern relative overflow-hidden flex flex-col">
             
             {/* DECORACIÓ */}
             <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none"></div>
             
             <div className="flex-1 w-full max-w-lg mx-auto p-4 flex flex-col relative z-10">
                
                {/* Header personalitzat per a aquesta pàgina */}
                <div className="flex items-center justify-between mb-6 pt-2">
                    <Link href="/dashboard" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Crown className="text-yellow-400 fill-yellow-400" size={24} /> 
                        Hall of Fame
                    </h1>
                    <div className="w-10"></div> {/* Espaiador per centrar el títol */}
                </div>

                {/* PODI (Top 3) */}
                <div className="animate-in slide-in-from-bottom-10 fade-in duration-700">
                    <RankingPodium players={podiumPlayers} />
                </div>

                {/* LLISTA (Resta) */}
                <div className="flex-1 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-20 fade-in duration-1000 delay-200">
                    <div className="p-4 bg-zinc-900/80 border-b border-white/5 flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            Aspirants
                        </span>
                        <span className="text-[10px] text-zinc-600">
                            Actualitzat fa poc
                        </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto min-h-0">
                        <RankingList players={listPlayers} currentUserId={user?.id} />
                    </div>
                </div>

             </div>
        </main>
    );
}