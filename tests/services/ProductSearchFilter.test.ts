import { describe, it, expect } from 'vitest';
import {
  buildQueryTerms,
  filterProductsByQuery
} from '@/core/application/services/ProductSearchFilter';

describe('ProductSearchFilter', () => {
  it('normalitza accents i elimina stopwords quan genera termes', () => {
    const terms = buildQueryTerms("Llimona de l'hort");
    expect(terms).toEqual(['llimona', 'hort']);
  });

  it('descarta tokens de mesures quan genera termes', () => {
    const terms = buildQueryTerms('Llet 1L 500g');
    expect(terms).toEqual(['llet']);
  });

  it('conserva tokens curts claus quan genera termes', () => {
    const terms = buildQueryTerms('Pa barra');
    expect(terms).toEqual(['pa', 'barra']);
  });

  it('descarta coincidencies de sabor quan s activa avoidFlavorMatches', () => {
    const products = [
      { name: 'Patates fregides sabor xili i llima' }
    ];

    const result = filterProductsByQuery(products, {
      mustContain: ['llima'],
      avoidFlavorMatches: true
    });

    expect(result).toHaveLength(0);
  });

  it('accepta plurals basics en el mustContain', () => {
    const products = [
      { name: 'Llimones eco a granel' }
    ];

    const result = filterProductsByQuery(products, {
      mustContain: ['llimona']
    });

    expect(result).toHaveLength(1);
  });

  it('accepta singular quan la query es plural', () => {
    const products = [
      { name: 'Cuixa de pollastre' },
      { name: 'Cuixeta de cranc' }
    ];

    const result = filterProductsByQuery(products, {
      queryTerms: buildQueryTerms('cuixes')
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Cuixa de pollastre');
  });

  it('requereix coincidencia dels tokens curts claus', () => {
    const products = [
      { name: 'Barra de cereals' },
      { name: 'Pa integral' }
    ];

    const result = filterProductsByQuery(products, {
      queryTerms: buildQueryTerms('pa barra')
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Pa integral');
  });

  it('accepta fuzzy matching per retornar tomata quan la query es tomaquet', () => {
    const products = [
      { name: 'Tomata pebrot' },
      { name: 'Pebrot verd' }
    ];

    const result = filterProductsByQuery(products, {
      queryTerms: buildQueryTerms('tomàquet')
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Tomata pebrot');
  });

  it('usa emoji com a fallback quan la query no encaixa', () => {
    const products = [
      { name: 'Tomata pebrot' },
      { name: 'Alberginia' }
    ];

    const result = filterProductsByQuery(products, {
      queryTerms: buildQueryTerms('cabdell'),
      contextEmoji: '🍅'
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Tomata pebrot');
  });

  it('aplica ratio de coincidencia per queries multi paraula', () => {
    const products = [
      { name: 'Tomàquet cherry dolç' },
      { name: 'Tomàquet pera' }
    ];

    const result = filterProductsByQuery(products, {
      queryTerms: buildQueryTerms('tomàquet cherry'),
      minMatchRatio: 1
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toContain('Tomàquet cherry');
  });

  it('exclou coincidencies exactes de la llista exclude', () => {
    const products = [
      { name: 'Patates xips llima' },
      { name: 'Llimona natural' }
    ];

    const result = filterProductsByQuery(products, {
      exclude: ['xips']
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Llimona natural');
  });

  it('aplica bloqueig de categoria per evitar neteja o carn a verdura', () => {
    const products = [
      { name: 'Detergent neteja multius' },
      { name: 'Pollastre a l ast' },
      { name: 'Carbassó fresc' }
    ];

    const result = filterProductsByQuery(products, {
      categoryId: 'vegetables'
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Carbassó fresc');
  });

  it('bloqueja marisc quan la categoria es carn', () => {
    const products = [
      { name: 'Cuixeta de cranc' },
      { name: 'Cuixa de pollastre' }
    ];

    const result = filterProductsByQuery(products, {
      queryTerms: buildQueryTerms('cuixa'),
      categoryId: 'meat'
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Cuixa de pollastre');
  });
});
