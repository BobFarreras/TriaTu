// src/components/recipes/editor/ingredients/IngredientTools.tsx
'use client'

import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Assegura't que importes els tipus des de '../types' (la definició local que acabem d'arreglar)
import { InventoryItemUI, IngredientsLabels, Ingredient, FoodCategory, FoodPreset } from '../editor/types'; 

// --- HEADER ---
interface SearchHeaderProps {
  query: string;
  setQuery: (q: string) => void;
  // ✅ Com que FoodCategory és 'any', això acceptarà el 'setState' del pare sense problemes
  selectedCategory: FoodCategory | 'ALL';
  setSelectedCategory: (c: FoodCategory | 'ALL') => void;
  labels: IngredientsLabels;
  categories: FoodCategory[]; 
}

export function SearchHeader({ query, setQuery, selectedCategory, setSelectedCategory, labels, categories }: SearchHeaderProps) {
  return (
    <div className="flex flex-col gap-3 p-3 z-20 shrink-0">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="text-slate-500" size={16} />
        </div>
        <input 
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.search_placeholder}
          data-testid="recipe-ingredient-search"
          className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 pl-9 pr-9 text-sm text-white outline-none focus:border-purple-500 focus:bg-slate-900 transition-all placeholder:text-slate-600"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute inset-y-0 right-2 flex items-center p-1 text-slate-500 hover:text-white"><X size={14} /></button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade-right pb-1">
        <CategoryPill active={selectedCategory === 'ALL'} onClick={() => setSelectedCategory('ALL')} label={labels.category_all} />
        {categories.map(cat => (
          // Use String(cat) per seguretat visual
          <CategoryPill
            key={String(cat)}
            active={selectedCategory === cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? 'ALL' : cat)}
            label={String(cat)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryPill({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-all border ${active ? 'bg-white text-black border-white shadow-lg' : 'bg-slate-800/50 text-slate-400 border-slate-700/30 hover:bg-slate-700'}`}
    >
      {label}
    </button>
  );
}

// --- GRID CALCULADORA ---
interface CalculatorGridProps {
  presets: FoodPreset[]; 
  inventory: InventoryItemUI[];
  currentIngredients: Ingredient[]; 
  onQuickAdd: (preset: FoodPreset) => void; 
  emptyLabel: string;
}

export function CalculatorGrid({ presets, inventory, currentIngredients, onQuickAdd, emptyLabel }: CalculatorGridProps) {
  return (
    <div className="h-full overflow-y-auto p-2 sm:p-4 custom-scrollbar relative">
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-2 pb-32">
        {presets.map(preset => {
          const inPantry = inventory.some(i => i.name.toLowerCase().includes(preset.name.toLowerCase()));
          const selectedItem = currentIngredients.find(i => i.name === preset.name);
          const count = selectedItem ? selectedItem.quantity : 0;
          const unitDisplay = selectedItem ? selectedItem.unit : preset.defaultUnit;

          return (
            <motion.button
              key={preset.id} 
              whileTap={{ scale: 0.9 }}
              onClick={() => onQuickAdd(preset)}
              data-testid={`recipe-ingredient-${preset.id}`}
              className={`
                relative flex flex-col items-center justify-center gap-1 p-1 h-20 sm:h-24 rounded-xl border transition-all text-center group overflow-hidden
                ${count > 0 
                  ? 'bg-purple-900/20 border-purple-500/50 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]' 
                  : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600 hover:bg-slate-800/50'
                }
              `}
            >
              {inPantry && (
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)] z-10" />
              )}
              <span className="text-3xl drop-shadow-md filter select-none">{preset.emoji}</span>
              <span className={`text-[9px] font-bold leading-tight line-clamp-1 w-full px-1 ${count > 0 ? 'text-purple-200' : 'text-slate-400'}`}>
                {preset.name}
              </span>

              <AnimatePresence>
                {count > 0 && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 left-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg min-w-4.5"
                  >
                    {count < 10 && count % 1 === 0 ? count : Math.round(count)}
                    <span className="text-[7px] opacity-60 ml-0.5">{unitDisplay}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
      
      {presets.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 opacity-50">
          <span className="text-3xl mb-2">🤷‍♂️</span>
          <p className="text-xs font-medium text-slate-500">{emptyLabel}</p>
        </div>
      )}
    </div>
  );
}
