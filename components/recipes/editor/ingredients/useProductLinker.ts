import { useState, useEffect } from 'react';
import { Ingredient } from '../types';
import { searchProductsAction, ProductResult } from '@/app/actions/inventory';
import { FOOD_TAXONOMY, SubCategory } from '@/lib/taxonamy'; // Check path spelling!

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

  const findTaxonomyMatch = (name: string): SubCategory | null => {
    const lowerName = name.toLowerCase();
    for (const cat of FOOD_TAXONOMY) {
      for (const sub of cat.subcategories) {
        if (sub.label.toLowerCase() === lowerName) return sub;
        if (lowerName.includes(sub.label.toLowerCase())) return sub;
        if (sub.label.toLowerCase().includes(lowerName)) return sub;
      }
    }
    return null;
  };

  const loadMatches = async () => {
    setLoading(true);
    const newMatches: Record<string, ProductResult[]> = {};
    
    const promises = ingredients.map(async (ing) => {
      let foundProducts: ProductResult[] = [];
      
      try {
        // 1. TAXONOMIA
        const taxMatch = findTaxonomyMatch(ing.name);
        
        if (taxMatch) {
            const queries = Array.isArray(taxMatch.query) ? taxMatch.query : [taxMatch.query];
            const responses = await Promise.all(queries.map(q => searchProductsAction(q)));
            let rawResults = responses
                .filter(r => r.success && r.data)
                .flatMap(r => r.data || []);

            if (taxMatch.exclude) {
                rawResults = rawResults.filter(p => {
                    const lowerName = p.name.toLowerCase();
                    return !taxMatch.exclude!.some(bad => lowerName.includes(bad.toLowerCase()));
                });
            }
            // Eliminar duplicats
            foundProducts = Array.from(new Map(rawResults.map(item => [item.id, item])).values());
        
        } else {
            // 2. NOM EXACTE
            const resDirect = await searchProductsAction(ing.name);
            if (resDirect.data) foundProducts = resDirect.data;

            // 3. FALLBACK (Primera paraula)
            if (foundProducts.length === 0 && ing.name.includes(' ')) {
                const firstWord = ing.name.split(' ')[0];
                if (firstWord.length > 2) {
                    const resFallback = await searchProductsAction(firstWord);
                    if (resFallback.data) {
                        // Afegim als resultats existents (o els reemplacem si estava buit)
                        foundProducts = resFallback.data;
                    }
                }
            }
        }

        if (foundProducts.length > 0) {
          newMatches[ing.id] = foundProducts.slice(0, 10);
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