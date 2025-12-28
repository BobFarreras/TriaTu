// core/constants/profile-data.ts

export type OptionItem = {
  id: string;
  label: string;
  emoji: string;
};

export type OptionCategory = {
  title: string;
  items: OptionItem[];
};

// --- DATA: AL·LÈRGIES I EXCLUSIONS ---
export const EXCLUSION_DATA: OptionCategory[] = [
  {
    title: "⚠️ Les 14 Al·lèrgens Principals (UE)",
    items: [
      { id: 'gluten', label: 'Gluten', emoji: '🍞' },
      { id: 'crustaceans', label: 'Crustacis', emoji: '🦐' },
      { id: 'eggs', label: 'Ous', emoji: '🥚' },
      { id: 'fish', label: 'Peix', emoji: '🐟' },
      { id: 'peanuts', label: 'Cacauets', emoji: '🥜' },
      { id: 'soybeans', label: 'Soja', emoji: '🫘' },
      { id: 'dairy', label: 'Llet/Lactosa', emoji: '🥛' },
      { id: 'nuts', label: 'Fruits de closca', emoji: '🌰' },
      { id: 'celery', label: 'Api', emoji: '🥬' },
      { id: 'mustard', label: 'Mostassa', emoji: '🌭' },
      { id: 'sesame', label: 'Sèsam', emoji: '🥯' },
      { id: 'sulphites', label: 'Sulfits', emoji: '🍷' },
      { id: 'lupin', label: 'Tramussos', emoji: '🌼' },
      { id: 'molluscs', label: 'Mol·luscs', emoji: '🐙' },
    ]
  },
  {
    title: "🚫 Dietes i Estils de Vida",
    items: [
      { id: 'vegan', label: 'Vegà (Sense animals)', emoji: '🌱' },
      { id: 'vegetarian', label: 'Vegetarià', emoji: '🥗' },
      { id: 'pescatarian', label: 'Pescatarià', emoji: '🎣' },
      { id: 'halal', label: 'Halal', emoji: '☪️' },
      { id: 'kosher', label: 'Kosher', emoji: '✡️' },
      { id: 'keto', label: 'Keto (Baix carbs)', emoji: '🥑' },
      { id: 'paleo', label: 'Paleo', emoji: '🍖' },
      { id: 'low_fodmap', label: 'Low FODMAP', emoji: '📉' },
    ]
  },
  {
    title: "❌ Intoleràncies i Aversions Comuns",
    items: [
      { id: 'onion', label: 'Ceba', emoji: '🧅' },
      { id: 'garlic', label: 'All', emoji: '🧄' },
      { id: 'spicy', label: 'Picant', emoji: '🌶️' },
      { id: 'cilantro', label: 'Cilandre', emoji: '🌿' },
      { id: 'mushrooms', label: 'Bolets', emoji: '🍄' },
      { id: 'pork', label: 'Porc', emoji: '🐖' },
      { id: 'beef', label: 'Vedella', emoji: '🐄' },
      { id: 'alcohol', label: 'Alcohol', emoji: '🍺' },
      { id: 'caffeine', label: 'Cafeïna', emoji: '☕' },
      { id: 'sugar', label: 'Sucre afegit', emoji: '🍬' },
      { id: 'fructose', label: 'Fructosa', emoji: '🍎' },
      { id: 'bell_pepper', label: 'Pebrot', emoji: '🫑' },
      { id: 'coconut', label: 'Coco', emoji: '🥥' },
      { id: 'cucumber', label: 'Cogombre', emoji: '🥒' },
    ]
  }
];

