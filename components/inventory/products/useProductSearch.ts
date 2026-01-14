import { useState, useEffect } from 'react';
import { ProductResult, searchProductsAction } from '@/app/actions/inventory';
import { MainCategory } from '@/lib/food-categories';

export function useProductSearch() {
  const [activeCategory, setActiveCategory] = useState<MainCategory | null>(null);
  const [activeSubQuery, setActiveSubQuery] = useState('');
  const [manualSearch, setManualSearch] = useState('');
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Lògica de Cerca (Debounce + API)
  useEffect(() => {
    // Si no hi ha res seleccionat, netegem
    if (!activeSubQuery && !manualSearch) {
      setResults([]);
      return;
    }

    const queryToUse = manualSearch || activeSubQuery;
    
    // Evitem cerques massa curtes manuals
    if (manualSearch && manualSearch.length < 3) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await searchProductsAction(queryToUse);
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, manualSearch ? 500 : 0);
    return () => clearTimeout(timeout);

  }, [activeSubQuery, manualSearch]);

  // Accions
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