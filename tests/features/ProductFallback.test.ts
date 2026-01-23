import { describe, it, expect } from 'vitest';
import { buildManualProduct } from '@/features/inventory/products/productFallback';

describe('productFallback', () => {
  it('crea un item manual amb emoji i id normalitzat', () => {
    const result = buildManualProduct('Pa de pagès', '🥖');
    expect(result.name).toBe('Pa de pagès');
    expect(result.emoji).toBe('🥖');
    expect(result.source).toBe('manual');
    expect(result.id).toBe('manual:pa-de-pages');
  });

  it('utilitza el fallback generic si el nom es buit', () => {
    const result = buildManualProduct('   ');
    expect(result.name).toBe('Producte');
    expect(result.id).toBe('manual:producte');
  });
});
