import { MainCategory } from './types';

export const CHARCUTERIE_CATEGORY: MainCategory = {
  id: 'charcuterie',
  label: 'Xarcuteria',
  emoji: '🥓',
  gradient: 'from-pink-900/20 to-rose-800/20 border-pink-800/30',
  subcategories: [
    { id: 'ham_sweet', label: 'Pernil Dolç', emoji: '🥪', query: 'Pernil cuit' },
    { id: 'turkey_breast', label: 'Pit Gall D\'indi', emoji: '🦃', query: 'Pit gall indi llesques' },
    { id: 'serrano', label: 'Pernil Salat', emoji: '🍖', query: 'Pernil serrano' },
    { id: 'fuet', label: 'Fuet/Llonganissa', emoji: '🥖', query: 'Fuet' },
    { id: 'chorizo', label: 'Xoriço', emoji: '🌭', query: 'Xoriço' },
    { id: 'frankfurt', label: 'Frankfurt', emoji: '🌭', query: 'Frankfurt' },
    { id: 'pate', label: 'Paté', emoji: '🍞', query: 'Paté' },
  ]
};