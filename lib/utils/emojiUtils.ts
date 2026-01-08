// Diccionari ràpid per ingredients individuals
const EMOJI_MAP: Record<string, string> = {
  // Verdures
  tomaquet: '🍅', tomato: '🍅',
  patata: '🥔', potato: '🥔',
  ceba: '🧅', onion: '🧅',
  all: '🧄', garlic: '🧄',
  pastanaga: '🥕', carrot: '🥕',
  enciam: '🥬', lettuce: '🥬',
  brocoli: '🥦', broccoli: '🥦',
  pebrot: '🫑', pepper: '🫑',
  alberginia: '🍆', eggplant: '🍆',
  bolet: '🍄', xampinyo: '🍄', mushroom: '🍄',
  
  // Fruites
  llimona: '🍋', lemon: '🍋',
  poma: '🍎', apple: '🍎',
  platan: '🍌', banana: '🍌',
  maduixa: '🍓', strawberry: '🍓',
  
  // Proteïnes
  pollastre: '🍗', chicken: '🍗',
  carn: '🥩', vedella: '🥩', meat: '🥩', beef: '🥩',
  porc: '🥓', pork: '🥓', pernil: '🥓', bacon: '🥓',
  peix: '🐟', fish: '🐟',
  gamba: '🦐', shrimp: '🦐',
  ou: '🥚', egg: '🥚',
  
  // Làctics & Altres
  llet: '🥛', milk: '🥛',
  formatge: '🧀', cheese: '🧀',
  mantega: '🧈', butter: '🧈',
  oli: '🫒', oil: '🫒',
  pa: '🥖', bread: '🥖',
  arros: '🍚', rice: '🍚',
  pasta: '🍝', espagueti: '🍝', macarrons: '🍝',
  
  // Condiments
  sal: '🧂', salt: '🧂',
  pebre: '🌶️',
  sucre: '🍬', sugar: '🍬',
  aigua: '💧', water: '💧',
  xocolata: '🍫', chocolate: '🍫'
};

// Helper per treure accents i passar a minúscules (ex: "Arròs" -> "arros")
const normalizeText = (text: string) => 
  text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// ✅ 1. FUNCIÓ PER A INGREDIENTS INDIVIDUALS (La teva millorada)
export function getIngredientEmoji(name: string): string {
  if (!name) return '🥗';
  
  const normalized = normalizeText(name);

  // A. Cerca directa
  if (EMOJI_MAP[normalized]) return EMOJI_MAP[normalized];

  // B. Cerca parcial
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (normalized.includes(key)) return emoji;
  }

  // C. Fallbacks genèrics
  if (normalized.includes('carn') || normalized.includes('filet')) return '🥩';
  if (normalized.includes('verdura') || normalized.includes('fulla')) return '🥬';
  if (normalized.includes('fruita')) return '🍎';
  if (normalized.includes('salsa')) return '🥣';
  if (normalized.includes('especia') || normalized.includes('herba')) return '🌿';
  if (normalized.includes('farina') || normalized.includes('masa')) return '🌾';

  return '🥗'; // Default
}

