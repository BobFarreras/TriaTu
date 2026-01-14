import { BonpreuProductRaw } from './bonpreu-types';

const EMOJI_MAP: Record<string, string> = {
  'formatge': '🧀', 'llet': '🥛', 'enciam': '🥬', 'tomàquet': '🍅',
  'pollastre': '🍗', 'ous': '🥚', 'pasta': '🍝', 'pizza': '🍕',
  'gorgonzola': '🧀', 'iogurt': '🥣', 'pa': '🥖', 'arròs': '🍚',
  'carn': '🥩', 'peix': '🐟', 'poma': '🍎', 'plàtan': '🍌'
};

// Paraules clau per detectar propietats
const KEYWORDS = {
  glutenFree: ['sense gluten', 'sin gluten', 'gluten free'],
  lactoseFree: ['sense lactosa', 'sin lactosa', 'lactose free'],
  vegan: ['vegà', 'vegano', 'vegan', 'vegetal', 'base de plantes']
};
// Helper per normalitzar unitats
function parseUnitInfo(raw: string | undefined): { amount: number, unit: string } {
  console.log("🧩 [MAPPER] Parsing:", raw); // LOG 1
  if (!raw) return { amount: 1, unit: 'ut' };

  const clean = raw.trim().toLowerCase().replace(',', '.');

  // Regex per capturar numero i lletres: "1.5 L" -> ["1.5", "l"]
  const match = clean.match(/^([\d\.]+)\s*([a-z]+)$/);

  if (match) {
    let unit = match[2];
    // Normalitzem unitats
    if (unit === 'l' || unit === 'litres') unit = 'L';
    if (unit === 'ml') unit = 'ml';
    if (unit === 'g' || unit === 'gr') unit = 'g';
    if (unit === 'kg' || unit === 'quilos') unit = 'kg';

    return { amount: parseFloat(match[1]), unit };
  }

  return { amount: 1, unit: 'ut' };
}
function estimateExpiry(name: string): number {
  const lower = name.toLowerCase();
  if (lower.includes('llet') || lower.includes('fresc')) return 7;
  if (lower.includes('formatge')) return 21;
  if (lower.includes('congelat')) return 180;
  return 14;
}

function findEmoji(name: string): string {
  const lower = name.toLowerCase();
  const key = Object.keys(EMOJI_MAP).find(k => lower.includes(k));
  return key ? EMOJI_MAP[key] : '🛒';
}

function checkProperty(name: string, tags: string[], keys: string[]): boolean {
  const lowerName = name.toLowerCase();
  // 1. Mirem si està a les etiquetes oficials
  const inTags = tags.some(t => keys.some(k => t.toLowerCase().includes(k)));
  // 2. Mirem si està al nom del producte
  const inName = keys.some(k => lowerName.includes(k));

  return inTags || inName;
}

export function enrichProduct(bonpreuItem: BonpreuProductRaw) {
  const rawTags = bonpreuItem.iconAttributes?.map(i => i.label) || [];

  // Detectem propietats combinant Etiquetes API + Anàlisi de Text
  const isEco = rawTags.includes('Eco') || bonpreuItem.name.toLowerCase().includes('ecològic');
  const isGlutenFree = checkProperty(bonpreuItem.name, rawTags, KEYWORDS.glutenFree);
  const isLactoseFree = checkProperty(bonpreuItem.name, rawTags, KEYWORDS.lactoseFree);
  const isVegan = checkProperty(bonpreuItem.name, rawTags, KEYWORDS.vegan);

  const daysLife = estimateExpiry(bonpreuItem.name);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysLife);
  const unitInfo = parseUnitInfo(bonpreuItem.packSizeDescription);

  console.log("🧩 [MAPPER] Result:", unitInfo); // LOG 2
  return {
    id: bonpreuItem.productId,
    name: bonpreuItem.name.trim(),
    price: `${bonpreuItem.price?.amount || '?'}€`,
    image: bonpreuItem.image?.src || '',
    emoji: findEmoji(bonpreuItem.name),
    tags: rawTags,
    // Noves propietats booleanes pel filtre
    isEco,
    isGlutenFree,
    isLactoseFree,
    isVegan,
    expiresInDays: daysLife,
    expiryDate: expiryDate.toLocaleDateString('ca-ES'),
    standardQuantity: unitInfo.amount, // Ex: 150
    standardUnit: unitInfo.unit,       // Ex: 'g'
  };
}