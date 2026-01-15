import { MainCategory } from './types';

export const FROZEN_CATEGORY: MainCategory = {
  id: 'frozen',
  label: 'Congelats',
  emoji: '❄️',
  gradient: 'from-cyan-900/20 to-sky-900/20 border-cyan-800/30',
  subcategories: [
    { id: 'pizza', label: 'Pizza', emoji: '🍕', query: 'Pizza' },
    { id: 'veggies', label: 'Verdura', emoji: '🥦', query: 'Verdura congelada' },
    { id: 'chips', label: 'Patates Fregir', emoji: '🍟', query: 'Patates pre-fregides' },
    { id: 'fish', label: 'Peix/Marisc', emoji: '🐟', query: 'Peix congelat' },
    { id: 'croquettes', label: 'Croquetes', emoji: '🥟', query: 'Croquetes' },
    { id: 'icecream', label: 'Gelats', emoji: '🍦', query: 'Gelat' },
    { id: 'meals', label: 'Plats Preparats', emoji: '🥘', query: 'Lassanya congelada' },
  ]
};