import { buildQueryTerms } from './ProductSearchFilter';

export function buildSearchQueries(input: string, limit: number = 4): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const tokens = buildQueryTerms(trimmed);
  const combined = [trimmed, ...tokens];
  const unique = Array.from(new Set(combined))
    .map(term => term.trim())
    .filter(term => term.length >= 3);

  return unique.slice(0, limit);
}
