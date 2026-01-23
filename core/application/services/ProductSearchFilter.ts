import { FOOD_PRESETS } from '@/lib/food-presets';

export interface ProductNameLike {
  name: string;
}

export interface ProductSearchFilterOptions {
  exclude?: string[];
  mustContain?: string | string[];
  queryTerms?: string[];
  minMatchRatio?: number;
  minMatchCount?: number;
  avoidFlavorMatches?: boolean;
  categoryId?: string;
  contextEmoji?: string;
}

const STOPWORDS = new Set([
  'de', 'del', 'd', 'la', 'el', 'l', 'les', 'els', 'un', 'una', 'uns', 'unes',
  'amb', 'i', 'y', 'a', 'al', 'als', 'en', 'per', 'o', 'u', 'que', 'com',
  'sabor', 'gust', 'aroma',
  'kg', 'g', 'gr', 'gram', 'grams', 'ml', 'l', 'lt', 'litre', 'litres',
  'ud', 'uds', 'ut', 'unitat', 'unitats'
]);

const SHORT_QUERY_TERMS = new Set(['pa', 'ou', 'vi', 'te']);

const FLAVOR_INDICATORS = [
  'sabor', 'gust', 'aroma', 'flavor',
  'sabor a', 'sabor de', 'gust a', 'gust de', 'aroma a', 'aroma de', 'amb sabor', 'amb gust'
];

const DIMINUTIVE_SUFFIXES = [
  'eta', 'etes',
  'ito', 'ita', 'itos', 'itas',
  'illo', 'illa', 'illos', 'illas'
];

const HOUSEHOLD_TERMS = [
  'detergent', 'neteja', 'sabó', 'jabo', 'lavavaixelles', 'rentavaixelles',
  'ambientador', 'lleixiu', 'desinfectant', 'suavitzant', 'fregasuelos',
  'neteja vidres', 'neteja bany', 'neteja cuina', 'paper', 'bolsa brossa',
  'insecticida', 'guant', 'guants', 'escombra', 'mopa', 'baieta', 'baietes'
];

const MEAT_TERMS = [
  'pollastre', 'porc', 'vedella', 'carn', 'hamburguesa', 'salsitxa', 'salsitxes',
  'xai', 'conill', 'cansalada', 'costella', 'entrecot', 'filet'
];

const FISH_TERMS = [
  'peix', 'tonyina', 'salmó', 'salmo', 'bacalla', 'seitó', 'seitons',
  'marisc', 'gamba', 'calamar', 'pop', 'sardina', 'cranc', 'crancs',
  'crustaci', 'crustacis', 'llagosta', 'llagosti', 'ostres', 'ostra',
  'musclo', 'musclos', 'escamarlan', 'escamarlans', 'navalla', 'navalles'
];

const CHARCUTERIE_TERMS = [
  'embotit', 'pernil', 'fuet', 'xoriço', 'xoriç', 'bull', 'mortadella'
];

const CATEGORY_EXCLUDES: Record<string, string[]> = {
  vegetables: [...HOUSEHOLD_TERMS, ...MEAT_TERMS, ...FISH_TERMS, ...CHARCUTERIE_TERMS],
  fruit: [...HOUSEHOLD_TERMS, ...MEAT_TERMS, ...FISH_TERMS, ...CHARCUTERIE_TERMS],
  meat: [...HOUSEHOLD_TERMS, ...FISH_TERMS],
  fish: [...HOUSEHOLD_TERMS, ...MEAT_TERMS, ...CHARCUTERIE_TERMS],
  household: []
};

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function tokenize(text: string): string[] {
  if (!text) return [];
  return normalizeText(text)
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
}

function commonPrefixLength(a: string, b: string): number {
  const limit = Math.min(a.length, b.length);
  let i = 0;
  while (i < limit && a[i] === b[i]) i += 1;
  return i;
}

function levenshteinDistance(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;
  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  const matrix: number[] = new Array(bLen + 1);
  for (let i = 0; i <= bLen; i += 1) matrix[i] = i;

  for (let i = 1; i <= aLen; i += 1) {
    let prev = i - 1;
    matrix[0] = i;
    for (let j = 1; j <= bLen; j += 1) {
      const temp = matrix[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j] = Math.min(
        matrix[j] + 1,
        matrix[j - 1] + 1,
        prev + cost
      );
      prev = temp;
    }
  }

  return matrix[bLen];
}

function isFuzzyTokenMatch(token: string, term: string): boolean {
  if (token === term) return true;
  if (token.length < 4 || term.length < 4) return false;
  const tokenIsDim = DIMINUTIVE_SUFFIXES.some(suffix => token.endsWith(suffix));
  const termIsDim = DIMINUTIVE_SUFFIXES.some(suffix => term.endsWith(suffix));
  if (tokenIsDim !== termIsDim) return false;
  const prefix = commonPrefixLength(token, term);
  if (prefix >= 4) return true;
  const distance = levenshteinDistance(token, term);
  const ratio = distance / Math.max(token.length, term.length);
  return ratio <= 0.34;
}

function expandTermVariants(term: string): string[] {
  const normalized = normalizeText(term);
  if (!normalized) return [];
  const variants = new Set([normalized]);
  if (normalized.endsWith('es') && normalized.length > 3) {
    const base = normalized.slice(0, -2);
    variants.add(base);
    variants.add(`${base}a`);
    variants.add(`${base}e`);
  }
  if (normalized.endsWith('s') && normalized.length > 3) {
    variants.add(normalized.slice(0, -1));
  }
  variants.add(`${normalized}s`);
  variants.add(`${normalized}es`);
  if (/[aeo]$/.test(normalized)) {
    variants.add(`${normalized.slice(0, -1)}es`);
  }
  return Array.from(variants);
}

