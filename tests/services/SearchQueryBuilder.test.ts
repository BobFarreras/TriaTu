import { describe, it, expect } from 'vitest';
import { buildSearchQueries } from '@/core/application/services/SearchQueryBuilder';

describe('SearchQueryBuilder', () => {
  it('genera queries a partir del nom complet i tokens', () => {
    const queries = buildSearchQueries('Llet nostre desnatada');
    expect(queries).toEqual(['Llet nostre desnatada', 'llet', 'nostre', 'desnatada']);
  });

  it('ignora inputs buits', () => {
    const queries = buildSearchQueries('   ');
    expect(queries).toEqual([]);
  });

  it('descarta tokens massa curts per a la cerca', () => {
    const queries = buildSearchQueries('Pa de pagès');
    expect(queries).toEqual(['Pa de pagès', 'pages']);
  });
});
