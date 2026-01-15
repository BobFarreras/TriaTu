import { MainCategory } from './types';

export const FRUIT_CATEGORY: MainCategory = {
  id: 'fruit',
  label: 'Fruita',
  emoji: '🍎',
  gradient: 'from-red-900/30 to-orange-900/30 border-red-800/40',
  subcategories: [
    // Bàsics
    { id: 'banana', label: 'Plàtan', emoji: '🍌', query: 'Plàtan' },
    { id: 'apple_golden', label: 'Poma Golden', emoji: '🍏', query: 'Poma Golden' },
    { id: 'apple_red', label: 'Poma Vermella', emoji: '🍎', query: 'Poma Fuji' }, // Més específic
    { id: 'pear', label: 'Pera', emoji: '🍐', query: 'Pera conferència' },
    
    // Cítrics
    { id: 'orange', label: 'Taronja', emoji: '🍊', query: 'Taronja taula' },
    { id: 'mandarin', label: 'Mandarina', emoji: '🍊', query: 'Mandarina' },
    { id: 'lemon', label: 'Llimona', emoji: '🍋', query: 'Llimona' },
    
    // Vermells i Bosc
    { id: 'strawberry', label: 'Maduixes', emoji: '🍓', query: 'Maduixot' },
    { id: 'cherry', label: 'Cireres', emoji: '🍒', query: 'Cirera' },
    { id: 'berries', label: 'Nabius/Gerds', emoji: '🫐', query: 'Nabius' },
    
    // Tropical
    { id: 'avocado', label: 'Alvocat', emoji: '🥑', query: 'Alvocat' },
    { id: 'kiwi', label: 'Kiwi', emoji: '🥝', query: 'Kiwi' },
    { id: 'mango', label: 'Mango', emoji: '🥭', query: 'Mango' },
    { id: 'pineapple', label: 'Pinya', emoji: '🍍', query: 'Pinya natural' },
    
    // Estacionals
    { id: 'melon', label: 'Meló', emoji: '🍈', query: 'Meló' },
    { id: 'watermelon', label: 'Sindria', emoji: '🍉', query: 'Sindria' },
    { id: 'peach', label: 'Préssec', emoji: '🍑', query: 'Préssec' },
    { id: 'grape', label: 'Raïm', emoji: '🍇', query: 'Raïm' }
  ]
};