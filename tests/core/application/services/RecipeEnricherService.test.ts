import { describe, it, expect } from 'vitest';
import { RecipeEnricherService } from '@/core/application/services/RecipeEnricherService';
import { Recipe } from '@/core/domain/entities/Recipe';
import { Product } from '@/core/domain/entities/Product';
import { ProductCatalogRepository } from '@/core/ports/ProductCatalogRepository';

class FakeCatalogRepo implements ProductCatalogRepository {
  public readonly queries: string[] = [];

  constructor(private readonly matches: Record<string, Product[]>) {}

  async saveBatch(products: Product[]): Promise<Product[]> {
    return products;
  }

  async searchByName(query: string): Promise<Product[]> {
    this.queries.push(query);
    return this.matches[query] || [];
  }

  async findByExternalId(): Promise<Product | null> {
    return null;
  }
}

const baseRecipe = new Recipe({
  id: 'recipe-1',
  authorId: 'user-1',
  name: 'Torrada verda',
  ingredients: [
    { id: 'ing-1', name: 'Tomàquet', quantity: 1, unit: 'ut' },
    { id: 'ing-2', name: 'Pa', quantity: 2, unit: 'llesc' }
  ],
  steps: ['Torrar el pa.'],
  tags: [],
  dietaryTags: [],
  prepTimeMinutes: 10,
  createdAt: new Date(),
  likesCount: 0,
  isPublic: false,
  estimatedCost: 0,
  ratingSummary: { average: 0, count: 0, distribution: {} }
});

describe('RecipeEnricherService', () => {
  it('enriches ingredients with catalog matches and totals cost', async () => {
    const product = new Product({
      id: 'prod-1',
      externalId: 'ext-1',
      name: 'Tomàquet de branca',
      price: 0.6,
      currency: 'EUR',
      image: 'https://example.com/tomato.png',
      url: 'https://example.com/tomato',
      source: 'BONPREU',
      tags: [],
      emoji: '🍅',
      lastUpdated: new Date()
    });

    const repo = new FakeCatalogRepo({ Tomàquet: [product] });
    const service = new RecipeEnricherService(repo);

    const enriched = await service.enrichRecipe(baseRecipe);
    const props = enriched.toPrimitives();
    const tomato = props.ingredients.find((ing) => ing.name === 'Tomàquet');
    const bread = props.ingredients.find((ing) => ing.name === 'Pa');

    expect(tomato?.linkedProductId).toBe('prod-1');
    expect(tomato?.linkedProductImage).toBe('https://example.com/tomato.png');
    expect(tomato?.estimatedCost).toBe(0.6);
    expect(bread?.linkedProductId).toBeNull();
    expect(props.estimatedCost).toBe(0.6);
  });

  it('normalizes ingredient names to improve catalog matching', async () => {
    const product = new Product({
      id: 'prod-2',
      externalId: 'ext-2',
      name: 'Bolets',
      price: 1.2,
      currency: 'EUR',
      image: 'https://example.com/bolets.png',
      url: 'https://example.com/bolets',
      source: 'BONPREU',
      tags: [],
      emoji: '🍄',
      lastUpdated: new Date()
    });

    const repo = new FakeCatalogRepo({ Bolets: [product] });
    const service = new RecipeEnricherService(repo);

    const recipe = new Recipe({
      ...baseRecipe.props,
      id: 'recipe-2',
      name: 'Sopa de bolets',
      ingredients: [
        {
          id: 'ing-3',
          name: "Bolets (xampinyons o bolets d'ostra), tallats a rodanxes",
          quantity: 150,
          unit: 'g'
        }
      ]
    });

    const enriched = await service.enrichRecipe(recipe);
    const props = enriched.toPrimitives();

    expect(repo.queries.some((q) => q.includes('Bolets'))).toBe(true);
    expect(props.ingredients[0]?.linkedProductId).toBe('prod-2');
    expect(props.ingredients[0]?.linkedProductImage).toBe('https://example.com/bolets.png');
  });

  it('prioritizes special queries for salt and pepper', async () => {
    const saltProduct = new Product({
      id: 'prod-salt',
      externalId: 'ext-salt',
      name: 'Sal marina',
      price: 0.45,
      currency: 'EUR',
      image: 'https://example.com/salt.png',
      url: 'https://example.com/salt',
      source: 'BONPREU',
      tags: [],
      emoji: '🧂',
      lastUpdated: new Date()
    });

    const repo = new FakeCatalogRepo({ 'sal marina': [saltProduct] });
    const service = new RecipeEnricherService(repo);

    const recipe = new Recipe({
      ...baseRecipe.props,
      id: 'recipe-3',
      name: 'Saladeta',
      ingredients: [
        { id: 'ing-salt', name: 'Sal', quantity: 1, unit: 'culleradeta' }
      ]
    });

    const enriched = await service.enrichRecipe(recipe);
    const props = enriched.toPrimitives();

    expect(repo.queries.some((q) => q.includes('sal marina'))).toBe(true);
    expect(props.ingredients[0]?.linkedProductId).toBe('prod-salt');
    expect(props.ingredients[0]?.linkedProductImage).toBe('https://example.com/salt.png');
  });

  it('uses special queries when ingredient includes salt and pepper', async () => {
    const pepperProduct = new Product({
      id: 'prod-pepper',
      externalId: 'ext-pepper',
      name: 'Pebre molt',
      price: 0.55,
      currency: 'EUR',
      image: 'https://example.com/pepper.png',
      url: 'https://example.com/pepper',
      source: 'BONPREU',
      tags: [],
      emoji: '🧂',
      lastUpdated: new Date()
    });

    const repo = new FakeCatalogRepo({ 'pebre molt': [pepperProduct] });
    const service = new RecipeEnricherService(repo);

    const recipe = new Recipe({
      ...baseRecipe.props,
      id: 'recipe-4',
      name: 'Salmó',
      ingredients: [
        { id: 'ing-saltpepper', name: 'Sal i pebre negre', quantity: 1, unit: 'al gust' }
      ]
    });

    const enriched = await service.enrichRecipe(recipe);
    const props = enriched.toPrimitives();

    expect(repo.queries.some((q) => q.includes('sal marina'))).toBe(true);
    expect(repo.queries.some((q) => q.includes('pebre molt'))).toBe(true);
    expect(props.ingredients[0]?.linkedProductId).toBe('prod-pepper');
  });

  it('normalizes lemon zest and avoids household matches', async () => {
    const lemonProduct = new Product({
      id: 'prod-lemon',
      externalId: 'ext-lemon',
      name: 'Llimona',
      price: 0.5,
      currency: 'EUR',
      image: 'https://example.com/lemon.png',
      url: 'https://example.com/lemon',
      source: 'BONPREU',
      tags: [],
      emoji: '🍋',
      lastUpdated: new Date()
    });

    const repo = new FakeCatalogRepo({ llimona: [lemonProduct] });
    const service = new RecipeEnricherService(repo);

    const recipe = new Recipe({
      ...baseRecipe.props,
      id: 'recipe-5',
      name: 'Llimona',
      ingredients: [
        { id: 'ing-lemon', name: 'Ratlladura de 1/2 llimona', quantity: 0.5, unit: 'ut' }
      ]
    });

    const enriched = await service.enrichRecipe(recipe);
    const props = enriched.toPrimitives();

    expect(repo.queries.some((q) => q.includes('llimona'))).toBe(true);
    expect(props.ingredients[0]?.linkedProductId).toBe('prod-lemon');
    expect(props.ingredients[0]?.linkedProductImage).toBe('https://example.com/lemon.png');
  });
});
