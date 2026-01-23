import { useState, useEffect } from 'react';
import { Ingredient } from '../types';
import { searchProductsAction, ProductResult } from '@/app/actions/inventory';
import { SubCategory } from '@/lib/taxonamy';
import { findTaxonomyMatch } from '@/lib/taxonamy/matcher';
import { buildQueryTerms, filterProductsByQuery } from '@/core/application/services/ProductSearchFilter';

export function useProductLinker(ingredients: Ingredient[], isOpen: boolean) {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Record<string, ProductResult[]>>({});
  const [selectedProducts, setSelectedProducts] = useState<Record<string, ProductResult | null>>({});

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

  const loadMatches = async () => {
    setLoading(true);
    const newMatches: Record<string, ProductResult[]> = {};
    
    const promises = ingredients.map(async (ing) => {
      let foundProducts: ProductResult[] = [];
      
      try {
        // 1. TAXONOMIA
        const taxMatch = findIngredientTaxonomyMatch(ing.name);
        
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
                    categoryId: taxMatch.categoryId,
                    contextEmoji: ing.emoji
                });
            });

            foundProducts = filtered;
        } else {
            const queryTerms = buildQueryTerms(ing.name);
            const resDirect = await searchProductsAction(ing.name);
            if (resDirect.data) {
                foundProducts = filterProductsByQuery(resDirect.data, {
                    queryTerms,
                    minMatchRatio: 0.5,
                    avoidFlavorMatches: true,
                    contextEmoji: ing.emoji
                });
            }

            if (foundProducts.length === 0 && ing.name.includes(' ')) {
                const firstWord = ing.name.split(' ')[0];
                if (firstWord.length > 2) {
                    const resFallback = await searchProductsAction(firstWord);
                    if (resFallback.data) {
                        foundProducts = filterProductsByQuery(resFallback.data, {
                            queryTerms,
                            minMatchRatio: 0.5,
                            avoidFlavorMatches: true,
                            contextEmoji: ing.emoji
                        });
                    }
                }
            }
        }

        if (foundProducts.length > 0) {
          const unique = Array.from(new Map(foundProducts.map(item => [item.id, item])).values());
          newMatches[ing.id] = unique.slice(0, 10);
        }

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
    selectProduct,
    applyChanges,
    totalCost
  };
}
