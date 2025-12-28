'use client'

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // <---
import { TypewriterText } from './components/TypewriterText';

export function LandingHero() {
  const { t } = useLanguage(); // <---

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4 py-14 overflow-hidden bg-white/50 dark:bg-black/0">

      {/* --- FONS ANIMAT (Es manté igual) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 md:w-96 md:h-96 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-[80px] animate-[float_6s_ease-in-out_infinite] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 md:w-120 md:h-120 bg-yellow-300/30 dark:bg-yellow-500/10 rounded-full blur-[100px] animate-[float_8s_ease-in-out_infinite_reverse] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-64 h-64 bg-pink-300/30 dark:bg-pink-500/20 rounded-full blur-[60px] animate-pulse mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      {/* --- CONTINGUT PRINCIPAL --- */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center gap-6 md:gap-8 mt-10">

        {/* 1. FRASES */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <TypewriterText />
        </div>

        {/* 2. LOGO I TEXTOS */}
        <div className="space-y-4 animate-in zoom-in-50 duration-1000 delay-100">
          <h1 className="text-7xl sm:text-8xl md:text-[9rem] font-black tracking-tighter leading-[0.9] text-gray-900 dark:text-white drop-shadow-2xl filter">
            Decide<span className="text-transparent bg-clip-text bg-linear-to-tr from-green-400 via-emerald-500 to-teal-500 animate-gradient-x">AI</span>
          </h1>

          <p className="text-xl md:text-3xl font-bold text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            <span className="inline-block animate-[wave_2s_infinite] origin-bottom-right">👋</span> {t.landing.hero_title}
            <br className="hidden md:block" />
            <span className="text-gray-400 dark:text-gray-500 font-medium">
               {t.landing.hero_subtitle}
            </span>
          </p>
        </div>

        {/* 4. BOTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 w-full">
          <Link
            href="/login"
            className="w-full sm:w-auto min-w-[200px] px-8 py-5 bg-white dark:bg-zinc-900 text-black dark:text-white font-black text-xl rounded-[2rem] border-4 border-gray-100 dark:border-zinc-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-center"
          >
            {t.landing.btn_login}
          </Link>

          <Link
            href="/register"
            className="group relative w-full sm:w-auto min-w-60 px-8 py-5 bg-black dark:bg-white text-white dark:text-black font-black text-xl rounded-4xl border-b-8 border-gray-800 dark:border-gray-300 active:border-b-0 active:translate-y-2 hover:scale-105 transition-all shadow-2xl shadow-green-500/20 text-center overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
               {t.landing.btn_start}
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-green-400 to-emerald-600 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity"></div>
          </Link>
        </div>

      </div>
    </div>
  );
}