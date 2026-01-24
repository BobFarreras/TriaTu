import { Recipe } from '@/core/domain/entities/Recipe';
import { ProductCatalogRepository } from '@/core/ports/ProductCatalogRepository';
import { buildQueryTerms, filterProductsByQuery } from '@/core/application/services/ProductSearchFilter';
import { buildSearchQueries } from '@/core/application/services/SearchQueryBuilder';
import { EmojiMatcherService } from '@/core/application/services/EmojiMatcherService';

export class RecipeEnricherService {
  constructor(private catalogRepo: ProductCatalogRepository) {}

  private static readonly HOUSEHOLD_EXCLUDES = [
    'detergent', 'neteja', 'sabó', 'jabo', 'lavavaixelles', 'rentavaixelles',
    'ambientador', 'lleixiu', 'desinfectant', 'suavitzant', 'fregasuelos',
    'neteja vidres', 'neteja bany', 'neteja cuina', 'paper', 'bolsa brossa',
    'insecticida', 'guant', 'guants', 'escombra', 'mopa', 'baieta', 'baietes'
  ];

  private static readonly CHARCUTERIE_EXCLUDES = [
    'embotit', 'pernil', 'fuet', 'xoriço', 'xoriç', 'bull', 'mortadella',
    'salsitxa', 'salsitxes', 'hamburguesa', 'butifarra'
  ];

  private static readonly FISH_EXCLUDES = [
    'tonyina', 'sardina', 'salmó', 'salmo', 'bacalla', 'seitó', 'seitons',
    'vermut', 'escabetx'
  ];

  private static readonly SPECIAL_QUERIES: Record<string, { queries: string[]; mustContain?: string[]; exclude?: string[] }> = {
    sal: { queries: ['sal marina'], mustContain: ['sal'], exclude: RecipeEnricherService.CHARCUTERIE_EXCLUDES },
    pebre: { queries: ['pebre molt'], mustContain: ['pebre'], exclude: RecipeEnricherService.CHARCUTERIE_EXCLUDES },
    'pebre negre': { queries: ['pebre molt'], mustContain: ['pebre'], exclude: RecipeEnricherService.CHARCUTERIE_EXCLUDES },
    'sal i pebre negre': { queries: ['sal marina', 'pebre molt'], mustContain: ['sal', 'pebre'], exclude: RecipeEnricherService.CHARCUTERIE_EXCLUDES },
    'sal i pebre': { queries: ['sal marina', 'pebre molt'], mustContain: ['sal', 'pebre'], exclude: RecipeEnricherService.CHARCUTERIE_EXCLUDES },
    'ratlladura de llimona': { queries: ['llimona'], mustContain: ['llimona'], exclude: RecipeEnricherService.HOUSEHOLD_EXCLUDES },
    'suc de llimona': { queries: ['llimona'], mustContain: ['llimona'], exclude: RecipeEnricherService.HOUSEHOLD_EXCLUDES },
    'oli d oliva verge extra': { queries: ['oli d oliva verge extra'], mustContain: ['oli', 'oliva'], exclude: RecipeEnricherService.FISH_EXCLUDES }
  };

  private static readonly PLACEHOLDER_EMOJIS = new Set(['🛒', '🥘', '📦', '??', '❓']);

