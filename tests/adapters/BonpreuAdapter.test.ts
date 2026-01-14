import { describe, it, expect, vi, type Mock } from 'vitest'; // ✅ Importem 'Mock'
import { BonpreuAdapter } from '@/adapters/external/BonpreuAdapter';

// Mock de fetch global
global.fetch = vi.fn();

describe('BonpreuAdapter', () => {
  it('hauria de transformar el JSON de Bonpreu al nostre format ScrapedProduct', async () => {
    // 1. ARRANGE
    const fakeResponse = {
        productGroups: [{
            type: 'cluster',
            decoratedProducts: [{
                productId: '123-abc',
                name: 'Llet Nostra',
                price: { amount: '1.20', currency: 'EUR' },
                image: { src: 'https://img.com/llet.jpg' },
                iconAttributes: [{ label: 'Eco', file: 'eco' }]
            }]
        }]
    };

    // ✅ FIX: Usem 'as Mock' en lloc de 'as any' per tenir autocompletat i evitar linter errors
    (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: async () => fakeResponse
    });

    const adapter = new BonpreuAdapter();

    // 2. ACT
    const results = await adapter.search('llet');

    // 3. ASSERT
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Llet Nostra');
    expect(results[0].price).toBe(1.20);
    expect(results[0].source).toBe('BONPREU');
    expect(results[0].tags).toContain('ECO');
    expect(results[0].emoji).toBeDefined();
  });

  it('hauria de gestionar errors de xarxa gràcilment', async () => {
    // ✅ FIX: Usem 'as Mock'
    (global.fetch as Mock).mockRejectedValue(new Error('Bonpreu caigut'));
    const adapter = new BonpreuAdapter();
    
    const results = await adapter.search('fail');
    expect(results).toEqual([]);
  });
});