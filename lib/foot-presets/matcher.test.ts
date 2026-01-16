import { describe, it, expect } from 'vitest';
import { getIngredientEmoji } from './matcher';

// Aquest test assumeix que tens certs presets a la teva llista. 
// Si la llista és buida al test, fallarà. Assegura't que FOOD_PRESETS carrega dades.

describe('Food Matcher', () => {
  it('hauria de trobar l\'emoji del pollastre en un string complex', () => {
    // Si tens un preset amb id: 'pollastre' i emoji: '🍗'
    expect(getIngredientEmoji('200g de pit de pollastre')).toBe('🍗');
  });

  it('hauria de trobar l\'emoji de la poma', () => {
    expect(getIngredientEmoji('Una poma vermella')).toBe('🍎'); // O l'emoji que tinguis definit
  });

  it('hauria de retornar fallback per ingredients desconeguts', () => {
    expect(getIngredientEmoji('Kryptonita radioactiva')).toBe('🥘');
  });
});