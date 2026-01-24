'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { dictionaries, Locale, Dictionary } from './dictionaries';

interface LanguageContextType {
  locale: Locale;
  t: Dictionary;
  changeLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Per defecte català, però aquí podries llegir localStorage o cookies
  const [locale, setLocale] = useState<Locale>('ca');

  const changeLanguage = (lang: Locale) => {
    setLocale(lang);
    // Opcional: Guardar a localStorage aquí
    // localStorage.setItem('lang', lang); 
  };

  const value = {
    locale,
    t: dictionaries[locale], // Aquí passa la màgia: 't' sempre té l'idioma correcte
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom Hook per fer servir el context fàcilment
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('useLanguage used outside LanguageProvider. Falling back to default locale.');
    }
    return {
      locale: 'ca',
      t: dictionaries.ca,
      changeLanguage: () => {}
    };
  }
  return context;
}
