'use client'

import React, { createContext, useContext, useState } from 'react';
import { dictionaries, Locale } from './dictionaries';

type LanguageContextType = {
  locale: Locale;
  t: typeof dictionaries['en']; // Usem l'anglès com a tipus base
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ca'); // Català per defecte

  return (
    <LanguageContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}