  private removeAccents(input: string): string {
    return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private normalizeIngredientName(name: string): string {
    const withoutParens = name.replace(/\([^)]*\)/g, ' ');
    const primarySegment = withoutParens.split(',')[0] || withoutParens;
    return primarySegment
      .replace(/^\s*(suc|ratlladura|pell|fines|fineses|finesa)\s+de\s+/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private buildQueryVariants(name: string): string[] {
    const normalized = this.normalizeIngredientName(name);
    const normalizedLower = normalized.toLowerCase();
    const withoutAccents = this.removeAccents(normalized);
    const withoutAccentsLower = withoutAccents.toLowerCase();
    const specialProfile = RecipeEnricherService.SPECIAL_QUERIES[normalizedLower]
      || RecipeEnricherService.SPECIAL_QUERIES[this.removeAccents(normalizedLower)];
    const specialQueries = specialProfile?.queries || [];
    const baseQueries = buildSearchQueries(normalized);
    const accentQueries = normalized !== withoutAccents ? buildSearchQueries(withoutAccents) : [];
    const specialQueryTerms = specialQueries.flatMap((query) => buildSearchQueries(query));

    return Array.from(
      new Set([
        ...specialQueries,
        ...specialQueryTerms,
        ...baseQueries,
        ...accentQueries,
        normalizedLower !== normalized ? normalizedLower : null,
        withoutAccentsLower !== withoutAccents ? withoutAccentsLower : null
      ].filter(Boolean) as string[])
    );
  }

  private async findBestMatch(name: string, emoji?: string) {
    const normalizedName = this.normalizeIngredientName(name);
    const normalizedKey = normalizedName.toLowerCase();
    const specialProfile = RecipeEnricherService.SPECIAL_QUERIES[normalizedKey];
    const specialQueries = specialProfile?.queries || [];
    const queries = this.buildQueryVariants(name);
    if (queries.length === 0) return null;

    const results = await Promise.all(queries.map((query) => this.catalogRepo.searchByName(query)));
    const candidates = results.flat();
    if (candidates.length === 0) return null;

    const unique = Array.from(new Map(candidates.map((item) => [item.id, item])).values());
    const primaryQuery = specialQueries[0] || normalizedName;
    const queryTerms = buildQueryTerms(primaryQuery);
    const filtered = filterProductsByQuery(unique, {
      queryTerms,
      minMatchCount: Math.max(1, Math.min(2, queryTerms.length)),
      minMatchRatio: 0.5,
      avoidFlavorMatches: true,
      mustContain: specialProfile?.mustContain || (specialQueries.length > 0 ? specialQueries : undefined),
      exclude: specialProfile?.exclude,
      contextEmoji: emoji
    });

    return (filtered[0] || unique[0]) ?? null;
  }

  private resolveEmoji(name: string, fallback?: string, productEmoji?: string) {
    const match = EmojiMatcherService.match(name);
    if (match) return match.emoji;
    if (productEmoji) return productEmoji;
    return fallback || '🥘';
  }

  private normalizeEmoji(name: string, emoji?: string, productEmoji?: string) {
    if (!emoji || RecipeEnricherService.PLACEHOLDER_EMOJIS.has(emoji)) {
      return this.resolveEmoji(name, emoji, productEmoji);
    }
    const match = EmojiMatcherService.match(name);
    if (match && match.emoji !== emoji) return match.emoji;
    return emoji;
  }

  async enrichRecipe(recipe: Recipe): Promise<Recipe> {
    const props = recipe.toPrimitives();
    let totalCost = 0;

    const enrichedIngredients = await Promise.all(props.ingredients.map(async (ing) => {
      const currentIngredientCost = ing.estimatedCost ? Number(ing.estimatedCost) : 0;

      if (ing.linkedProductId && ing.linkedProductImage) {
        totalCost += currentIngredientCost;
        return {
          ...ing,
          emoji: this.normalizeEmoji(ing.name, ing.emoji)
        };
      }

      const match = await this.findBestMatch(ing.name, ing.emoji);

      if (match) {
        const matchPrice = match.price ? Number(match.price) : 0;
        totalCost += matchPrice;
        const resolvedEmoji = this.resolveEmoji(ing.name, ing.emoji, match.props.emoji);

        return {
          ...ing,
          id: (!ing.id || ing.id.length < 10) ? match.id : ing.id,
          emoji: resolvedEmoji,
          linkedProductId: match.id,
          linkedProductImage: match.props.image,
          estimatedCost: matchPrice
        };
      }

      totalCost += currentIngredientCost;
      return {
        ...ing,
        emoji: this.normalizeEmoji(ing.name, ing.emoji)
      };
    }));

    return new Recipe({
      ...props,
      ingredients: enrichedIngredients,
      estimatedCost: totalCost
    });
  }
}
