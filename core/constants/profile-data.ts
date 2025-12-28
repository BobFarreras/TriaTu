// ✅ 1. Definició correcta dels tipus (exportats)
export type OptionItemDef = {
  id: string;
  emoji: string;
  // Nota: 'label' ja no és aquí, perquè ve de la traducció
};

export type OptionCategoryDef = {
  id: string; // ID per buscar el títol al diccionari
  items: OptionItemDef[];
};

// --- AL·LÈRGIES I EXCLUSIONS ---
export const EXCLUSION_DATA: OptionCategoryDef[] = [
  {
    id: "cat_allergens",
    items: [
      { id: 'gluten', emoji: '🍞' },
      { id: 'crustaceans', emoji: '🦐' },
      { id: 'eggs', emoji: '🥚' },
      { id: 'fish', emoji: '🐟' },
      { id: 'peanuts', emoji: '🥜' },
      { id: 'soybeans', emoji: '🫘' },
      { id: 'dairy', emoji: '🥛' },
      { id: 'nuts', emoji: '🌰' },
      { id: 'celery', emoji: '🥬' },
      { id: 'mustard', emoji: '🌭' },
      { id: 'sesame', emoji: '🥯' },
      { id: 'sulphites', emoji: '🍷' },
      { id: 'lupin', emoji: '🌼' },
      { id: 'molluscs', emoji: '🐙' },
    ]
  },
  {
    id: "cat_diets",
    items: [
      { id: 'vegan', emoji: '🌱' },
      { id: 'vegetarian', emoji: '🥗' },
      { id: 'pescatarian', emoji: '🎣' },
      { id: 'halal', emoji: '☪️' },
      { id: 'kosher', emoji: '✡️' },
      { id: 'keto', emoji: '🥑' },
      { id: 'paleo', emoji: '🍖' },
      { id: 'low_fodmap', emoji: '📉' },
    ]
  },
  {
    id: "cat_dislikes",
    items: [
      { id: 'onion', emoji: '🧅' },
      { id: 'garlic', emoji: '🧄' },
      { id: 'spicy', emoji: '🌶️' },
      { id: 'cilantro', emoji: '🌿' },
      { id: 'mushrooms', emoji: '🍄' },
      { id: 'pork', emoji: '🐖' },
      { id: 'beef', emoji: '🐄' },
      { id: 'alcohol', emoji: '🍺' },
      { id: 'caffeine', emoji: '☕' },
      { id: 'sugar', emoji: '🍬' },
      { id: 'fructose', emoji: '🍎' },
      { id: 'bell_pepper', emoji: '🫑' },
      { id: 'coconut', emoji: '🥥' },
      { id: 'cucumber', emoji: '🥒' },
    ]
  }
];

// --- PREFERÈNCIES DE MENJAR ---
export const FOOD_DATA: OptionCategoryDef[] = [
  {
    id: "cat_world_west",
    items: [
      { id: 'italian', emoji: '🍕' },
      { id: 'mediterranean', emoji: '🫒' },
      { id: 'spanish', emoji: '🥘' },
      { id: 'french', emoji: '🥐' },
      { id: 'greek', emoji: '🧀' },
      { id: 'mexican', emoji: '🌮' },
      { id: 'american', emoji: '🍔' },
      { id: 'brazilian', emoji: '🥩' },
      { id: 'peruvian', emoji: '🐟' },
      { id: 'argentinian', emoji: '🥩🔥' },
      { id: 'german', emoji: '🌭' },
    ]
  },
  {
    id: "cat_world_east",
    items: [
      { id: 'japanese', emoji: '🍣' },
      { id: 'chinese', emoji: '🥡' },
      { id: 'indian', emoji: '🍛' },
      { id: 'thai', emoji: '🍜' },
      { id: 'korean', emoji: '🥘🔥' },
      { id: 'vietnamese', emoji: '🍲' },
      { id: 'turkish', emoji: '🥙' },
      { id: 'lebanese', emoji: '🧆' },
      { id: 'poke', emoji: '🐟🥗' },
    ]
  },
  {
    id: "cat_fast",
    items: [
      { id: 'pizza', emoji: '🍕' },
      { id: 'burger', emoji: '🍔' },
      { id: 'fried_chicken', emoji: '🍗' },
      { id: 'kebab', emoji: '🌯' },
      { id: 'hotdog', emoji: '🌭' },
      { id: 'tacos', emoji: '🌮' },
      { id: 'sandwich', emoji: '🥪' },
      { id: 'crepes', emoji: '🥞' },
      { id: 'empanadas', emoji: '🥟' },
    ]
  },
  {
    id: "cat_specific",
    items: [
      { id: 'sushi', emoji: '🍣' },
      { id: 'ramen', emoji: '🍜' },
      { id: 'steak', emoji: '🥩' },
      { id: 'seafood_dish', emoji: '🦞' },
      { id: 'paella', emoji: '🥘' },
      { id: 'pasta', emoji: '🍝' },
      { id: 'bbq', emoji: '🍖' },
      { id: 'dimsum', emoji: '🥟' },
      { id: 'fondue', emoji: '🧀' },
    ]
  },
  {
    id: "cat_healthy",
    items: [
      { id: 'salad', emoji: '🥗' },
      { id: 'poke_bowl', emoji: '🥣' },
      { id: 'soup', emoji: '🍲' },
      { id: 'vegan_dish', emoji: '🥦' },
      { id: 'smoothies', emoji: '🫐' },
      { id: 'grilled_fish', emoji: '🐟' },
    ]
  },
  {
    id: "cat_sweet",
    items: [
      { id: 'breakfast', emoji: '🥑' },
      { id: 'croissant', emoji: '🥐' },
      { id: 'ice_cream', emoji: '🍦' },
      { id: 'coffee', emoji: '☕' },
      { id: 'bubble_tea', emoji: '🧋' },
      { id: 'donuts', emoji: '🍩' },
    ]
  }
];