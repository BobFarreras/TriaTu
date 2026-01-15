import { MainCategory } from './types';

export const PANTRY_CATEGORY: MainCategory = {
  id: 'pantry',
  label: 'Rebost',
  emoji: '🥫',
  gradient: 'from-amber-900/20 to-yellow-900/20 border-amber-800/30',
  subcategories: [
    // Bàsics
    { id: 'oil', label: 'Oli Oliva', emoji: '🫒', query: 'Oli oliva verge' },
    { id: 'sunflower', label: 'Oli Gira-sol', emoji: '🌻', query: 'Oli gira-sol' },
    { id: 'pasta', label: 'Pasta', emoji: '🍝', query: 'Pasta' },
    { id: 'rice', label: 'Arròs', emoji: '🍚', query: 'Arròs' },
    { id: 'legumes', label: 'Llegums', emoji: '🫘', query: 'Cigrons cuits' },
    { id: 'sauce', label: 'Tomàquet/Salses', emoji: '🥫', query: 'Tomàquet fregit' },
    
    // Pa i Esmorzar
    { id: 'bread', label: 'Pa', emoji: '🥖', query: 'Pa barra' },
    { id: 'sliced_bread', label: 'Pa Motlle', emoji: '🍞', query: 'Pa motlle' },
    { id: 'cookies', label: 'Galetes', emoji: '🍪', query: 'Galetes' },
    { id: 'cereals', label: 'Cereals', emoji: '🥣', query: 'Cereals esmorzar' },
    { id: 'coffee', label: 'Cafè', emoji: '☕', query: 'Cafè molt' },
    { id: 'cocoa', label: 'Cacau', emoji: '🍫', query: 'Cacau pols' },
    
    // Conserves
    { id: 'tuna_can', label: 'Tonyina', emoji: '🐟', query: 'Tonyina oli' },
    { id: 'olives', label: 'Olives', emoji: '🫒', query: 'Olives' },
    { id: 'soup', label: 'Brou/Sopes', emoji: '🍲', query: 'Brou pollastre' },
    
    // Condiments
    { id: 'salt', label: 'Sal/Espècies', emoji: '🧂', query: 'Sal cuina' },
    { id: 'sugar', label: 'Sucre', emoji: '🍬', query: 'Sucre' },
    { id: 'sauces', label: 'Maionesa/Kètxup', emoji: '🌭', query: 'Maionesa' },
  ]
};