'use client'

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { IndividualDecisionForm } from '@/features/decision/ui/IndividualDecisionForm';
import { UserDropdown } from './UserDropdown';
import { ActiveRoomsList } from './ActiveRoomsList';

interface Props {
    userName: string;
    userId: string;
    userRooms: { id: string; name: string; isHost: boolean }[];
}

export function DashboardContent({ userName, userId, userRooms }: Props) {
    const { t } = useLanguage();

    return (
        <main className="min-h-dvh w-full p-4 md:p-6 flex flex-col relative bg-dot-pattern selection:bg-purple-200 overflow-y-auto md:overflow-hidden">

            {/* DECORACIÓ DE FONS */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000"></div>

            {/* HEADER */}
            <header className="w-full max-w-6xl mx-auto flex justify-between items-center z-50 shrink-0 mb-6 md:mb-4">
                <div className="flex items-center gap-3 bg-white/80 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 dark:border-zinc-800 shadow-sm animate-in slide-in-from-top-4">
                    <div className="w-8 h-8 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-lg shadow-inner">
                        👽
                    </div>
                    <span className="font-black text-sm text-gray-700 dark:text-gray-200">
                        {userName}
                    </span>
                </div>
                <UserDropdown userName={userName} />
            </header>

            {/* LAYOUT CENTRAL */}
            <div className="flex-1 flex flex-col justify-start lg:justify-center min-h-0 w-full max-w-6xl mx-auto pb-24 lg:pb-0">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
                    
                    {/* COLUMNA ESQUERRA: LA CONSOLA */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 animate-in slide-in-from-left-4 duration-700">
                        
                        <div className="pl-2 mt-2 md:mt-0">
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">
                                Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Mestre!</span> 👋
                            </h1>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest pl-1">
                                {t.dashboard.level || "QUÈ TOCA FER AVUI?"}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900/90 backdrop-blur-xl rounded-[2.5rem] border-4 border-gray-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x"></div>
                            
                            <div className="p-6 md:p-8 relative z-10">
                                 <div className="mb-6 flex items-center gap-3 opacity-80">
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 text-purple-600 rounded-lg flex items-center justify-center animate-pulse">⚡</div>
                                    <span className="font-black text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Mode Ràpid</span>
                                 </div>
                                 
                                 <IndividualDecisionForm userId={userId} />
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DRETA: BOTONS + SALES */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-700 delay-100">
                        
                        <div className="hidden lg:block h-[5.5rem]"></div> 

                        <Link href="/rooms/create" className="group relative w-full h-28 md:h-32 bg-blue-600 hover:bg-blue-500 rounded-[2rem] border-b-[6px] border-blue-800 active:border-b-0 active:translate-y-[6px] active:mt-[6px] transition-all overflow-hidden shadow-xl shadow-blue-900/20 flex items-center px-6 justify-between">
                            <div className="z-10 flex flex-col">
                                <span className="text-[10px] font-black text-blue-200 bg-blue-800/30 px-2 py-0.5 rounded w-fit mb-1">MULTIPLAYER</span>
                                <h3 className="text-xl md:text-2xl font-black text-white leading-none tracking-tight">{t.dashboard.create_room}</h3>
                                <p className="text-xs text-blue-100 font-bold mt-1 opacity-80">Tu manes</p>
                            </div>
                            <span className="text-5xl md:text-6xl filter drop-shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🛋️</span>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                        </Link>

                        <Link href="/join" className="group relative w-full h-28 md:h-32 bg-orange-500 hover:bg-orange-400 rounded-[2rem] border-b-[6px] border-orange-700 active:border-b-0 active:translate-y-[6px] active:mt-[6px] transition-all overflow-hidden shadow-xl shadow-orange-900/20 flex items-center px-6 justify-between">
                            <div className="z-10 flex flex-col">
                                <span className="text-[10px] font-black text-orange-100 bg-orange-700/30 px-2 py-0.5 rounded w-fit mb-1">GUEST</span>
                                <h3 className="text-xl md:text-2xl font-black text-white leading-none tracking-tight">{t.dashboard.join_room}</h3>
                                <p className="text-xs text-orange-100 font-bold mt-1 opacity-80">Tens codi?</p>
                            </div>
                            <span className="text-5xl md:text-6xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">🎫</span>
                        </Link>

                        <Link href="/profile" className="group w-full h-20 bg-white dark:bg-zinc-800 rounded-[1.8rem] border-2 border-gray-200 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg transition-all flex items-center px-6 justify-between mt-2">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-700 rounded-full flex items-center justify-center text-xl group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                    ⚙️
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-purple-600 transition-colors">Ajustar Gustos</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Configuració</span>
                                </div>
                            </div>
                            <span className="text-gray-300 group-hover:translate-x-1 group-hover:text-purple-500 transition-all font-black">→</span>
                        </Link>

                        {/* SECCIÓ DE SALES ACTIVES */}
                        <div className="mt-4">
                            <ActiveRoomsList rooms={userRooms} />
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}