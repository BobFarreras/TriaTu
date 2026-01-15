import { MainCategory } from './types';

export const VEGETABLES_CATEGORY: MainCategory = {
  id: 'vegetables',
  label: 'Verdura',
  emoji: '🥦',
  gradient: 'from-green-900/30 to-emerald-900/30 border-green-800/40',
  subcategories: [
    // --- BÀSICS CUINA ---
    {
      id: 'potato',
      label: 'Patates',
      emoji: '🥔',
      query: ['Patates', 'Patata', 'Patates malla', 'Patata granel'],
      // ✅ MUST: Si no diu "Patat...", fora. Això treu molts snacks amb noms creatius.
      mustContain: ['Patata', 'Patates'], 
      // 🧹 NETEJA: Hem tret marques. Ens centrem en PRODUCTES PROCESSATS.
      exclude: [
        'xips', 'fregides', 'bravas', 'congelades', 'truita', 
        'gnocchi', 'snack', 'pelades', 'tonyina', 'farcellets', 
        'preparada', 'microones', 'deluxe', 'puré', 'bastonets',
        'Ceba', 'All' // Evitem "Patata i Ceba" si busquem només patata? Opcional.
      ]
    },
    {
      id: 'onion',
      label: 'Cebes',
      emoji: '🧅',
      query: ['Ceba', 'Cebes'], // Simplifiquem la query
      mustContain: ['Ceba'],    // Forcem que sigui ceba
      exclude: [
        'fregida', 'cruixent', 'congelada', 'caramel', 'pot', 
        'en pols', 'sopa', 'truita', 'sofregit'
      ]
    },
    {
      id: 'garlic',
      label: 'Alls',
      emoji: '🧄',
      query: ['Alls', 'All'],
      mustContain: ['All'],
      // Aquí el "mustContain" ens protegeix de coses com "Salsa Allioli" si la query fos massa àmplia
      exclude: ['talls', 'picada', 'salsa', 'oli', 'maionesa', 'botifarra']
    },
    {
      id: 'carrot',
      label: 'Pastanaga',
      emoji: '🥕',
      query: ['Pastanaga', 'Pastanages'],
      mustContain: ['Pastanag'], // Cobreix singular i plural
      exclude: ['ratllada', 'brot', 'pastís', 'suc', 'crema', 'pèsols', 'ensaladilla'] 
    },

    // --- AMANIDA ---
    {
      id: 'lettuce',
      label: 'Enciam',
      emoji: '🥬',
      query: ['Enciam', 'Cabdells'],
      mustContain: ['Enciam', 'Cabdell'],
      exclude: ['bossa'] // Opcional, si vols només la peça sencera
    },
    {
      id: 'tomato',
      label: 'Tomàquet',
      emoji: '🍅',
      query: ['Tomàquet amanida', 'Tomàquet branca', 'Tomàquet pera'],
      mustContain: ['Tomàquet'],
      exclude: ['fregit', 'triturat', 'salsa', 'sec', 'ratllat', 'conserva', 'suc']
    },
    {
      id: 'tomato_cherry',
      label: 'Cherry',
      emoji: '🍅',
      query: 'Tomàquet cherry',
      mustContain: ['Cherry'], // Molt específic
      exclude: ['confitat', 'sec']
    },
    {
      id: 'cucumber',
      label: 'Cogombre',
      emoji: '🥒',
      query: 'Cogombre',
      mustContain: ['Cogombre'],
      exclude: ['vinagre', 'adobats', 'agredolç']
    },

    // --- CUINAR ---
    {
      id: 'zucchini',
      label: 'Carbassó',
      emoji: '🥒',
      query: 'Carbassó',
      mustContain: ['Carbassó'],
      exclude: ['crema', 'puré', 'fregit', 'truita']
    },
    {
      id: 'eggplant',
      label: 'Albergínia',
      emoji: '🍆',
      query: 'Albergínia',
      mustContain: ['Albergínia'],
      exclude: ['farcida', 'arrebossada', 'crema', 'hummus']
    },
    
    // --- 🌶️ PEBROTS ---
    {
      id: 'pepper_red',
      label: 'Pebrot Vermell',
      emoji: '🌶️',
      query: ['Pebrot vermell', 'Pebrot tricolor', 'Pebrot groc', 'Pebrot California'],
      mustContain: ['Pebrot'],
      exclude: [
        'escalivat', 'farcit', 'conserva', 'melmelada', 'bitxo', 
        'pot', 'llauna', 'tires', 'piquillo', 'nyora', 'fregit', 'cuit', 'verd', 'mólt'
      ]
    },
    {
      id: 'pepper_green',
      label: 'Pebrot Verd/Italià',
      emoji: '🫑',
      query: ['Pebrot verd', 'Pebrot italià', 'Pebrot Padrón'],
      mustContain: ['Pebrot'],
      exclude: ['fregit', 'conserva', 'vinagre', 'bitxo', 'guindilla', 'vermell']
    },

    // --- BOLETS ---
    {
      id: 'mushrooms',
      label: 'Bolets',
      emoji: '🍄',
      query: ['Xampinyó', 'Portobello', 'Gírgola', 'Shiitake', 'Bolets variats', 'Moixernó'],
      // ✅ Aquesta és la clau per als bolets: han de tenir el nom de l'espècie
      mustContain: ['Xampinyó', 'Portobello', 'Gírgola', 'Shiitake', 'Bolet', 'Moixernó'],
      exclude: [
        'conserva', 'pot', 'llauna', 'sec', 'deshidratat', 
        'crema', 'brou', 'congelat', 'risotto', 'arròs', 
        'fideus', 'confitat', 'saltat', 'burger', 'sopa'
      ]
    },
    {
      id: 'spinach',
      label: 'Espinacs',
      emoji: '🍃',
      query: 'Espinacs',
      mustContain: ['Espinacs'],
      // Aquí eliminem pizzes, crestes, etc.
      exclude: ['congelat', 'crema', 'bossa', 'ravioli', 'pizza', 'cresta', 'catalana']
    },
    {
      id: 'pumpkin',
      label: 'Carbassa',
      emoji: '🎃',
      query: ['Carbassa', 'Carbassa cacauet'],
      mustContain: ['Carbass'],
      exclude: ['crema', 'cabell', 'pipes', 'llavors', 'pastís']
    },
  ]
};