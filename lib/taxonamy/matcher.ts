import { FOOD_TAXONOMY } from './index';
import { SubCategory } from './types';

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function findTaxonomyMatch(name: string): { categoryId: string; sub: SubCategory } | null {
  const normalizedName = normalizeText(name);
  if (!normalizedName) return null;

  for (const cat of FOOD_TAXONOMY) {
    for (const sub of cat.subcategories) {
      const normalizedLabel = normalizeText(sub.label);
      if (normalizedLabel === normalizedName) return { categoryId: cat.id, sub };
      if (normalizedName.includes(normalizedLabel) || normalizedLabel.includes(normalizedName)) {
        return { categoryId: cat.id, sub };
      }

      const queries = Array.isArray(sub.query) ? sub.query : [sub.query];
      for (const query of queries) {
        const normalizedQuery = normalizeText(query);
        if (!normalizedQuery) continue;
        if (normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName)) {
          return { categoryId: cat.id, sub };
        }
      }
    }
  }

  return null;
}
