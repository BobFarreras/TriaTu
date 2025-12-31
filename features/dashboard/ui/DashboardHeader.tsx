'use client';

import { useState, useRef, useEffect } from 'react';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { signOutAction } from '@/app/actions/auth-actions';

interface Props {
  userName: string;
}

export function DashboardHeader({ userName }: Props) {
  const { t, changeLanguage, locale } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const langs = [
    { code: 'ca', emoji: '🐲', label: 'CAT' },
    { code: 'es', emoji: '🍳', label: 'ESP' },
    { code: 'en', emoji: '🍔', label: 'ENG' },
  ] as const;

  const currentLang = langs.find(l => l.code === locale) || langs[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // ✅ ADDED: relative i z-50 al header per establir context d'apilament
    <header className="relative z-50 w-full flex flex-nowrap items-center justify-between gap-2 mb-2 animate-in fade-in slide-in-from-top-4 duration-500 pt-2">
      
      {/* ESQUERRA */}
      <div className="flex items-center gap-3 min-w-0 overflow-hidden pr-2">
        <div className="flex flex-col min-w-0">
             <div className="flex items-baseline gap-2 min-w-0">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none truncate">
                    Hola, <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">{userName}</span>
                </h1>
                <span className="text-xl animate-wave origin-bottom-right">👋</span>
             </div>
             <div className="flex mt-0.5">
                <span className="text-[9px] font-black text-emerald-400 bg-emerald-900/40 px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase tracking-widest shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                    {t.dashboard.level || "LVL 1"}
                </span>
             </div>
        </div>
      </div>

      {/* DRETA */}
      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10 shrink-0">
        
        {/* 1. DESPLEGABLE IDIOMA */}
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg transition-all border border-transparent ${isLangOpen ? 'bg-zinc-700 border-zinc-500' : 'hover:bg-zinc-800'}`}
            >
                {currentLang.emoji}
            </button>

            {/* ✅ FIX: z-[100] per assegurar que quedi per sobre de tot */}
            {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-zinc-700 p-1.5 rounded-xl shadow-2xl flex flex-col gap-1 z-100 min-w-12.5 animate-in zoom-in-95 duration-200">
                    {langs.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => { changeLanguage(l.code); setIsLangOpen(false); }}
                            className={`w-full p-2 rounded-lg text-lg hover:bg-zinc-800 transition-colors flex justify-center ${locale === l.code ? 'bg-zinc-800 border border-zinc-600' : ''}`}
                        >
                            {l.emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>

        <div className="w-px h-5 bg-white/10 mx-0.5"></div>

     

        {/* 3. LOGOUT */}
        <button
            onClick={() => signOutAction()}
            className="w-9 h-9 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center border-b-[3px] border-red-900 active:border-b-0 active:translate-y-1 transition-all group"
        >
            <span className="text-base group-hover:-translate-x-0.5 transition-transform text-white font-bold">🚪</span>
        </button>
      </div>
    </header>
  );
}