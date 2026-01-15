import { MainCategory } from './types';

export const MEAT_CATEGORY: MainCategory = {
  id: 'meat',
  label: 'Carnisseria',
  emoji: '🥩',
  gradient: 'from-red-900/20 to-rose-900/20 border-red-800/30',
  subcategories: [
    // --- 🐔 POLLASTRE I AUS ---
    { 
      id: 'chicken_breast', 
      label: 'Pit de Pollastre', 
      emoji: '🍗', 
      query: ['Pit pollastre', 'Filet de pollastre', 'Pit de gall d\'indi'], 
      mustContain: ['pit', 'filet'],
      exclude: [
        'embotit', 'cuit', 'brasa', 'fiambre', 'llesques', 'arrebossat', 
        'croquetes', 'canelons', 'brou', 'sopa', 'gat', 'gos', 'piz'
      ] 
    },
    { 
      id: 'chicken_thigh', 
      label: 'Cuixes', 
      emoji: '🍗', 
      query: ['Cuixa pollastre', 'Pernilets pollastre', 'Contra cuixa'], 
      mustContain: ['cuixa', 'pernilet'],
      exclude: ['farcit', 'congelat', 'preparat', 'canelons', 'brou']
    },
    { 
      id: 'chicken_wings', 
      label: 'Aletes', 
      emoji: '🍗', 
      query: 'Aletes pollastre', 
      mustContain: 'Ales',
      exclude: ['barbacoa', 'cuites', 'congelat', 'adobades'] 
    },
    { 
      id: 'chicken_whole', 
      label: 'Pollastre Sencer', 
      emoji: '🐓', 
      query: ['Pollastre sencer', 'Pollastre net'], 
      mustContain: 'pollastre',
      exclude: ['a l\'ast', 'cuit', 'farcit', 'brou', 'croquetes'] 
    },
    { 
      id: 'breaded', 
      label: 'Arrebossats/Nuggets', 
      emoji: '🍘', 
      query: ['Pollastre arrebossat', 'Nuggets'], 
      exclude: ['congelat', 'vegetal']
    },

    // --- 🥩 VEDELLA ---
    { 
      id: 'beef_steak', 
      label: 'Bistec/Entrecot', 
      emoji: '🥩', 
      query: ['Bistec vedella', 'Entrecot vedella', 'Filet vedella'], 
      mustContain: ['bistec', 'entrecot', 'filet'],
      exclude: ['hamburguesa', 'carpaccio', 'congelat', 'brou', 'pastilla']
    },
    { 
      id: 'beef_stew', 
      label: 'Vedella Estofar', 
      emoji: '🥘', 
      query: ['Estofat de vedella'], 
      exclude: ['cuinat', 'brou', 'conserva']
    },

    // --- 🐖 PORC ---
    { 
      id: 'pork_loin', 
      label: 'Llom', 
      emoji: '🐖', 
      query: ['Llom porc', 'Cinta de llom'], 
      mustContain: 'llom',
      exclude: ['embotit', 'curat', 'cuit', 'cap de llom', 'adobat', 'fumat', 'llesques'] 
    },
    { 
      id: 'pork_ribs', 
      label: 'Costelles', 
      emoji: '🍖', 
      query: ['Costella porc', 'Costelló'], 
      mustContain: ['costella', 'costelló'], // ✅ Vital per evitar "Sal Costa"
      exclude: ['barbacoa', 'adobat', 'cuit'] 
    },
    { 
      id: 'sausages', 
      label: 'Botifarres/Salsitxes', 
      emoji: '🌭', 
      query: ['Botifarra crua', 'Salsitxes porc', 'Salsitxes pollastre', 'Llonganissa fresca'], 
      exclude: ['frankfurt', 'cuit', 'curada', 'sec', 'fuet', 'vegana'] 
    },

    // --- 🍔 PREPARATS I PICADA ---
    { 
      id: 'minced_meat', 
      label: 'Carn Picada', 
      emoji: '🍝', 
      query: ['Carn picada', 'Picada mixta', 'Picada vedella', 'Picada pollastre'], 
      mustContain: 'picada',
      exclude: ['congelada', 'bolognesa', 'salsa']
    },
    { 
      id: 'burgers', 
      label: 'Hamburgueses', 
      emoji: '🍔', 
      query: ['Burger meat', 'Hamburguesa vedella', 'Hamburguesa pollastre'], 
      mustContain: ['burger', 'hamburguesa'],
      exclude: ['pa', 'vegetal', 'vegana', 'congelada', 'mc', 'ketchup'] 
    },

    // --- 🐑 TRADICIONAL ---
    { 
      id: 'lamb', 
      label: 'Xai', 
      emoji: '🐑', 
      query: ['Costelles xai', 'Cuixa xai', 'Espatlla xai'], 
      mustContain: 'xai',
      exclude: ['congelat']
    },
    { 
      id: 'rabbit', 
      label: 'Conill', 
      emoji: '🐇', 
      query: ['Conill sencer', 'Conill trossejat', 'Espatlla conill'], 
      mustContain: 'conill',
      exclude: ['menjar', 'gat', 'gos'] 
    }
  ]
};