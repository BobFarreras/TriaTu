'use client'

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { signOutAction } from '@/app/actions/auth-actions';
import Link from 'next/link';

interface Props {
  userName: string;
}

export function UserDropdown({ userName }: Props) {
  const { t, locale, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const icons = {
    ca: { emoji: '🐲', label: 'Català' },
    es: { emoji: '🍳', label: 'Español' },
    en: { emoji: '🍔', label: 'English' },
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* BOTÓ HAMBURGUESA ANIMAT (Sempre Fosc) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group bg-zinc-900 p-3 rounded-2xl border-2 border-zinc-700 hover:border-zinc-500 transition-all active:scale-95 shadow-sm"
      >
        <div className="w-5 h-5 flex flex-col justify-center items-end gap-1">
            {/* Línies blanques (bg-white) */}
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'w-5 rotate-45 translate-y-1.5' : 'w-5'}`}></span>
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'w-0 opacity-0' : 'w-3 group-hover:w-5'}`}></span>
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'w-5 -rotate-45 -translate-y-1.5' : 'w-4 group-hover:w-5'}`}></span>
        </div>
      </button>

      {/* MENÚ DESPLEGABLE (Fosc) */}
      {isOpen && (
        <div className="absolute right-0 top-14 w-72 bg-zinc-900 rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-2 border-zinc-800 p-4 z-50 animate-in slide-in-from-top-2 fade-in duration-200 origin-top-right">
          
          {/* INFO USUARI */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-zinc-800">
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-lg animate-bounce-click">
                😎
            </div>
            <div className="overflow-hidden">
                <p className="font-black text-white truncate text-sm">{userName}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Jugador</p>
            </div>
          </div>

          {/* MENÚ PERFIL */}
          <Link 
            href="/profile" 
            className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-zinc-800 transition-colors group mb-4 border border-transparent hover:border-zinc-700"
            onClick={() => setIsOpen(false)}
          >
              <span className="bg-purple-900/30 text-purple-400 p-2 rounded-xl text-sm group-hover:scale-110 transition-transform">👤</span>
              <span className="text-sm font-bold text-gray-300 group-hover:text-purple-400 transition-colors">El meu Perfil</span>
          </Link>

          {/* SELECTOR D'IDIOMA (Amb Emojis) */}
          <div className="mb-4 bg-black/20 p-2 rounded-2xl border border-zinc-800">
            <div className="flex justify-between gap-1">
              {(['ca', 'es', 'en'] as const).map((lang) => {
                const isActive = locale === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`
                      relative flex-1 py-2 rounded-xl text-2xl transition-all duration-200 border-2
                      ${isActive 
                        ? 'bg-zinc-700 border-zinc-600 shadow-sm scale-105 z-10' 
                        : 'border-transparent hover:bg-zinc-800 hover:scale-105 grayscale hover:grayscale-0 opacity-60 hover:opacity-100'
                      }
                    `}
                    title={icons[lang].label}
                  >
                    <span className="filter drop-shadow-sm">{icons[lang].emoji}</span>
                    
                    {/* Puntet indicador */}
                    {isActive && (
                      <span className="absolute bottom-1 right-1/2 translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => signOutAction()}
            className="w-full flex items-center justify-center gap-2 bg-red-900/10 hover:bg-red-900/20 text-red-400 py-3 rounded-2xl font-black text-xs transition-colors border border-transparent hover:border-red-900/50"
          >
            TANCAR SESSIÓ
          </button>
        </div>
      )}
    </div>
  );
}