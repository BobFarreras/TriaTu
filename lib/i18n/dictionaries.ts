import { ca } from './locales/ca';
import { es } from './locales/es';
import { en } from './locales/en';

export type Locale = 'ca' | 'es' | 'en';

export const dictionaries = {
  ca,
  es,
  en
};

// Aquest tipus assegura que si afegeixes una clau a 'ca',
// TypeScript t'obligarà a posar-la a 'es' i 'en'.
export type Dictionary = typeof ca;