import { MainCategory } from './types';

export const DAIRY_CATEGORY: MainCategory = {
  id: 'dairy',
  label: 'Làctics i Ous',
  emoji: '🧀',
  gradient: 'from-amber-100/10 to-orange-100/10 border-orange-200/20',
  subcategories: [
    // Llet
    { id: 'milk_whole', label: 'Llet Sencera', emoji: '🥛', query: 'Llet sencera' },
    { id: 'milk_semi', label: 'Llet Semi', emoji: '🥛', query: 'Llet semidesnatada' },
    { id: 'milk_veg', label: 'Beguda Vegetal', emoji: '🌱', query: 'Beguda civada' },
    
    // Iogurts
    { id: 'yogurt', label: 'Iogurt Natural', emoji: '🥣', query: 'Iogurt natural' },
    { id: 'yogurt_flav', label: 'Iogurt Sabors', emoji: '🍓', query: 'Iogurt maduixa' },
    { id: 'dessert', label: 'Postres', emoji: '🍮', query: 'Natilles' },
    
    // Formatges
    { id: 'cheese_fresh', label: 'Formatge Fresc', emoji: '🧀', query: 'Formatge fresc' },
    { id: 'cheese_sliced', label: 'Formatge Talls', emoji: '🥪', query: 'Formatge talls' },
    { id: 'cheese_cured', label: 'Formatge Curat', emoji: '🧀', query: 'Formatge curat' },
    { id: 'cheese_grated', label: 'Formatge Ratllat', emoji: '🍝', query: 'Formatge ratllat' },
    
    // Altres
    { id: 'eggs', label: 'Ous', emoji: '🥚', query: 'Ous' },
    { id: 'butter', label: 'Mantega', emoji: '🧈', query: 'Mantega' },
    { id: 'cream', label: 'Nata Cuina', emoji: '🥘', query: 'Nata cuinar' },
  ]
};