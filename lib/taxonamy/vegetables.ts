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
      query: ['Patates', 'Patata', 'Patates mini en bossa'],
      // Exclusions MOLT importants per netejar la llista
      exclude: [
        'xips', 'fregides', 'bravas', 'congelades', 'truita',
        'gnocchi', 'snack', 'pelades', 'tonyina', 'farcellets',
        'preparada', 'microones', 'deluxe', 'puré', 'lay\'s',
        'pringles', 'ruffles', 'doritos', 'cheetos', 'Ceba', 'SANTA ANA', 'fregir', 'TERRA I TAST', 'TERESA'
      ]
    },
    {
      id: 'onion',
      label: 'Cebes',
      emoji: '🧅',
      query: ['Ceba seca', 'Ceba figueres', 'Ceba morada', 'Ceba dolça'],
      exclude: ['fregida', 'cruixent', 'congelada', 'caramel', 'pot', 'en pols', 'LENOR', 'PIERNAS GRANADA']
    },
    {
      id: 'garlic',
      label: 'Alls',
      emoji: '🧄',
      query: 'Alls secs', // ✅ SOLUCIÓ: "Secs" elimina "Talls de pernil"
      exclude: ['talls', 'picada', 'salsa', 'oli']
    },
    {
      id: 'carrot',
      label: 'Pastanaga',
      emoji: '🥕',
      query: ['Pastanaga', 'Pastanages', 'fresca'],
      exclude: ['ratllada', 'brot', 'pastís', 'suc', 'Burger', 'Barreja', 'PAGO', 'HIPP'] // Evitem pastanaga ratllada o sucs
    },

    // --- AMANIDA ---
    {
      id: 'lettuce',
      label: 'Enciam',
      emoji: '🥬',
      query: 'Enciam fresc',
      exclude: ['bossa'] // Si vols evitar les bosses preparades, sinó treu-ho
    },
    {
      id: 'tomato',
      label: 'Tomàquet',
      emoji: '🍅',
      query: 'Tomàquet amanida', // Més específic que "Tomàquet" (que treu fregit)
      exclude: ['fregit', 'triturat', 'salsa', 'sec']
    },
    {
      id: 'tomato_cherry',
      label: 'Cherry',
      emoji: '🍅',
      query: 'Tomàquet cherry',
      exclude: ['confitat']
    },
    {
      id: 'cucumber',
      label: 'Cogombre',
      emoji: '🥒',
      query: 'Cogombre',
      exclude: ['in vinagre', 'adobats'] // Evitem els de pot
    },

    // --- CUINAR ---
    {
      id: 'zucchini',
      label: 'Carbassó',
      emoji: '🥒',
      query: 'Carbassó',
      exclude: ['crema', 'puré', 'fregit']
    },
    {
      id: 'eggplant',
      label: 'Albergínia',
      emoji: '🍆',
      query: 'Albergínia',
      exclude: ['farcida', 'arrebossada', 'crema']
    },
    // --- 🌶️ PEBROTS MILLORATS ---
    {
      id: 'pepper_red',
      label: 'Pebrot Vermell',
      emoji: '🌶️',
      // ESTRATÈGIA: 
      // 1. "Pebrot vermell": El clàssic.
      // 2. "Pebrot tricolor": Molt important, sovint és l'única manera de comprar-ne.
      // 3. "Pebrot California": És la varietat tècnica del vermell gruixut.
      query: ['Pebrot vermell', 'Pebrot tricolor', 'Pebrot groc'],

      // EXCLUSIONS:
      // "Piquillo" i "Nyora" solen sortir com a vermells però són conserves o secs.
      // "Escalivat" és el gran enemic aquí.
      exclude: [
        'escalivat', 'farcit', 'conserva', 'melmelada', 'bitxo',
        'pot', 'llauna', 'tires', 'piquillo', 'nyora', 'fregit', 'cuit', 'verd', 'Pebre'
      ]
    },
    {
      id: 'pepper_green',
      label: 'Pebrot Verd/Italià',
      emoji: '🫑',
      // ESTRATÈGIA:
      // 1. "Pebrot verd": El de carn gruixuda.
      // 2. "Pebrot italià": El llarg i prim (el més venut).
      // 3. "Pebrot Padrón": Els petits per fregir.
      query: ['Pebrot verd', 'Pebrot italià', 'Pebrot Padrón'],

      exclude: ['fregit', 'conserva', 'vinagre', 'bitxo', 'guindilla', 'IFA']
    },
    {
      id: 'mushrooms',
      label: 'Bolets',
      emoji: '🍄',
      // ESTRATÈGIA: Busquem les espècies concretes, no la paraula genèrica "Bolet"
      query: [
        'Xampinyó',       // El blanc típic
        'Portobello',     // El marró (molt comú)
        'Gírgola',        // La plana (Oyster)
        'Shiitake',       // L'asiàtic fresc
        'Bolets variats', // Les safates de barreja fresca
        'Mochardon'       // Moixernó (a vegades fresc, a vegades sec, l'exclude farà la feina)
      ],

      // FILTRE ANTI-REBOST:
      exclude: [
        'conserva',       // Adéu llaunes
        'pot',            // Adéu vidre
        'llauna',
        'sec',            // Adéu bolets deshidratats
        'deshidratat',
        'crema',          // Adéu sopes
        'brou',
        'congelat',       // Adéu bosses de congelat
        'risotto',        // Adéu plats preparats
        'arròs',
        'fideus',
        'confitat',
        'saltat',
        'Burger'       // Sol ser congelat
      ]
    },
    {
      id: 'spinach',
      label: 'Espinacs',
      emoji: '🍃',
      query: 'Espinacs frescos',
      exclude: ['congelat', 'crema', 'bossa', 'TERRA I TAST', 'Raviolis', 'PETRAS']
    },
    {
      id: 'pumpkin',
      label: 'Carbassa',
      emoji: '🎃',
      query: 'Carbassa',
      exclude: ['crema', 'cabell', 'pipes'] // Evitem crema de carbassa o cabell d'àngel
    },
  ]
};