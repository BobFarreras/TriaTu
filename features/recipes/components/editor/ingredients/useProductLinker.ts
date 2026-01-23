import { useState, useEffect } from 'react';
import { Ingredient } from '../types';
import { searchProductsAction, ProductResult } from '@/app/actions/inventory';
import { SubCategory } from '@/lib/taxonamy';
import { findTaxonomyMatch } from '@/lib/taxonamy/matcher';
import { buildQueryTerms, filterProductsByQuery } from '@/core/application/services/ProductSearchFilter';
import { buildSearchQueries } from '@/core/application/services/SearchQueryBuilder';
import { hasExactTokenMatch } from '@/core/application/services/ExactTokenMatcher';

export function useProductLinker(ingredients: Ingredient[], isOpen: boolean) {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Record<string, ProductResult[]>>({});
  const [selectedProducts, setSelectedProducts] = useState<Record<string, ProductResult | null>>({});
  const [manualQueries, setManualQueries] = useState<Record<string, string>>({});

  // 1. EFECTE D'INICIALITZACIÓ (Quan s'obre el modal)
  useEffect(() => {
    if (isOpen) {
      // A. Pre-carreguem les seleccions existents
      const existingSelections: Record<string, ProductResult | null> = {};
      
      ingredients.forEach(ing => {
        if (ing.linkedProductId && ing.referencePrice) {
            // Reconstruïm un objecte mínim de producte per marcar-lo com a seleccionat
            // ✅ FIX: Afegim 'tags: []' i altres camps obligatoris per satisfer TypeScript
            existingSelections[ing.id] = {
                id: ing.linkedProductId,
                name: ing.name, 
                price: ing.referencePrice,
                image: ing.linkedProductImage || '',
                emoji: ing.emoji || '📦',
                source: 'bonpreu',
                tags: [] // Camp obligatori
            } as ProductResult; // Cast com a ProductResult si falten opcionals
        }
      });
      setSelectedProducts(existingSelections);

      // B. Llancem la cerca
      loadMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const findIngredientTaxonomyMatch = (name: string): { categoryId: string; sub: SubCategory } | null =>
    findTaxonomyMatch(name);

  const fetchMatchesForIngredient = async (ing: Ingredient, queryOverride?: string) => {
    let foundProducts: ProductResult[] = [];
    const override = queryOverride?.trim();
    const effectiveOverride = override && override.length >= 3 ? override : undefined;
    const baseQuery = effectiveOverride || ing.name;
    const queryTerms = buildQueryTerms(baseQuery);

    const taxMatch = !effectiveOverride ? findIngredientTaxonomyMatch(ing.name) : null;
    const categoryId = taxMatch?.categoryId;

    if (taxMatch) {
      const queries = Array.isArray(taxMatch.sub.query) ? taxMatch.sub.query : [taxMatch.sub.query];
      const responses = await Promise.all(queries.map(q => searchProductsAction(q)));
      const filtered = responses.flatMap((res, idx) => {
        const data = res.success && res.data ? res.data : [];
        return filterProductsByQuery(data, {
          exclude: taxMatch.sub.exclude,
          mustContain: taxMatch.sub.mustContain,
          queryTerms: buildQueryTerms(queries[idx]),
          avoidFlavorMatches: true,
          categoryId,
          contextEmoji: ing.emoji
        });
      });

      foundProducts = filtered;
    } else {
      const queries = buildSearchQueries(baseQuery);
      const minMatchCount = Math.max(1, Math.min(2, queryTerms.length));

      if (queries.length > 0) {
        const responses = await Promise.all(queries.map(q => searchProductsAction(q)));
        const filtered = responses.flatMap(res => {
          const data = res.success && res.data ? res.data : [];
          return filterProductsByQuery(data, {
            queryTerms,
            minMatchRatio: 1,
            minMatchCount,
            avoidFlavorMatches: true,
            categoryId
          });
        });

        foundProducts = filtered;
      }
    }

    if (foundProducts.length === 0) return [];
    const anchorTerms = queryTerms.filter(term => term.length >= 4);
    const strictFiltered = anchorTerms.length > 0
      ? foundProducts.filter(prod => anchorTerms.some(term => hasExactTokenMatch(prod.name, term)))
      : foundProducts;
    if (strictFiltered.length === 0) return [];
    const unique = Array.from(new Map(strictFiltered.map(item => [item.id, item])).values());
    return unique.slice(0, 10);
  };

  const loadMatches = async () => {
    setLoading(true);
    const newMatches: Record<string, ProductResult[]> = {};
    
    const promises = ingredients.map(async (ing) => {
      try {
        const foundProducts = await fetchMatchesForIngredient(ing, manualQueries[ing.id]);
        if (foundProducts.length > 0) newMatches[ing.id] = foundProducts;
      } catch (error) {
        console.error(error);
      }
    });

    await Promise.all(promises);
    
    setMatches(prev => ({ ...prev, ...newMatches }));
    setLoading(false);
  };

  const selectProduct = (ingredientId: string, product: ProductResult) => {
    setSelectedProducts((prev) => ({ ...prev, [ingredientId]: product }));
  };

  const setManualQuery = (ingredientId: string, query: string) => {
    setManualQueries(prev => ({ ...prev, [ingredientId]: query }));
  };

  const searchIngredient = async (ingredient: Ingredient, queryOverride?: string) => {
    const results = await fetchMatchesForIngredient(ingredient, queryOverride);
    setMatches(prev => ({ ...prev, [ingredient.id]: results }));
  };

  const applyChanges = (originalIngredients: Ingredient[]): Ingredient[] => {
    return originalIngredients.map((ing) => {
      const selected = selectedProducts[ing.id];
      if (!selected) return ing; 

      return {
        ...ing,
        linkedProductId: selected.id,
        linkedProductImage: selected.image,
        referencePrice: selected.price,
        estimatedCost: selected.price 
      };
    });
  };

  const totalCost = Object.values(selectedProducts).reduce((acc, p) => acc + (p?.price || 0), 0);

  return {
    loading,
    matches,
    selectedProducts,
    manualQueries,
    setManualQuery,
    searchIngredient,
    selectProduct,
    applyChanges,
    totalCost
  };
}
