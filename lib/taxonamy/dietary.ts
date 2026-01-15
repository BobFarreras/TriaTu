import { MainCategory } from './types';

export const DIETARY_CATEGORY: MainCategory = {
  id: 'dietary',
  label: 'Dietes i Bio',
  emoji: '🌿',
  gradient: 'from-teal-900/30 to-green-800/30 border-teal-500/40',
  subcategories: [
    { id: 'eco', label: 'Ecològic', emoji: '🌱', query: 'Ecològic' },
    { id: 'gluten_free', label: 'Sense Gluten', emoji: '🌾', query: 'Sense gluten' },
    { id: 'lactose_free', label: 'Sense Lactosa', emoji: '🥛', query: 'Sense lactosa' },
    { id: 'vegan', label: 'Vegà', emoji: '🥬', query: 'Vegetal' },
    { id: 'protein', label: 'Proteïna +', emoji: '💪', query: 'Proteïna' },
    { id: 'diet', label: 'Dietètic', emoji: '📉', query: 'Integral' },
  ]
};