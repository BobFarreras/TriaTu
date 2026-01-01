// src/lib/utils/emojiUtils.ts

// Diccionari ràpid per categories comunes
const EMOJI_MAP: Record<string, string> = {
  // Verdures
  tomaquet: '🍅', tomàquet: '🍅', tomato: '🍅',
  patata: '🥔', potato: '🥔',
  ceba: '🧅', onion: '🧅',
  all: '🧄', garlic: '🧄',
  pastanaga: '🥕', carrot: '🥕',
  enciam: '🥬', lettuce: '🥬',
  brocoli: '🥦', broccoli: '🥦',
  pebrot: '🫑', pepper: '🫑',
  alberginia: '🍆', albergínia: '🍆', eggplant: '🍆',
  bolet: '🍄', xampinyó: '🍄', mushroom: '🍄',
  
  // Fruites
  llimona: '🍋', lemon: '🍋',
  poma: '🍎', apple: '🍎',
  platan: '🍌', plàtan: '🍌', banana: '🍌',
  maduixa: '🍓', strawberry: '🍓',
  
  // Proteïnes
  pollastre: '🍗', chicken: '🍗',
  carn: '🥩', vedella: '🥩', meat: '🥩', beef: '🥩',
  porc: '🥓', pork: '🥓',
  peix: '🐟', fish: '🐟',
  gamba: '🦐', shrimp: '🦐',
  ou: '🥚', egg: '🥚',
  
  // Làctics & Altres
  llet: '🥛', milk: '🥛',
  formatge: '🧀', cheese: '🧀',
  mantega: '🧈', butter: '🧈',
  oli: '🫒', oil: '🫒',
  pa: '🥖', bread: '🥖',
  arros: '🍚', arròs: '🍚', rice: '🍚',
  pasta: '🍝', espagueti: '🍝', macarrons: '🍝',
  
  // Condiments
  sal: '🧂', salt: '🧂',
  pebre: '🌶️',
  sucre: '🍬', sugar: '🍬',
  aigua: '💧', water: '💧'
};

export function getIngredientEmoji(name: string): string {
  if (!name) return '🥗';
  
  const normalized = name.toLowerCase().trim();

  // 1. Cerca directa al diccionari (més ràpid)
  if (EMOJI_MAP[normalized]) return EMOJI_MAP[normalized];

  // 2. Cerca parcial (si el nom és "tomàquet fregit", trobarà "tomàquet")
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (normalized.includes(key)) return emoji;
  }

  // 3. Fallbacks genèrics segons paraules clau
  if (normalized.includes('carn') || normalized.includes('filet')) return '🥩';
  if (normalized.includes('verdura') || normalized.includes('fulla')) return '🥬';
  if (normalized.includes('fruita')) return '🍎';
  if (normalized.includes('salsa')) return '🥣';
  if (normalized.includes('espècia') || normalized.includes('herba')) return '🌿';

  return '🥗'; // Emoji per defecte
}