// ✅ 2. FUNCIÓ PER AL PLAT PRINCIPAL (RECIPE CARD)
// Aquesta és molt més complexa i prioritza plats sencers
export function getMainEmoji(name: string, tags: string[] = []): string {
  const normalizedName = normalizeText(name);
  const normalizedTags = tags.map(t => normalizeText(t));
  
  // Unim tot el text per buscar paraules clau
  const context = [normalizedName, ...normalizedTags].join(' ');

  // --- NIVELL 1: PLATS ESPECÍFICS (Prioritat Màxima) ---
  if (context.includes('pizza')) return '🍕';
  if (context.includes('hamburg') || context.includes('burger')) return '🍔';
  if (context.includes('sushi') || context.includes('maki') || context.includes('nigiri')) return '🍣';
  if (context.includes('taco') || context.includes('mexic') || context.includes('fajita')) return '🌮';
  if (context.includes('burrito') || context.includes('durum')) return '🌯';
  if (context.includes('hot dog') || context.includes('frankfurt')) return '🌭';
  if (context.includes('crispetes') || context.includes('pop corn')) return '🍿';
  if (context.includes('patates fregides') || context.includes('braves')) return '🍟';
  if (context.includes('ramen') || context.includes('fideus xinesos')) return '🍜';

  // --- NIVELL 2: POSTRES I DOLÇOS ---
  // Fruita (IMPORTANT: Abans que "postres" genèric)
  if (context.includes('macedonia') || context.includes('fruita')) return '🍉';
  if (context.includes('maduix')) return '🍓';
  if (context.includes('poma')) return '🍎';
  if (context.includes('platan')) return '🍌';
  if (context.includes('llimona') || context.includes('sorbet')) return '🍋';
  if (context.includes('cirer')) return '🍒';
  
  // Dolços
  if (context.includes('xocolata') || context.includes('brownie') || context.includes('coulant')) return '🍫';
  if (context.includes('pastis') || context.includes('cake') || context.includes('tarta') || context.includes('tiramisu')) return '🍰';
  if (context.includes('gelat') || context.includes('ice cream')) return '🍦';
  if (context.includes('galetes') || context.includes('cookies')) return '🍪';
  if (context.includes('donut')) return '🍩';
  if (context.includes('croissant')) return '🥐';
  if (context.includes('pancake') || context.includes('crep')) return '🥞';
  if (context.includes('flam') || context.includes('crema catalana') || context.includes('pudding')) return '🍮';
  
  // Tag genèric de postres
  if (context.includes('postres') || context.includes('dessert') || context.includes('dolc')) return '🧁';

  // --- NIVELL 3: PLATS PRINCIPALS ---
  // Arrossos i Pasta
  if (context.includes('paella') || context.includes('arros')) return '🥘';
  if (context.includes('pasta') || context.includes('spaghetti') || context.includes('macarron') || context.includes('lasanya')) return '🍝';
  if (context.includes('fideu')) return '🍜';
  
  // Sopes i Cremes
  if (context.includes('sopa') || context.includes('crema') || context.includes('brou') || context.includes('escudella')) return '🥣';
  
  // Amanides
  if (context.includes('amanida') || context.includes('salad') || context.includes('cesar')) return '🥗';
  
  // Entrepans
  if (context.includes('entrepa') || context.includes('sandvitx') || context.includes('bikini')) return '🥪';
  
  // Ous
  if (context.includes('ou') || context.includes('truita') || context.includes('tortilla')) return '🍳';

  // --- NIVELL 4: BEGUDES ---
  if (context.includes('batut') || context.includes('smoothie')) return '🥤';
  if (context.includes('cafe') || context.includes('coffee')) return '☕';
  if (context.includes('cocktail') || context.includes('mojito')) return '🍹';
  if (context.includes('cervesa') || context.includes('beer')) return '🍺';
  if (context.includes('vi ') || context.includes('wine')) return '🍷';

  // --- NIVELL 5: INGREDIENT PRINCIPAL ---
  if (context.includes('pollastre') || context.includes('chicken') || context.includes('gall d')) return '🍗';
  if (context.includes('vedella') || context.includes('carn') || context.includes('steak') || context.includes('meat')) return '🥩';
  if (context.includes('porc') || context.includes('bacon') || context.includes('pernil')) return '🥓';
  if (context.includes('peix') || context.includes('fish') || context.includes('salmo') || context.includes('bacalla') || context.includes('orada')) return '🐟';
  if (context.includes('gamba') || context.includes('marisc') || context.includes('musclo')) return '🦐';
  if (context.includes('formatge') || context.includes('cheese')) return '🧀';

  // --- NIVELL 6: DIETES ---
  if (context.includes('vega') || context.includes('vegan')) return '🌱';
  if (context.includes('vegetaria')) return '🥦';

  return '🍽️';
}