import { MainCategory } from './types';

export const PANTRY_CATEGORY: MainCategory = {
  id: 'pantry',
  label: 'Rebost',
  emoji: '🥫',
  gradient: 'from-amber-900/20 to-yellow-900/20 border-amber-800/30',
  subcategories: [
    // Bàsics
    { 
      id: 'oil', 
      label: 'Oli Oliva', 
      emoji: '🫒', 
      query: ['Oli oliva verge', "Oli d'oliva", 'Oli oliva', 'Oli verge extra'],
      exclude: ['gira-sol', 'girasol', 'tonyina', 'tuna', 'bonito', 'sardina', 'llaut', 'conserva']
    },
    { 
      id: 'sunflower', 
      label: 'Oli Gira-sol', 
      emoji: '🌻', 
      query: ['Oli gira-sol', 'Oli girasol', "Oli de gira-sol", 'Oli de girasol'],
      exclude: ['tonyina', 'tuna', 'bonito', 'sardina', 'llaut', 'conserva']
    },
    { 
      id: 'pasta', 
      label: 'Pasta', 
      emoji: '🍝', 
      query: ['Pasta', 'Macarrons', 'Espaguetis', 'Spaghetti', 'Fideus', 'Tallarines', 'Penne', 'Fusilli', 'Lasanya', 'Pasta Bonpreu', 'Macarrons Bonpreu', 'Espaguetis Bonpreu'],
      exclude: ['formatge', 'ratllat', 'salsa', 'tomàquet', 'pesto', 'pastanaga', 'pastanagues', 'crema', 'full', 'sopa', 'brou']
    },
    { id: 'rice', label: 'Arròs', emoji: '🍚', query: 'Arròs' },
    { 
      id: 'legumes', 
      label: 'Llegums', 
      emoji: '🫘', 
      query: ['Llegums', 'Cigrons', 'Llenties', 'Mongetes', 'Fesolets', 'Lenties', 'Judies'],
      exclude: ['hummus', 'paté', 'crema', 'preparat']
    },
    { id: 'sauce', label: 'Tomàquet/Salses', emoji: '🥫', query: ['Tomàquet fregit', 'Salsa tomàquet', 'Salsa de tomàquet', 'Tomate frito', 'Tomato sauce'] },
    
    // Pa i Esmorzar
    { 
      id: 'bread', 
      label: 'Pa', 
      emoji: '🥖', 
      query: ['Pa barra', 'Pa integral', 'Pa de pages', 'Pa rústic', 'Pa blanc', 'Pan', 'Pan barra', 'Pan integral', 'Baguette'],
      exclude: [
        'cereals', 'cereal', 'barreta', 'barretes', 'galeta', 'galetes',
        'bastonets', 'palitos', 'palets', 'sticks', 'breadsticks', 'grisines', 'grisini',
        'picos', 'snack', 'pipes', 'rosquilla', 'rosquilles', 'donut', 'donuts', 'donettes',
        'doughnut', 'xurro', 'xurros', 'croissant', 'brioix', 'magdalena'
      ],
      mustContain: ['pa', 'pan']
    },
    { id: 'sliced_bread', label: 'Pa Motlle', emoji: '🍞', query: ['Pa motlle', 'Pa de motlle', 'Pan de molde'] },
    { id: 'cookies', label: 'Galetes', emoji: '🍪', query: 'Galetes' },
    { id: 'cereals', label: 'Cereals', emoji: '🥣', query: ['Cereals esmorzar', 'Cereals', 'Cereales desayuno'] },
    { id: 'coffee', label: 'Cafè', emoji: '☕', query: 'Cafè molt' },
    { id: 'cocoa', label: 'Cacau', emoji: '🍫', query: 'Cacau pols' },
    
    // Conserves
    { id: 'tuna_can', label: 'Tonyina', emoji: '🐟', query: 'Tonyina oli' },
    { id: 'olives', label: 'Olives', emoji: '🫒', query: 'Olives' },
    { id: 'soup', label: 'Brou/Sopes', emoji: '🍲', query: 'Brou pollastre' },
    
    // Condiments
    { id: 'salt', label: 'Sal/Espècies', emoji: '🧂', query: 'Sal cuina' },
    { id: 'sugar', label: 'Sucre', emoji: '🍬', query: ['Sucre', 'Azucar', 'Sucre blanc', 'Sucre moreno', 'Sucre llustre'] },
    { id: 'sauces', label: 'Maionesa/Kètxup', emoji: '🌭', query: ['Maionesa', 'Mayonesa', 'Salsa maionesa'] },
  ]
};
