// src/features/dashboard/ui/DashboardContent.tsx
'use client';

import { useState } from 'react';
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
    // Estat local per controlar el desplegable. 
    // UX: Per defecte tancat per veure tot el dashboard net, o obert si volem acció directa?
    // Decisió: Tancat per prioritzar la "vista de comandament" completa.
    const [isQuickModeOpen, setQuickModeOpen] = useState(false);

    return (
        <main className="min-h-dvh w-full p-4 md:p-6 flex flex-col relative bg-[#131f24] bg-gamified-pattern selection:bg-purple-500 selection:text-white overflow-y-auto md:overflow-hidden">

            {/* DECORACIÓ DE FONS */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000"></div>

            {/* HEADER */}
            <header className="w-full max-w-6xl mx-auto flex justify-between items-center z-50 shrink-0 mb-6 md:mb-4">
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800 shadow-sm animate-in slide-in-from-top-4">
                    <div className="w-8 h-8 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-lg shadow-inner">
                        👽
                    </div>
                    <span className="font-black text-sm text-gray-200">
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
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-1">
                                Hola, <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-500">Mestre!</span> 👋
                            </h1>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest pl-1">
                                {t.dashboard.level || "QUÈ TOCA FER AVUI?"}
                            </p>
                        </div>

                        {/* DESPLEGABLE MODE RÀPID */}
                        {/* Utilitzem un div interactiu que canvia l'estat */}
                        <div 
                            className={`
                                bg-zinc-900/90 backdrop-blur-xl rounded-[2.5rem] border-4 border-zinc-800 shadow-2xl relative overflow-hidden group transition-all duration-500 ease-in-out
                                ${isQuickModeOpen ? 'ring-4 ring-purple-500/20' : 'hover:border-zinc-700 cursor-pointer'}
                            `}
                        >
                            {/* Barra decorativa superior */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x"></div>
                            
                            {/* HEADER DEL DESPLEGABLE (Sempre visible) */}
                            <div 
                                className="p-6 md:p-8 flex items-center justify-between relative z-10"
                                onClick={() => setQuickModeOpen(!isQuickModeOpen)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isQuickModeOpen ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'bg-purple-900/30 text-purple-400'}`}>
                                        <span className="text-2xl">⚡</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-xl md:text-2xl text-white uppercase tracking-wide">Mode Ràpid</span>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {isQuickModeOpen ? 'Configuració oberta' : 'Fes clic per desplegar'}
                                        </span>
                                    </div>
                                </div>

                                {/* Fletxa indicadora estat */}
                                <div className={`w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 transition-transform duration-300 ${isQuickModeOpen ? 'rotate-180 bg-zinc-700 text-white' : ''}`}>
                                    ▼
                                </div>
                            </div>
                            
                            {/* CONTINGUT (Animate Height) */}
                            <div 
                                className={`
                                    overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out
                                    ${isQuickModeOpen ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'}
                                `}
                            >
                                <div className="px-6 md:px-8 pb-8 pt-0">
                                    <div className="h-px w-full bg-zinc-800 mb-6"></div>
                                    <IndividualDecisionForm userId={userId} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DRETA: BOTONS + SALES */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-700 delay-100">
                        
                        <div className="hidden lg:block h-22"></div> 

                        {/* 1. CREATE ROOM */}
                        <Link href="/rooms/create" className="group relative w-full h-24 md:h-28 bg-blue-600 hover:bg-blue-500 rounded-3xl border-b-[6px] border-blue-800 active:border-b-0 active:translate-y-1.5 active:mt-1.5 transition-all overflow-hidden shadow-xl shadow-blue-900/20 flex items-center px-6 justify-between">
                            <div className="z-10 flex flex-col">
                                <span className="text-[10px] font-black text-blue-200 bg-blue-800/30 px-2 py-0.5 rounded w-fit mb-1">MULTIPLAYER</span>
                                <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.create_room}</h3>
                            </div>
                            <span className="text-4xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🛋️</span>
                        </Link>

                        {/* 2. JOIN ROOM */}
                        <Link href="/join" className="group relative w-full h-24 md:h-28 bg-orange-500 hover:bg-orange-400 rounded-3xl border-b-[6px] border-orange-700 active:border-b-0 active:translate-y-1.5 active:mt-1.5 transition-all overflow-hidden shadow-xl shadow-orange-900/20 flex items-center px-6 justify-between">
                            <div className="z-10 flex flex-col">
                                <span className="text-[10px] font-black text-orange-100 bg-orange-700/30 px-2 py-0.5 rounded w-fit mb-1">GUEST</span>
                                <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.join_room}</h3>
                            </div>
                            <span className="text-4xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">🎫</span>
                        </Link>

                        {/* 3. INVENTORY (NOU) */}
                        {/* Dissenyat en verd maragda per temàtica de menjar/recursos */}
                        <Link href="/inventory" className="group w-full h-20 bg-emerald-900/40 rounded-2xl border-2 border-emerald-800/50 hover:bg-emerald-800/40 hover:border-emerald-500 hover:shadow-lg transition-all flex items-center px-5 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-800/50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                    📦
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-emerald-100 text-sm group-hover:text-white transition-colors">El meu Inventari</span>
                                    <span className="text-[10px] text-emerald-400/70 font-bold uppercase tracking-wide">Ingredients & Plats</span>
                                </div>
                            </div>
                            <span className="text-emerald-500 group-hover:translate-x-1 group-hover:text-emerald-300 transition-all font-black">→</span>
                        </Link>

                        {/* 4. PROFILE */}
                        <Link href="/profile" className="group w-full h-20 bg-zinc-800 rounded-2xl border-2 border-zinc-700 hover:border-purple-500 hover:shadow-lg transition-all flex items-center px-5 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center text-xl group-hover:bg-purple-900/50 group-hover:text-purple-400 transition-colors">
                                    ⚙️
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">Ajustar Gustos</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Configuració</span>
                                </div>
                            </div>
                            <span className="text-gray-500 group-hover:translate-x-1 group-hover:text-purple-500 transition-all font-black">→</span>
                        </Link>

                        {/* SECCIÓ DE SALES ACTIVES */}
                        <div className="mt-2">
                            <ActiveRoomsList rooms={userRooms} />
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}