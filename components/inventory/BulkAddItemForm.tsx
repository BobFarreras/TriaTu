'use client'

import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { useBulkAdd } from './useBulkAdd';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { SearchHeader, CalculatorGrid } from '../recipes/ingredients/IngredientTools';
import { IngredientDock } from '../recipes/ingredients/IngredientDock';

// ✅ IMPORTEM LES CATEGORIES PER PASSAR-LES AL HEADER
import { PRESET_CATEGORIES } from '@/lib/food-presets';

export function BulkAddItemForm({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const labels = t.create_recipe.ingredients;

  const {
    query, setQuery,
    selectedCategory, setSelectedCategory,
    basket,
    filteredPresets, 
    quickAdd,
    removeIngredientByIndex,
    handleSave,
    loading
  } = useBulkAdd(onClose);

  return (
    <div className="flex flex-col h-[75vh] w-full relative bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-slate-900/80 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors backdrop-blur-sm border border-slate-800"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col h-full w-full relative overflow-hidden">
        
        <div className="shrink-0 pt-2 px-2">
            <SearchHeader 
                query={query} setQuery={setQuery}
                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                labels={labels}
                // ✅ PASEM LES CATEGORIES REALS ("🥦 Verdura", etc.)
                categories={PRESET_CATEGORIES} 
            />
        </div>

        <div className="flex-1 overflow-hidden relative">
            <CalculatorGrid 
                presets={filteredPresets} 
                inventory={[]} 
                currentIngredients={basket} 
                onQuickAdd={quickAdd}
                emptyLabel="No trobem l'ingredient..."
            />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
             <div className="pointer-events-auto">
                <IngredientDock 
                    ingredients={basket}
                    onRemove={removeIngredientByIndex} 
                    labels={{ title: "Cistella d'Entrada", empty: "Fes clic per afegir aliments..." }}
                />
             </div>
        </div>
      </div>

      <div className="absolute bottom-24 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={handleSave} disabled={loading || basket.length === 0}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center ring-4 transition-all ${
            loading 
              ? 'bg-slate-800 cursor-wait ring-slate-700' 
              : basket.length > 0 
                ? 'bg-linear-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/40 ring-slate-900/50 cursor-pointer' 
                : 'bg-slate-800 text-slate-600 ring-slate-800 cursor-not-allowed'
          }`}
        >
          {loading ? (
             <span className="animate-spin text-2xl">⏳</span> 
          ) : (
             <Save className={`w-7 h-7 stroke-[2.5px] ${basket.length > 0 ? 'text-white' : 'text-slate-600'}`} />
          )}
        </motion.button>
      </div>
    </div>
  );
}