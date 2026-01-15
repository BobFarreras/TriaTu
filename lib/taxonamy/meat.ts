import { MainCategory } from './types';

export const MEAT_CATEGORY: MainCategory = {
  id: 'meat',
  label: 'Carnisseria',
  emoji: '🥩',
  gradient: 'from-red-900/20 to-rose-900/20 border-red-800/30',
  subcategories: [
    // Aus
    { id: 'chicken_breast', label: 'Pit Pollastre', emoji: '🍗', query: 'Pit pollastre' },
    { id: 'chicken_thigh', label: 'Cuixa Pollastre', emoji: '🍗', query: 'Cuixa pollastre' },
    { id: 'chicken_wings', label: 'Aletes', emoji: '🍗', query: 'Aletes pollastre' },
    { id: 'turkey', label: 'Gall d\'indi', emoji: '🦃', query: 'Gall d\'indi fresc' },
    
    // Vedella i Porc
    { id: 'beef_steak', label: 'Bistec Vedella', emoji: '🥩', query: 'Bistec vedella' },
    { id: 'minced_meat', label: 'Carn Picada', emoji: '🍝', query: 'Picada vacum' },
    { id: 'pork_loin', label: 'Llom', emoji: '🐖', query: 'Llom porc' },
    { id: 'sausages', label: 'Salsitxes', emoji: '🌭', query: 'Salsitxes porc' },
    { id: 'burgers', label: 'Hamburgueses', emoji: '🍔', query: 'Burger' },
    { id: 'ribs', label: 'Costelles', emoji: '🍖', query: 'Costella porc' },
  ]
};