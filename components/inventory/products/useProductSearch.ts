import { useState, useEffect, useCallback } from 'react';
import { ProductResult, searchProductsAction } from '@/app/actions/inventory';
import { MainCategory } from '@/lib/taxonamy';

export function useProductSearch() {
  const [activeCategory, setActiveCategory] = useState<MainCategory | null>(null);
  const [activeSubQuery, setActiveSubQuery] = useState<string | string[]>('');
  const [manualSearch, setManualSearch] = useState('');
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);

  // --- 1. CORE SEARCH FUNCTION ---
  // ✅ FIX: Added mustContainList as a parameter
  const performSearch = useCallback(async (
    query: string | string[], 
    excludeList: string[] = [], 
    mustContainList: string | string[] = [] // ✅ New parameter
  ) => {
    setLoading(true);
    try {
      let rawProducts: ProductResult[] = [];

      // A. ARRAY vs STRING QUERY
      if (Array.isArray(query)) {
        const promises = query.map(q => searchProductsAction(q));
        const responses = await Promise.all(promises);
        rawProducts = responses
          .filter(res => res.success && res.data)
          .flatMap(res => res.data || []);
      } else {
        const res = await searchProductsAction(query);
        if (res.success && res.data) {
          rawProducts = res.data;
        }
      }

      // B. REMOVE DUPLICATES
      const uniqueProducts = Array.from(
        new Map(rawProducts.map(item => [item.id, item])).values()
      );

      // C. APPLY FILTERS
      const filteredResults = uniqueProducts.filter(product => {
        const lowerName = product.name.toLowerCase();

        // 1. EXCLUDE FILTER (Blacklist)
        if (excludeList.length > 0) {
          const hasBadWord = excludeList.some(badWord =>
            lowerName.includes(badWord.toLowerCase())
          );
          if (hasBadWord) return false;
        }

        // 2. MUST CONTAIN FILTER (Whitelist)
        // ✅ FIX: Logic for string or array of strings
        if (mustContainList) {
            const requiredWords = Array.isArray(mustContainList) ? mustContainList : [mustContainList];
            
            if (requiredWords.length > 0) {
                const hasRequiredWord = requiredWords.some(goodWord => 
                    lowerName.includes(goodWord.toLowerCase())
                );
                // If it doesn't have at least one required word, discard it
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