function matchesTerm(tokens: string[], normalizedText: string, term: string, allowFuzzy: boolean): boolean {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm) return false;

  if (normalizedTerm.includes(' ')) {
    const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    return regex.test(normalizedText);
  }

  const variants = expandTermVariants(normalizedTerm);
  return variants.some(variant => {
    if (tokens.includes(variant)) return true;
    if (!allowFuzzy) return false;
    return tokens.some(token => isFuzzyTokenMatch(token, variant));
  });
}

function countMatches(terms: string[], tokens: string[], normalizedText: string, allowFuzzy: boolean): number {
  return terms.reduce((acc, term) => (matchesTerm(tokens, normalizedText, term, allowFuzzy) ? acc + 1 : acc), 0);
}

function findFlavorIndicatorIndex(normalizedText: string): number {
  let firstIndex = -1;
  for (const indicator of FLAVOR_INDICATORS) {
    const idx = normalizedText.indexOf(indicator);
    if (idx !== -1 && (firstIndex === -1 || idx < firstIndex)) {
      firstIndex = idx;
    }
  }
  return firstIndex;
}

function hasNonFlavorMatch(terms: string[], normalizedText: string): boolean {
  const indicatorIndex = findFlavorIndicatorIndex(normalizedText);
  if (indicatorIndex === -1) return true;

  for (const term of terms) {
    const normalizedTerm = normalizeText(term);
    if (!normalizedTerm) continue;
    const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    const match = regex.exec(normalizedText);
    if (match && match.index < indicatorIndex) return true;
  }
  return false;
}

export function buildQueryTerms(input: string | string[]): string[] {
  const rawTokens = Array.isArray(input) ? input.flatMap(tokenize) : tokenize(input);
  return rawTokens.filter(token => {
    if (token.length < 3 && !SHORT_QUERY_TERMS.has(token)) return false;
    if (!/[a-z]/i.test(token)) return false;
    if (STOPWORDS.has(token)) return false;
    if (/^\d+(?:[.,]\d+)?(kg|g|gr|ml|l|lt|ud|uds|ut)$/i.test(token)) return false;
    return true;
  });
}

function buildEmojiTerms(emoji?: string): string[] {
  if (!emoji) return [];
  const presetNames = FOOD_PRESETS.filter(preset => preset.emoji === emoji)
    .map(preset => preset.name);
  return buildQueryTerms(presetNames);
}

export function filterProductsByQuery<T extends ProductNameLike>(
  products: T[],
  options: ProductSearchFilterOptions = {}
): T[] {
  const categoryExcludes = options.categoryId ? (CATEGORY_EXCLUDES[options.categoryId] || []) : [];
  const exclude = [...categoryExcludes, ...(options.exclude || [])];
  const mustContain = options.mustContain
    ? Array.isArray(options.mustContain)
      ? options.mustContain
      : [options.mustContain]
    : [];
  const queryTerms = options.queryTerms || [];
  const minMatchRatio = options.minMatchRatio ?? 0.5;
  const minMatchCount = options.minMatchCount ?? 1;
  const avoidFlavorMatches = options.avoidFlavorMatches ?? false;
  const emojiTerms = buildEmojiTerms(options.contextEmoji);
  const primaryTerms = queryTerms.length > 0 ? queryTerms : emojiTerms;
  const fallbackTerms = queryTerms.length > 0 ? emojiTerms : [];
  const anchorTerms = primaryTerms.filter(term => SHORT_QUERY_TERMS.has(normalizeText(term)));

  const scored = products
    .map(product => {
      const normalizedText = normalizeText(product.name);
      const tokens = tokenize(product.name);

      if (exclude.length > 0) {
        const hasExcluded = exclude.some(term => matchesTerm(tokens, normalizedText, term, false));
        if (hasExcluded) return null;
      }

      if (mustContain.length > 0) {
        const matchesRequired = countMatches(mustContain, tokens, normalizedText, true);
        if (matchesRequired === 0) return null;
        if (avoidFlavorMatches && !hasNonFlavorMatch(mustContain, normalizedText)) return null;
      }

      let matchCount = 0;
      if (primaryTerms.length > 0) {
        if (anchorTerms.length > 0) {
          const anchorMatches = countMatches(anchorTerms, tokens, normalizedText, false);
          if (anchorMatches === 0) return null;
        }

        matchCount = countMatches(primaryTerms, tokens, normalizedText, true);
        const requiredMatches = Math.max(minMatchCount, Math.ceil(primaryTerms.length * minMatchRatio));
        let usesFallback = false;
        if (matchCount < requiredMatches && fallbackTerms.length > 0) {
          const fallbackMatches = countMatches(fallbackTerms, tokens, normalizedText, true);
          if (fallbackMatches >= 1) {
            matchCount = fallbackMatches;
            usesFallback = true;
          } else {
            return null;
          }
        } else if (matchCount < requiredMatches) {
          return null;
        }

        const flavorTerms = usesFallback ? fallbackTerms : primaryTerms;
        if (avoidFlavorMatches && !hasNonFlavorMatch(flavorTerms, normalizedText)) return null;
      }

      return { product, score: matchCount };
    })
    .filter(Boolean) as { product: T; score: number }[];

  scored.sort((a, b) => b.score - a.score);
  return scored.map(item => item.product);
}
