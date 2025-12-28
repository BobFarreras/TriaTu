// =================== FILE: components/layout/LanguageSwitcher.tsx ===================
'use client'
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  // Icones divertides per cada idioma (temàtica menjar/cultura)
  const icons = {
    // Usem el Castell 🏰 per representar els Castellers (el més proper visualment/semànticament)
    ca: { emoji: '🐲', label: 'CAT', size: 'text-xl' },
    // Truita de patates (Paella 🍳) - La farem gegant amb la classe
    es: { emoji: '💃', label: 'ESP', size: 'text-2xl' },
    // Burger clàssica
    en: { emoji: '🍔', label: 'ENG', size: 'text-xl' },
  };

  return (
    <div className="flex gap-2 p-1.5 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-full border border-white/50 dark:border-white/10 shadow-lg ring-1 ring-black/5">
      {(['ca', 'es', 'en'] as const).map((lang) => {
        const isActive = locale === lang;
        return (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`
              relative group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-out
              ${isActive
                ? 'bg-white dark:bg-zinc-800 shadow-md scale-110 rotate-3 z-10'
                : 'hover:bg-white/50 dark:hover:bg-zinc-800/50 hover:scale-105 grayscale hover:grayscale-0'
              }
            `}
            title={icons[lang].label}
          >
            <span className="text-xl filter drop-shadow-sm">{icons[lang].emoji}</span>

            {/* Indicador actiu (puntet) */}
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
}