import { ProductResult } from '@/app/actions/inventory';
import { getIngredientEmoji } from '@/lib/utils/emojiUtils';

function normalizeId(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function buildManualProduct(name: string, emoji?: string): ProductResult {
  const safeName = name.trim() || 'Producte';
  return {
    id: `manual:${normalizeId(safeName)}`,
    name: safeName,
    price: 0,
    image: '',
    source: 'manual',
    emoji: emoji || getIngredientEmoji(safeName),
    tags: []
  };
}
