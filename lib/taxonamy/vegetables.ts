import { MainCategory } from './types';

export const VEGETABLES_CATEGORY: MainCategory = {
  id: 'vegetables',
  label: 'Verdura',
  emoji: '🥦',
  gradient: 'from-green-900/30 to-emerald-900/30 border-green-800/40',
  subcategories: [
    // Bàsics Cuina
    { id: 'potato', label: 'Patates', emoji: '🥔', query: 'Patata malla' },
    { id: 'onion', label: 'Cebes', emoji: '🧅', query: 'Ceba seca' },
    { id: 'garlic', label: 'Alls', emoji: '🧄', query: 'Alls' },
    { id: 'carrot', label: 'Pastanaga', emoji: '🥕', query: 'Pastanaga' },
    
    // Amanida
    { id: 'lettuce', label: 'Enciam', emoji: '🥬', query: 'Enciam' },
    { id: 'tomato', label: 'Tomàquet', emoji: '🍅', query: 'Tomàquet amanida' },
    { id: 'tomato_cherry', label: 'Cherry', emoji: '🍅', query: 'Tomàquet cherry' },
    { id: 'cucumber', label: 'Cogombre', emoji: '🥒', query: 'Cogombre' },
    
    // Cuinar
    { id: 'zucchini', label: 'Carbassó', emoji: '🥒', query: 'Carbassó' },
    { id: 'eggplant', label: 'Albergínia', emoji: '🍆', query: 'Albergínia' },
    { id: 'pepper_red', label: 'Pebrot Vermell', emoji: '🌶️', query: 'Pebrot vermell' },
    { id: 'pepper_green', label: 'Pebrot Verd', emoji: '🫑', query: 'Pebrot verd' },
    { id: 'broccoli', label: 'Bròquil', emoji: '🥦', query: 'Bròquil' },
    { id: 'cauliflower', label: 'Coliflor', emoji: '🥦', query: 'Coliflor' },
    { id: 'green_beans', label: 'Mongeta Verda', emoji: '🫛', query: 'Mongeta tendra' },
    { id: 'mushrooms', label: 'Bolets', emoji: '🍄', query: 'Xampinyons' },
    { id: 'spinach', label: 'Espinacs', emoji: '🍃', query: 'Espinacs frescos' },
    { id: 'pumpkin', label: 'Carbassa', emoji: '🎃', query: 'Carbassa' },
  ]
};