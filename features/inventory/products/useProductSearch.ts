import { useState, useEffect, useCallback } from 'react';
import { ProductResult, searchProductsAction } from '@/app/actions/inventory';
import { MainCategory } from '@/lib/taxonamy';
// ✅ HELPER: Neteja accents i minúscules per comparar millor
// "Tomàquet" -> "tomaquet"
const normalizeText = (text: string) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};
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

      // A. FETCHING (Igual que abans)
      if (Array.isArray(query)) {
        const promises = query.map(q => searchProductsAction(q));
        const responses = await Promise.all(promises);
        rawProducts = responses
          .filter(res => res.success && res.data)
          .flatMap(res => res.data || []);
      } else {
        const res = await searchProductsAction(query);
        if (res.success && res.data) rawProducts = res.data;
      }

      // B. UNIQUE MAP (Igual que abans)
      const uniqueProducts = Array.from(
        new Map(rawProducts.map(item => [item.id, item])).values()
      );

      // C. FILTRES MILLORATS (NORMALITZACIÓ)
      const filteredResults = uniqueProducts.filter(product => {
        // ✅ MILLORA: Normalitzem el nom del producte (sense accents)
        const normalizedName = normalizeText(product.name);

        // 1. EXCLUDE FILTER
        if (excludeList.length > 0) {
          const hasBadWord = excludeList.some(badWord =>
            normalizedName.includes(normalizeText(badWord)) // ✅ Comparació neta
          );
          if (hasBadWord) return false;
        }

        // 2. MUST CONTAIN FILTER
        if (mustContainList) {
          const requiredWords = Array.isArray(mustContainList) ? mustContainList : [mustContainList];

          if (requiredWords.length > 0) {
            const hasRequiredWord = requiredWords.some(goodWord =>
              normalizedName.includes(normalizeText(goodWord)) // ✅ Comparació neta
            );
            // Si no té la paraula clau, fora
            if (!hasRequiredWord) return false;
          }
        }

        return true;
      });

      setResults(filteredResults);

    } catch (e) {
      console.error("Error searching products:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);


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