import { describe, it, expect } from 'vitest';
import { PANTRY_CATEGORY } from '@/lib/taxonamy/pantry';
import { buildQueryTerms, filterProductsByQuery } from '@/core/application/services/ProductSearchFilter';

describe('ProductSearchFilter pantry flow', () => {
  it('retorna pa del rebost i evita barres que no son pa', () => {
    const products = [
      { name: 'Pa integral' },
      { name: 'Pa de motlle' },
      { name: 'Barra de cereals' },
      { name: 'Galetes integrals' },
      { name: 'Bastonets de pa amb pipes' },
      { name: 'Donuts banyats' },
      { name: 'Pasta fusilli' }
    ];

    const subcategory = PANTRY_CATEGORY.subcategories.find(sub => sub.id === 'bread');
    if (!subcategory) throw new Error('Missing pantry bread subcategory');

    const queries = Array.isArray(subcategory.query) ? subcategory.query : [subcategory.query];
    const results = queries.flatMap(query => filterProductsByQuery(products, {
      queryTerms: buildQueryTerms(query),
      exclude: subcategory.exclude,
      mustContain: subcategory.mustContain,
      avoidFlavorMatches: true,
      categoryId: PANTRY_CATEGORY.id
    }));

    const names = results.map(item => item.name);
    expect(names).toContain('Pa integral');
    expect(names).toContain('Pa de motlle');
    expect(names).not.toContain('Barra de cereals');
    expect(names).not.toContain('Galetes integrals');
    expect(names).not.toContain('Bastonets de pa amb pipes');
    expect(names).not.toContain('Donuts banyats');
    expect(names).not.toContain('Pasta fusilli');
  });

  it('retorna maioneses i evita altres salses', () => {
    const products = [
      { name: 'Mayonesa Sispalu' },
      { name: 'Maionesa lleugera' },
      { name: 'Ketchup' }
    ];

    const subcategory = PANTRY_CATEGORY.subcategories.find(sub => sub.id === 'sauces');
    if (!subcategory) throw new Error('Missing pantry sauces subcategory');

    const queries = Array.isArray(subcategory.query) ? subcategory.query : [subcategory.query];
    const results = queries.flatMap(query => filterProductsByQuery(products, {
      queryTerms: buildQueryTerms(query),
      exclude: subcategory.exclude,
      mustContain: subcategory.mustContain,
      avoidFlavorMatches: true,
      categoryId: PANTRY_CATEGORY.id
    }));

    const names = results.map(item => item.name);
    expect(names).toContain('Mayonesa Sispalu');
    expect(names).toContain('Maionesa lleugera');
    expect(names).not.toContain('Ketchup');
  });

  it('retorna sucre en diferents variants i evita sucs', () => {
    const products = [
      { name: 'Sucre blanc' },
      { name: 'Azucar moreno' },
      { name: 'Suc de taronja' }
    ];

    const subcategory = PANTRY_CATEGORY.subcategories.find(sub => sub.id === 'sugar');
    if (!subcategory) throw new Error('Missing pantry sugar subcategory');

    const queries = Array.isArray(subcategory.query) ? subcategory.query : [subcategory.query];
    const results = queries.flatMap(query => filterProductsByQuery(products, {
      queryTerms: buildQueryTerms(query),
      exclude: subcategory.exclude,
      mustContain: subcategory.mustContain,
      avoidFlavorMatches: true,
      categoryId: PANTRY_CATEGORY.id
    }));

    const names = results.map(item => item.name);
    expect(names).toContain('Sucre blanc');
    expect(names).toContain('Azucar moreno');
    expect(names).not.toContain('Suc de taronja');
  });

  it('retorna llegums variats i evita hummus', () => {
    const products = [
      { name: 'Llenties cuites' },
      { name: 'Mongetes blanques' },
      { name: 'Cigrons cuits' },
      { name: 'Hummus de cigrons' }
    ];

    const subcategory = PANTRY_CATEGORY.subcategories.find(sub => sub.id === 'legumes');
    if (!subcategory) throw new Error('Missing pantry legumes subcategory');

    const queries = Array.isArray(subcategory.query) ? subcategory.query : [subcategory.query];
    const results = queries.flatMap(query => filterProductsByQuery(products, {
      queryTerms: buildQueryTerms(query),
      exclude: subcategory.exclude,
      mustContain: subcategory.mustContain,
      avoidFlavorMatches: true,
      categoryId: PANTRY_CATEGORY.id
    }));

    const names = results.map(item => item.name);
    expect(names).toContain('Llenties cuites');
    expect(names).toContain('Mongetes blanques');
    expect(names).toContain('Cigrons cuits');
    expect(names).not.toContain('Hummus de cigrons');
  });

  it('retorna pasta i evita productes relacionats amb pasta', () => {
    const products = [
      { name: 'Macarrons' },
      { name: 'Espaguetis' },
      { name: 'Pasta Bonpreu' },
      { name: 'Pastanaga' },
      { name: 'Formatge ratllat especial pasta' }
    ];

    const subcategory = PANTRY_CATEGORY.subcategories.find(sub => sub.id === 'pasta');
    if (!subcategory) throw new Error('Missing pantry pasta subcategory');

    const queries = Array.isArray(subcategory.query) ? subcategory.query : [subcategory.query];
    const results = queries.flatMap(query => filterProductsByQuery(products, {
      queryTerms: buildQueryTerms(query),
      exclude: subcategory.exclude,
      mustContain: subcategory.mustContain,
      avoidFlavorMatches: true,
      categoryId: PANTRY_CATEGORY.id
    }));

    const names = results.map(item => item.name);
    expect(names).toContain('Macarrons');
    expect(names).toContain('Espaguetis');
    expect(names).toContain('Pasta Bonpreu');
    expect(names).not.toContain('Pastanaga');
    expect(names).not.toContain('Formatge ratllat especial pasta');
  });

  it('retorna oli de gira-sol i evita tonyina', () => {
    const products = [
      { name: 'Oli de girasol' },
      { name: 'Tonyina en oli de girasol' }
    ];

    const subcategory = PANTRY_CATEGORY.subcategories.find(sub => sub.id === 'sunflower');
    if (!subcategory) throw new Error('Missing pantry sunflower subcategory');

    const queries = Array.isArray(subcategory.query) ? subcategory.query : [subcategory.query];
    const results = queries.flatMap(query => filterProductsByQuery(products, {
      queryTerms: buildQueryTerms(query),
      exclude: subcategory.exclude,
      mustContain: subcategory.mustContain,
      avoidFlavorMatches: true,
      categoryId: PANTRY_CATEGORY.id
    }));

    const names = results.map(item => item.name);
    expect(names).toContain('Oli de girasol');
    expect(names).not.toContain('Tonyina en oli de girasol');
  });
});
