// src/lib/food-categories.ts

export interface SubCategory {
  id: string;
  label: string;
  emoji: string;
  query: string;
}

export interface MainCategory {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
  subcategories: SubCategory[];
}

export const FOOD_TAXONOMY: MainCategory[] = [
  // 1. FRUITA I VERDURA (Base de l'alimentació)
  {
    id: 'fruitveg',
    label: 'Fruita i Verdura',
    emoji: '🥬',
    gradient: 'from-green-900/30 to-emerald-900/30 border-green-800/40',
    subcategories: [
      // Fruites bàsiques
      { id: 'banana', label: 'Plàtan', emoji: '🍌', query: 'Plàtan' },
      { id: 'apple', label: 'Poma', emoji: '🍎', query: 'Poma' }, 
      { id: 'orange', label: 'Taronja', emoji: '🍊', query: 'Taronja' }, 
      { id: 'lemon', label: 'Llimona', emoji: '🍋', query: 'Llimona' }, 
      { id: 'strawberry', label: 'Maduixa', emoji: '🍓', query: 'Maduixa' },
      { id: 'avocado', label: 'Alvocat', emoji: '🥑', query: 'Alvocat' },
      
      // Verdures clau
      { id: 'potato', label: 'Patates', emoji: '🥔', query: 'Patata' }, 
      { id: 'onion', label: 'Cebes', emoji: '🧅', query: 'Ceba' }, 
      { id: 'carrot', label: 'Pastanaga', emoji: '🥕', query: 'Pastanaga' }, 
      { id: 'zucchini', label: 'Carbassó', emoji: '🥒', query: 'Carbassó' },
      { id: 'peppers', label: 'Pebrot', emoji: '🌶️', query: 'Pebrot' },
      { id: 'mushrooms', label: 'Bolets', emoji: '🍄', query: 'Xampinyons' },
      { id: 'salad', label: 'Enciam', emoji: '🥗', query: 'Enciam' },
      { id: 'tomato', label: 'Tomàquet', emoji: '🍅', query: 'Tomàquet' }, 
    ]
  },

  // 2. CARNISSERIA
  {
    id: 'meat',
    label: 'Carnisseria',
    emoji: '🥩',
    gradient: 'from-red-900/20 to-rose-900/20 border-red-800/30',
    subcategories: [
      { id: 'chicken', label: 'Pollastre', emoji: '🍗', query: 'Pollastre' }, 
      { id: 'beef', label: 'Vedella', emoji: '🥩', query: 'Vedella' },
      { id: 'pork', label: 'Porc', emoji: '🐷', query: 'Porc' },
      { id: 'minced', label: 'Picada', emoji: '🍝', query: 'Carn picada' },
      { id: 'sausages', label: 'Salsitxes', emoji: '🌭', query: 'Salsitxes' },
      { id: 'burgers', label: 'Hamburgueses', emoji: '🍔', query: 'Burger' },
    ]
  },

  // 3. PEIXATERIA
  {
    id: 'fish',
    label: 'Peixateria',
    emoji: '🐟',
    gradient: 'from-blue-900/20 to-cyan-900/20 border-blue-800/30',
    subcategories: [
      { id: 'salmon', label: 'Salmó', emoji: '🍣', query: 'Salmó' }, 
      { id: 'whitefish', label: 'Lluç', emoji: '🐟', query: 'Lluç' }, 
      { id: 'tuna', label: 'Tonyina', emoji: '🦈', query: 'Tonyina' }, 
      { id: 'shellfish', label: 'Gambes', emoji: '🦐', query: 'Gambes' },
      { id: 'mussels', label: 'Musclos', emoji: '🦪', query: 'Musclos' },
      { id: 'squid', label: 'Sípia/Calamar', emoji: '🦑', query: 'Sípia' },
    ]
  },

  // 4. LÀCTICS I OUS
  {
    id: 'dairy',
    label: 'Làctics i Ous',
    emoji: '🧀',
    gradient: 'from-amber-100/10 to-orange-100/10 border-orange-200/20',
    subcategories: [
      { id: 'milk', label: 'Llet', emoji: '🥛', query: 'Llet' }, 
      { id: 'eggs', label: 'Ous', emoji: '🥚', query: 'Ous' }, 
      { id: 'yogurt', label: 'Iogurt', emoji: '🥣', query: 'Iogurt' },
      { id: 'cheese', label: 'Formatge', emoji: '🧀', query: 'Formatge' }, 
      { id: 'butter', label: 'Mantega', emoji: '🧈', query: 'Mantega' },
      { id: 'cream', label: 'Nata', emoji: '🍰', query: 'Nata cuina' },
    ]
  },

  // 5. XARCUTERIA
  {
    id: 'charcuterie',
    label: 'Xarcuteria',
    emoji: '🥓',
    gradient: 'from-pink-900/20 to-rose-800/20 border-pink-800/30',
    subcategories: [
      { id: 'ham_cooked', label: 'Pernil Dolç', emoji: '🥪', query: 'Pernil cuit' },
      { id: 'ham_cured', label: 'Pernil Salat', emoji: '🍖', query: 'Pernil curat' },
      { id: 'turkey', label: 'Gall d\'indi', emoji: '🦃', query: 'Pit gall d\'indi' }, 
      { id: 'fuet', label: 'Fuet', emoji: '🥖', query: 'Fuet' },
      { id: 'chorizo', label: 'Xoriço', emoji: '🌭', query: 'Xoriço' },
    ]
  },

  // 6. REBOST (Bàsics)
  {
    id: 'pantry',
    label: 'Rebost',
    emoji: '🥫',
    gradient: 'from-amber-900/20 to-yellow-900/20 border-amber-800/30',
    subcategories: [
      { id: 'pasta', label: 'Pasta', emoji: '🍝', query: 'Pasta' }, 
      { id: 'rice', label: 'Arròs', emoji: '🍚', query: 'Arròs' },
      { id: 'legumes', label: 'Llegums', emoji: '🫘', query: 'Cigrons' },
      { id: 'oil', label: 'Oli', emoji: '🫒', query: 'Oli d\'oliva' },
      { id: 'tomato_sauce', label: 'Salses', emoji: '🥫', query: 'Tomàquet fregit' }, 
      { id: 'bread', label: 'Pa', emoji: '🍞', query: 'Pa' },
      { id: 'cereal', label: 'Cereals', emoji: '🥣', query: 'Cereals' },
    ]
  },

  // 7. DIETES ESPECIALS & BIO (Molt important)
  {
    id: 'dietary',
    label: 'Dietes i Bio',
    emoji: '🌿',
    gradient: 'from-teal-900/30 to-green-800/30 border-teal-500/40',
    subcategories: [
      { id: 'eco', label: 'Ecològic', emoji: '🌱', query: 'Ecològic' },
      { id: 'bio', label: 'Bio', emoji: '🌍', query: 'Bio' },
      { id: 'gluten_free', label: 'Sense Gluten', emoji: '🌾', query: 'Sense gluten' },
      { id: 'lactose_free', label: 'Sense Lactosa', emoji: '🥛', query: 'Sense lactosa' },
      { id: 'vegan', label: 'Vegà', emoji: '🥬', query: 'Vegetal' },
      { id: 'protein', label: 'Proteïna +', emoji: '💪', query: 'Proteïna' },
    ]
  },

  // 8. CONGELATS
  {
    id: 'frozen',
    label: 'Congelats',
    emoji: '❄️',
    gradient: 'from-cyan-900/20 to-sky-900/20 border-cyan-800/30',
    subcategories: [
      { id: 'pizza', label: 'Pizza', emoji: '🍕', query: 'Pizza' },
      { id: 'veggies_frozen', label: 'Verdura', emoji: '🥦', query: 'Verdura congelada' },
      { id: 'fish_frozen', label: 'Peix', emoji: '🐟', query: 'Peix congelat' },
      { id: 'icecream', label: 'Gelats', emoji: '🍦', query: 'Gelat' },
      { id: 'croquettes', label: 'Croquetes', emoji: '🥟', query: 'Croquetes' },
    ]
  },

  // 9. BEGUDES
  {
    id: 'drinks',
    label: 'Begudes',
    emoji: '🧃',
    gradient: 'from-purple-900/20 to-indigo-900/20 border-purple-800/30',
    subcategories: [
      { id: 'water', label: 'Aigua', emoji: '💧', query: 'Aigua mineral' },
      { id: 'soda', label: 'Refrescos', emoji: '🥤', query: 'Refresc' },
      { id: 'beer', label: 'Cervesa', emoji: '🍺', query: 'Cervesa' },
      { id: 'wine', label: 'Vi', emoji: '🍷', query: 'Vi' },
      { id: 'coffee', label: 'Cafè', emoji: '☕', query: 'Cafè' },
      { id: 'juice', label: 'Sucs', emoji: '🍊', query: 'Suc' },
    ]
  },
  
  // 10. NETEJA I LLAR (Opcional, però molt útil)
  {
    id: 'household',
    label: 'Neteja i Llar',
    emoji: '🧹',
    gradient: 'from-gray-800 to-slate-800 border-slate-600',
    subcategories: [
      { id: 'detergent', label: 'Detergent', emoji: '🫧', query: 'Detergent' },
      { id: 'paper', label: 'Paper', emoji: '🧻', query: 'Paper higiènic' },
      { id: 'cleaning', label: 'Netejadors', emoji: '🧼', query: 'Netejador' },
    ]
  }
];