// --- DATA: PREFERÈNCIES DE MENJAR (PAÍS + EMOJI CULTURAL) ---
export const FOOD_DATA: OptionCategory[] = [
  {
    title: "🌍 Cuines del Món (Europa & Amèrica)",
    items: [
      { id: 'italian', label: 'Italiana', emoji: '🍕' },
      { id: 'mediterranean', label: 'Mediterrània', emoji: '🫒' },
      { id: 'spanish', label: 'Espanyola', emoji: '🥘' },
      { id: 'french', label: 'Francesa', emoji: '🥐' },
      { id: 'greek', label: 'Grega', emoji: '🧀' },
      { id: 'mexican', label: 'Mexicana', emoji: '🌮' },
      { id: 'american', label: 'Americana', emoji: '🍔' },
      { id: 'brazilian', label: 'Brasilera', emoji: '🥩' },
      { id: 'peruvian', label: 'Peruana', emoji: '🐟' },
      { id: 'argentinian', label: 'Argentina', emoji: '🥩🔥' },
      { id: 'german', label: 'Alemanya', emoji: '🌭' },
    ]
  },
  {
    title: "🥢 Cuines del Món (Àsia & Orient)",
    items: [
      { id: 'japanese', label: 'Japonesa', emoji: '🍣' },
      { id: 'chinese', label: 'Xinesa', emoji: '🥡' },
      { id: 'indian', label: 'Índia', emoji: '🍛' },
      { id: 'thai', label: 'Tailandesa', emoji: '🍜' },
      { id: 'korean', label: 'Coreana', emoji: '🥘🔥' },
      { id: 'vietnamese', label: 'Vietnamita', emoji: '🍲' },
      { id: 'turkish', label: 'Turca', emoji: '🥙' },
      { id: 'lebanese', label: 'Libanesa', emoji: '🧆' },
      { id: 'poke', label: 'Hawaiana (Poke)', emoji: '🐟🥗' },
    ]
  },
  {
    title: "🍔 Fast Food & Casual",
    items: [
      { id: 'pizza', label: 'Pizza', emoji: '🍕' },
      { id: 'burger', label: 'Hamburguesa', emoji: '🍔' },
      { id: 'fried_chicken', label: 'Pollastre Fregit', emoji: '🍗' },
      { id: 'kebab', label: 'Kebab/Dürüm', emoji: '🌯' },
      { id: 'hotdog', label: 'Frankfurt/Hot Dog', emoji: '🌭' },
      { id: 'tacos', label: 'Tacos/Burritos', emoji: '🌮' },
      { id: 'sandwich', label: 'Entrepans/Wraps', emoji: '🥪' },
      { id: 'crepes', label: 'Creps', emoji: '🥞' },
      { id: 'empanadas', label: 'Empanades', emoji: '🥟' },
    ]
  },
  {
    title: "🍣 Plats Específics i Delicatessen",
    items: [
      { id: 'sushi', label: 'Sushi', emoji: '🍣' },
      { id: 'ramen', label: 'Ramen', emoji: '🍜' },
      { id: 'steak', label: 'Carn a la brasa', emoji: '🥩' },
      { id: 'seafood_dish', label: 'Mariscada', emoji: '🦞' },
      { id: 'paella', label: 'Paella/Arròs', emoji: '🥘' },
      { id: 'pasta', label: 'Pasta', emoji: '🍝' },
      { id: 'bbq', label: 'Barbacoa/Costelles', emoji: '🍖' },
      { id: 'dimsum', label: 'Dim Sum/Gyozas', emoji: '🥟' },
      { id: 'fondue', label: 'Fondue/Raclette', emoji: '🧀' },
    ]
  },
  {
    title: "🥗 Saludable i Lleuger",
    items: [
      { id: 'salad', label: 'Amanides', emoji: '🥗' },
      { id: 'poke_bowl', label: 'Poke Bowl', emoji: '🥣' },
      { id: 'soup', label: 'Sopes/Cremes', emoji: '🍲' },
      { id: 'vegan_dish', label: 'Plats Vegans', emoji: '🥦' },
      { id: 'smoothies', label: 'Smoothies/Fruita', emoji: '🫐' },
      { id: 'grilled_fish', label: 'Peix a la planxa', emoji: '🐟' },
    ]
  },
  {
    title: "🧁 Esmorzars i Dolços",
    items: [
      { id: 'breakfast', label: 'Brunch', emoji: '🥑' },
      { id: 'croissant', label: 'Pastisseria', emoji: '🥐' },
      { id: 'ice_cream', label: 'Gelat', emoji: '🍦' },
      { id: 'coffee', label: 'Cafeteria', emoji: '☕' },
      { id: 'bubble_tea', label: 'Bubble Tea', emoji: '🧋' },
      { id: 'donuts', label: 'Donuts/Berlines', emoji: '🍩' },
    ]
  }
];