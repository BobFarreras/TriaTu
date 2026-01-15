import { MainCategory } from './types';

export const FRUIT_CATEGORY: MainCategory = {
  id: 'fruit',
  label: 'Fruita',
  emoji: '🍎',
  gradient: 'from-red-900/30 to-orange-900/30 border-red-800/40',
  subcategories: [
    // --- 🍌 BÀSICS DE FRUITERIA ---
    { 
      id: 'banana', 
      label: 'Plàtan', 
      emoji: '🍌', 
      query: 'Plàtan banana', 
      exclude: [
        'iogurt', 'batut', 'postre', 'gelat', 'xips', 'fregit', 'sec', 
        'deshidratat', 'galeta', 'pastís', 'brioix', 'CAN'
      ] 
    },
    { 
      id: 'apple', 
      label: 'Pomes', 
      emoji: '🍎', 
      // Totes les varietats fresques
      query: [
        'Poma Golden', 
        'Poma Fuji', 
        'Poma Royal Gala', 
        'Poma Granny Smith', 
      ], 
      exclude: [
        'suc', 'compota', 'pastís', 'sidra', 'vinagre', 'iogurt', 
        'bossa', 'xips', 'forn', 'caramel'
      ] 
    },
    { 
      id: 'pear', 
      label: 'Peres', 
      emoji: '🍐', 
      query: ['Pera Conferència', 'Pera Blanquilla', 'Pera Ercolini', 'Pera Llimonera'], 
      exclude: ['suc', 'iogurt', 'almívar', 'pot', 'conserva', 'LA COLLITA', 'Tomàquet'] 
    },

    // --- 🍊 CÍTRICS ---
    { 
      id: 'orange', 
      label: 'Taronges', 
      emoji: '🍊', 
      query: 'Taronja Premium', 
      exclude: [
        'suc', 'fanta', 'kas', 'refresc', 'melmelada', 'gelat', 
        'iogurt', 'galeta', 'xocolata', 'ambientador', 'sabó', 'detergent', 'GRANINI' // "Taronja" surt molt a neteja
      ] 
    },
    { 
      id: 'mandarin', 
      label: 'Mandarina', 
      emoji: '🍊', 
      query: ['Mans Mandarina'], 
      exclude: ['suc', 'iogurt', 'sorbet'] 
    },
    { 
      id: 'lemon', 
      label: 'Llimona/Llima', 
      emoji: '🍋', 
      query: ['LA COLLITA Llimona', 'Llima'], 
      exclude: [
        'suc', 'refresc', 'fanta', 'schweppes', 'cervesa', 'galeta', 
        'iogurt', 'postre', 'neteja', 'rentavaixelles', 'lleixiu' // Molt important excloure neteja
      ] 
    },

    // --- 🍓 VERMELLS I BOSC ---
    { 
      id: 'strawberry', 
      label: 'Maduixes', 
      emoji: '🍓', 
      query: ['Maduixa en caixa'], 
      exclude: [
        'iogurt', 'batut', 'melmelada', 'gelat', 'nata', 
        'galeta', 'caramel', 'xiclet', 'suc'
      ] 
    },
    { 
      id: 'cherry', 
      label: 'Cireres/Picotes', 
      emoji: '🍒', 
      query: ['Cireres'], 
      exclude: ['iogurt', 'melmelada', 'bombó', 'licor', 'confitada', 'pot'] 
    },
    { 
      id: 'berries', 
      label: 'Fruits del Bosc', 
      emoji: '🫐', 
      query: ['Nabius', 'Gerds', 'Mores', 'Grosella'], 
      exclude: ['iogurt', 'melmelada', 'congelat', 'sec', 'deshidratat', 'BICENTURY', 'Coquetes', 'moro'] 
    },

    // --- 🥝 TROPICAL ---
    { 
      id: 'avocado', 
      label: 'Alvocat', 
      emoji: '🥑', 
      query: ['Alvocat', 'Alvocat hass'], 
      exclude: ['guacamole', 'salsa', 'oli', 'crema'] // Evitem el guacamole preparat
    },
    { 
      id: 'kiwi', 
      label: 'Kiwi', 
      emoji: '🥝', 
      query: ['Kiwi verd', 'Kiwi groc', 'Kiwi gold'], 
      exclude: ['iogurt', 'suc', 'gelat'] 
    },
    { 
      id: 'mango', 
      label: 'Mango', 
      emoji: '🥭', 
      query: ['Mango fresc'], 
      exclude: ['suc', 'iogurt', 'deshidratat', 'tires', 'chutney', 'salsa'] 
    },
    { 
      id: 'pineapple', 
      label: 'Pinya', 
      emoji: '🍍', 
      query: ['Pinya'], 
      // Molta cura amb la pinya en llauna (almívar/suc)
      exclude: ['suc', 'almívar', 'llauna', 'pot', 'rodanxes', 'trossos', 'pizza', 'iogurt'] 
    },
    { 
      id: 'papaya', 
      label: 'Papaia', 
      emoji: '🥭', 
      query: 'Papaies', 
      exclude: ['deshidratada', 'suc'] 
    },

    // --- 🍇 ESTACIONALS ---
    { 
      id: 'melon', 
      label: 'Meló', 
      emoji: '🍈', 
      query: ['Meló', 'Melons'], 
      exclude: ['pernil', 'xiclet', 'iogurt', 'tallejat', 'PUERTO'] 
    },
    { 
      id: 'watermelon', 
      label: 'Síndria', 
      emoji: '🍉', 
      query: ['Síndries tmpoc hi an'], 
      exclude: ['xiclet', 'caramel', 'gaspatxo', 'tallejada'] 
    },
    { 
      id: 'peach', 
      label: 'Préssec/Nectarina', 
      emoji: '🍑', 
      query: ['Préssecs no i han '], 
      exclude: ['suc', 'iogurt', 'almívar', 'pot', 'melmelada', 'sec', 'orellana'] 
    },
    { 
      id: 'grape', 
      label: 'Raïm', 
      emoji: '🍇', 
      query: ['Raïm blanc', 'Raïm negre', 'Raïm sense llavors'], 
      exclude: ['suc', 'most', 'panses', 'vi', 'cava'] // "Panses" i "Vi" són els enemics aquí
    },
    { 
      id: 'pomegranate', 
      label: 'Magrana', 
      emoji: '🍎', 
      query: 'Punica granatum', 
      exclude: ['suc', 'iogurt'] 
    }
  ]
};