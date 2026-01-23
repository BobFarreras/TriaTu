import { describe, it, expect } from 'vitest';
import { hasExactTokenMatch } from '@/core/application/services/ExactTokenMatcher';

describe('ExactTokenMatcher', () => {
  it('fa match exacte de token amb accents', () => {
    expect(hasExactTokenMatch('Orada fresca', 'orada')).toBe(true);
  });

  it('no fa match quan nomes hi ha coincidencia parcial', () => {
    expect(hasExactTokenMatch('Galetes dorada', 'orada')).toBe(false);
  });
});
