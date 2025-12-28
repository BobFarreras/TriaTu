'use client'

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function TypewriterText() {
  const { t } = useLanguage();
  const phrases = t.landing.phrases;

  const [index, setIndex] = useState(0);
  const [animClass, setAnimClass] = useState('opacity-0 scale-90 translate-y-4');

  // ELIMINEM el useEffect que feia setIndex(0). No cal.

  useEffect(() => {
    // Animació d'entrada inicial
    const initialTimeout = setTimeout(() => setAnimClass('opacity-100 scale-100 translate-y-0'), 100);

    const interval = setInterval(() => {
      // 1. Sortida
      setAnimClass('opacity-0 scale-110 -rotate-3 blur-sm');

      setTimeout(() => {
        // 2. Canvi de text (incrementem infinitament, el % ho arreglarà al render)
        setIndex((prev) => prev + 1); 
        
        // 3. Reset posició
        setAnimClass('opacity-0 scale-50 translate-y-8');
        
        // 4. Entrada
        setTimeout(() => {
            setAnimClass('opacity-100 scale-100 translate-y-0 rotate-0 blur-0');
        }, 50);

      }, 600); 

    }, 3500); 

    return () => {
        clearInterval(interval);
        clearTimeout(initialTimeout);
    };
  }, []); // Dependències buides: el timer va per lliure

  // MÀGIA AQUÍ: Usem el mòdul (%) per assegurar que l'índex és vàlid
  // Si index és 10 i tenim 5 frases, 10 % 5 = 0. Mai fallarà.
  const safeIndex = index % phrases.length;
  const currentPhrase = phrases[safeIndex];

  // Safety check extra
  if (!currentPhrase) return null; 

  return (
    <div className="h-28 md:h-32 flex items-center justify-center w-full perspective-500">
      <div 
        className={`
            text-3xl md:text-5xl font-black italic
            transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform text-center px-4 leading-tight
            flex flex-col md:flex-row items-center justify-center gap-3
            ${animClass}
        `}
      >
        <span 
          className="text-transparent bg-clip-text bg-linear-to-r from-gray-400 to-gray-600 dark:from-gray-300 dark:to-gray-500"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          "{currentPhrase.text}"
        </span>

        <span className="filter drop-shadow-md transform hover:scale-125 transition-transform duration-300">
          {currentPhrase.emoji}
        </span>
      </div>
    </div>
  );
}