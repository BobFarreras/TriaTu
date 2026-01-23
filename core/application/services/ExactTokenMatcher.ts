function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function hasExactTokenMatch(text: string, term: string): boolean {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm) return false;

  const tokens = normalizeText(text).split(/[^a-z0-9]+/i).filter(Boolean);
  return tokens.includes(normalizedTerm);
}
