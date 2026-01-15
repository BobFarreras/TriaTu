import { MainCategory } from './types';

export const DRINKS_CATEGORY: MainCategory = {
  id: 'drinks',
  label: 'Begudes',
  emoji: '🧃',
  gradient: 'from-purple-900/20 to-indigo-900/20 border-purple-800/30',
  subcategories: [
    { id: 'water', label: 'Aigua', emoji: '💧', query: 'Aigua mineral' },
    { id: 'soda', label: 'Refrescos', emoji: '🥤', query: 'Refresc' },
    { id: 'cola', label: 'Cola', emoji: '🥤', query: 'Refresc cola' },
    { id: 'beer', label: 'Cervesa', emoji: '🍺', query: 'Cervesa' },
    { id: 'wine', label: 'Vi', emoji: '🍷', query: 'Vi negre' },
    { id: 'juice', label: 'Sucs', emoji: '🍊', query: 'Suc' },
    { id: 'alcohol', label: 'Licors', emoji: '🥃', query: 'Ginebra' },
  ]
};