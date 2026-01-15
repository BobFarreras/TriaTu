import { MainCategory } from './types';

export const FISH_CATEGORY: MainCategory = {
  id: 'fish',
  label: 'Peixateria',
  emoji: '🐟',
  gradient: 'from-blue-900/20 to-cyan-900/20 border-blue-800/30',
  subcategories: [
    { id: 'salmon', label: 'Salmó', emoji: '🍣', query: 'Salmó fresc' },
    { id: 'hake', label: 'Lluç', emoji: '🐟', query: 'Lluç fresc' },
    { id: 'cod', label: 'Bacallà', emoji: '🐟', query: 'Bacallà' },
    { id: 'tuna', label: 'Tonyina', emoji: '🦈', query: 'Tonyina fresca' },
    { id: 'prawns', label: 'Gambes', emoji: '🦐', query: 'Gamba' },
    { id: 'mussels', label: 'Musclos', emoji: '🦪', query: 'Musclos' },
    { id: 'squid', label: 'Sípia/Calamar', emoji: '🦑', query: 'Sípia bruta' },
    { id: 'sushi', label: 'Sushi', emoji: '🍱', query: 'Sushi' },
  ]
};