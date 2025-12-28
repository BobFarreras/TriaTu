'use client'

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TypewriterText } from './components/TypewriterText';

export function LandingHero() {
  const { t } = useLanguage();

  return (
    // 1. FONS: Eliminat bg-white/50. Ara és transparent o fosc directe.
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4 py-14 overflow-hidden bg-transparent">

      {/* --- FONS ANIMAT (Colors forçats a la versió fosca) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Blob Lila: bg-purple-600/20 i mix-blend-screen */}
        <div className="absolute top-[10%] left-[10%] w-72 h-72 md:w-96 md:h-96 bg-purple-600/20 rounded-full blur-[80px] animate-[float_6s_ease-in-out_infinite] mix-blend-screen"></div>
        
        {/* Blob Groc: bg-yellow-500/10 */}
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 md:w-120 md:h-120 bg-yellow-500/10 rounded-full blur-[100px] animate-[float_8s_ease-in-out_infinite_reverse] mix-blend-screen"></div>
        
        {/* Blob Rosa: bg-pink-500/20 */}
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-[60px] animate-pulse mix-blend-screen"></div>
      </div>

      {/* --- CONTINGUT PRINCIPAL --- */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center gap-6 md:gap-8 mt-10">

        {/* 1. FRASES */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <TypewriterText />
        </div>

        {/* 2. LOGO I TEXTOS */}
        <div className="space-y-4 animate-in zoom-in-50 duration-1000 delay-100">
          {/* TÍTOL: Forçat a text-white */}
          <h1 className="text-7xl sm:text-8xl md:text-[9rem] font-black tracking-tighter leading-[0.9] text-white drop-shadow-2xl filter">
            Tria<span className="text-transparent bg-clip-text bg-linear-to-tr from-green-400 via-emerald-500 to-teal-500 animate-gradient-x">Tu</span>
          </h1>

          {/* SUBTÍTOL: Forçat a text-gray-300 */}
          <p className="text-xl md:text-3xl font-bold text-gray-300 max-w-2xl mx-auto">
            <span className="inline-block animate-[wave_2s_infinite] origin-bottom-right">👋</span> {t.landing.hero_title}
            <br className="hidden md:block" />
            
            {/* TEXT PETIT: Forçat a text-gray-500 */}
            <span className="text-gray-500 font-medium">
               {t.landing.hero_subtitle}
            </span>
          </p>
        </div>

        {/* 4. BOTONS (Aquí és on més es notava el canvi) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 w-full">
          
          {/* BOTÓ LOGIN: Sempre fosc (bg-zinc-900, text-white) */}
          <Link
            href="/login"
            className="w-full sm:w-auto min-w-50 px-8 py-5 bg-zinc-900 text-white font-black text-xl rounded-4xl border-4 border-zinc-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-center"
          >
            {t.landing.btn_login}
          </Link>

          {/* BOTÓ REGISTER: Sempre blanc (bg-white, text-black) per contrastar */}
          <Link
            href="/register"
            className="group relative w-full sm:w-auto min-w-60 px-8 py-5 bg-white text-black font-black text-xl rounded-4xl border-b-8 border-gray-300 active:border-b-0 active:translate-y-2 hover:scale-105 transition-all shadow-2xl shadow-green-500/20 text-center overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
               {t.landing.btn_start}
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-green-400 to-emerald-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </Link>
        </div>

      </div>
    </div>
  );
}