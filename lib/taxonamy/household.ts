import { MainCategory } from './types';

export const HOUSEHOLD_CATEGORY: MainCategory = {
  id: 'household',
  label: 'Llar i Higiene',
  emoji: '🧹',
  gradient: 'from-gray-800 to-slate-800 border-slate-600',
  subcategories: [
    // Neteja Llar
    { id: 'detergent', label: 'Detergent Roba', emoji: '👕', query: 'Detergent roba' },
    { id: 'softener', label: 'Suavitzant', emoji: '🌸', query: 'Suavitzant' },
    { id: 'dishwasher', label: 'Rentavaixelles', emoji: '🍽️', query: 'Rentavaixelles' },
    { id: 'cleaning', label: 'Netejadors', emoji: '🧼', query: 'Netejador llar' },
    { id: 'paper', label: 'Paper WC/Cuina', emoji: '🧻', query: 'Paper higiènic' },
    
    // Higiene Personal
    { id: 'shower', label: 'Gel/Xampú', emoji: '🚿', query: 'Gel bany' },
    { id: 'dental', label: 'Dental', emoji: '🦷', query: 'Pasta dents' },
    { id: 'deo', label: 'Desodorant', emoji: '🧴', query: 'Desodorant' },
    
    // Nadons
    { id: 'baby_food', label: 'Menjar Nadó', emoji: '👶', query: 'Potet' },
    { id: 'diapers', label: 'Bolquers', emoji: '👶', query: 'Bolquers' },
    
    // Mascotes
    { id: 'cat', label: 'Gats', emoji: '🐱', query: 'Menjar gat' },
    { id: 'dog', label: 'Gossos', emoji: '🐶', query: 'Menjar gos' },
  ]
};