'use client';

import { ProductResult } from '@/app/actions/inventory';
import { useProductSearch } from './useProductSearch';

// Components
import { CategoryGrid } from './components/CategoryGrid';
import { SubcategoryChips } from './components/SubcategoryChips';
import { ProductGrid } from './components/ProductGrid';

interface Props {
  onSelect: (product: ProductResult) => void;
  quantities: Record<string, number>;
  onClose: () => void; // ✅ Rebem el onClose
}

export function ProductExplorer({ onSelect, quantities, onClose }: Props) {
  const { 
    activeCategory, 
    activeSubQuery, 
    manualSearch, 
    results, 
    loading, 
    selectCategory, 
    setActiveSubQuery,
    handleManualInput, 
    resetSearch 
  } = useProductSearch();

  // Estem dins d'una categoria o buscant manualment?
  const isBrowsing = !!activeCategory || !!manualSearch;

  return (
    <div className="flex flex-col h-full w-full bg-slate-950">
      
      {/* 🎯 SUPER HEADER UNIFICAT
         Aquest contenidor canvia de contingut segons l'estat, però manté l'alçada 
      */}
      <div className="shrink-0 bg-slate-950 z-20 border-b border-slate-800/50 relative shadow-md">
         
         <div className="flex items-center gap-3 p-3">
            
            {/* ESTAT A: HOME (Buscador) */}
            {!activeCategory ? (
               <div className="flex-1 relative animate-in fade-in slide-in-from-left-2 duration-300">
                  <input
                    type="text"
                    value={manualSearch}
                    onChange={(e) => handleManualInput(e.target.value)}
                    placeholder="🔎 Què afegim avui?"
                    data-testid="product-search-input"
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-base font-medium shadow-inner"
                    autoFocus={false}
                  />
                  <span className="absolute left-4 top-3 text-xl animate-pulse-slow">⚡️</span>
               </div>
            ) : (
               /* ESTAT B: NAVEGANT (Botó Enrere + Títol) */
               <div className="flex-1 flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-300 overflow-hidden">
                  <button 
                    onClick={resetSearch}
                    className="h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white transition-all active:scale-95"
                  >
                    ↩
                  </button>
                  
                  <div className="flex items-center gap-2 overflow-hidden">
                     <span className="text-3xl filter drop-shadow-md">{activeCategory.emoji}</span>
                     <h3 className="text-lg font-black text-white truncate uppercase tracking-tight">
                        {activeCategory.label}
                     </h3>
                  </div>
               </div>
            )}

            {/* BOTÓ TANCAR (Sempre visible a la dreta) */}
            <button 
               onClick={onClose} 
               data-testid="product-search-close"
               className="h-12 w-12 shrink-0 rounded-full bg-slate-900/50 text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-transparent flex items-center justify-center transition-all active:scale-90"
            >
               ✕
            </button>
         </div>

         {/* BARRA DE SUB-CATEGORIES (Només quan estem dins) */}
         {/* L'integrem aquí perquè sigui 'Sticky' juntament amb el header */}
         {activeCategory && !manualSearch && (
            <div className="px-3 pb-3 overflow-x-auto scrollbar-hide animate-in slide-in-from-top-2">
               <SubcategoryChips 
                  category={activeCategory} 
                  activeQuery={activeSubQuery} 
                  onSelect={setActiveSubQuery} 
               />
            </div>
         )}
      </div>

      {/* AREA DE CONTINGUT (Scrollable) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scroll-smooth">
        
        {/* VISTA A: Categories */}
        {!isBrowsing && (
          <div className="animate-in zoom-in-95 duration-300 pb-20">
             <CategoryGrid onSelect={selectCategory} />
          </div>
        )}

        {/* VISTA B: Resultats */}
        {isBrowsing && (
          <div className="pb-32 animate-in slide-in-from-bottom-8 duration-500">
            <ProductGrid 
              loading={loading}
              results={results}
              quantities={quantities}
              onSelect={onSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}