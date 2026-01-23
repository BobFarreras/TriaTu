import { useState, useEffect, useCallback } from 'react';
import { ProductResult, searchProductsAction } from '@/app/actions/inventory';
import { MainCategory } from '@/lib/taxonamy';
import { findTaxonomyMatch } from '@/lib/taxonamy/matcher';
import { buildManualProduct } from './productFallback';
import { buildQueryTerms, filterProductsByQuery } from '@/core/application/services/ProductSearchFilter';
export function useProductSearch() {
  const [activeCategory, setActiveCategory] = useState<MainCategory | null>(null);
  const [activeSubQuery, setActiveSubQuery] = useState<string | string[]>('');
  const [manualSearch, setManualSearch] = useState('');
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async (
    query: string | string[],
    excludeList: string[] = [],
    mustContainList: string | string[] = []
  ) => {
    setLoading(true);
    try {
      let rawProducts: ProductResult[] = [];
      const isManualSearch = !activeCategory && typeof query === 'string';
      const isCategorySearch = !!activeCategory && !manualSearch;
      const inferredCategoryId = isManualSearch ? findTaxonomyMatch(query)?.categoryId : undefined;
      const categoryId = activeCategory?.id || inferredCategoryId;

      // A. FETCHING (Igual que abans)
      if (Array.isArray(query)) {
        const responses = await Promise.all(query.map(q => searchProductsAction(q)));
        rawProducts = responses
          .filter(res => res.success && res.data)
          .flatMap(res => res.data || []);

        const perQueryFiltered = responses.flatMap((res, idx) => {
          const data = res.success && res.data ? res.data : [];
          return filterProductsByQuery(data, {
            exclude: excludeList,
            mustContain: mustContainList,
            queryTerms: buildQueryTerms(query[idx]),
            avoidFlavorMatches: true,
            categoryId
          });
        });

        rawProducts = perQueryFiltered;
      } else {
        const res = await searchProductsAction(query);
        const queryTerms = buildQueryTerms(query);

        if (res.success && res.data) {
          rawProducts = filterProductsByQuery(res.data, {
            exclude: excludeList,
            mustContain: mustContainList,
            queryTerms,
            avoidFlavorMatches: true,
            categoryId
          });
        }

        if (isManualSearch && queryTerms.length > 1) {
          const fallbackQueries = Array.from(new Set(queryTerms)).slice(0, 3);
          const fallbackResponses = await Promise.all(
            fallbackQueries.map(term => searchProductsAction(term))
          );

          const fallbackFiltered = fallbackResponses.flatMap(res => {
            const data = res.success && res.data ? res.data : [];
            return filterProductsByQuery(data, {
              exclude: excludeList,
              mustContain: mustContainList,
              queryTerms,
              avoidFlavorMatches: true,
              categoryId
            });
          });

          rawProducts = [...rawProducts, ...fallbackFiltered];
        }
      }

      // B. UNIQUE MAP
      const uniqueProducts = Array.from(
        new Map(rawProducts.map(item => [item.id, item])).values()
      );

      if (uniqueProducts.length === 0 && isManualSearch && typeof query === 'string') {
        const trimmed = query.trim();
        if (trimmed.length > 0) {
          setResults([buildManualProduct(trimmed)]);
        } else {
          setResults([]);
        }
      } else if (uniqueProducts.length === 0 && isCategorySearch) {
        const subcategory = activeCategory?.subcategories.find(sub =>
          Array.isArray(sub.query) && Array.isArray(activeSubQuery)
            ? JSON.stringify(sub.query) === JSON.stringify(activeSubQuery)
            : sub.query === activeSubQuery
        );
        const fallbackName = subcategory?.label || activeCategory?.label || 'Producte';
        const fallbackEmoji = subcategory?.emoji || activeCategory?.emoji || '📦';
        setResults([buildManualProduct(fallbackName, fallbackEmoji)]);
      } else {
        setResults(uniqueProducts);
      }

    } catch (e) {
      console.error("Error searching products:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeSubQuery, manualSearch]);


  // --- 2. EFFECT ---
  useEffect(() => {
    if (!activeSubQuery && !manualSearch) {
      setResults([]);
      return;
    }

    // Manual Search
    if (manualSearch) {
      if (manualSearch.length < 3) return;
      const timeout = setTimeout(() => {
        performSearch(manualSearch);
      }, 500);
      return () => clearTimeout(timeout);
    }

    // Category Search
    if (activeSubQuery) {
      let excludeList: string[] = [];
      let mustContainList: string | string[] = []; // ✅ Init variable

      if (activeCategory) {
        // Find the active subcategory object to get its rules
        // We handle the case where activeSubQuery is an array by comparing JSON strings or checking inclusion
        const subCat = activeCategory.subcategories.find(s =>
          Array.isArray(s.query) && Array.isArray(activeSubQuery)
            ? JSON.stringify(s.query) === JSON.stringify(activeSubQuery)
            : s.query === activeSubQuery
        );

        if (subCat) {
          if (subCat.exclude) excludeList = subCat.exclude;
          if (subCat.mustContain) mustContainList = subCat.mustContain; // ✅ Extract rule
        }
      }

      // ✅ Pass both lists to search function
      performSearch(activeSubQuery, excludeList, mustContainList);
    }

  }, [activeSubQuery, manualSearch, activeCategory, performSearch]);


  // --- 3. ACTIONS ---
  const selectCategory = (cat: MainCategory) => {
    setActiveCategory(cat);
    setManualSearch('');
    if (cat.subcategories.length > 0) {
      setActiveSubQuery(cat.subcategories[0].query);
    }
  };

  const resetSearch = () => {
    setActiveCategory(null);
    setActiveSubQuery('');
    setResults([]);
    setManualSearch('');
  };

  const handleManualInput = (text: string) => {
    setManualSearch(text);
    if (text) setActiveCategory(null);
  };

  return {
    activeCategory,
    activeSubQuery,
    manualSearch,
    results,
    loading,
    selectCategory,
    setActiveSubQuery,
    handleManualInput,
    resetSearch
  };
}
