// src/components/recipes/ingredients/IngredientTools.tsx
import { Search, X } from 'lucide-react';
import { PRESET_CATEGORIES, FoodCategory, FOOD_PRESETS } from "@/lib/food-presets";
import { InventoryItemUI, IngredientsLabels } from '../types'; // 👈 Ruta relativa corregida

// Truc de TypeScript per obtenir el tipus d'un element de la llista constant
type PresetItem = typeof FOOD_PRESETS[number];

// --- SEARCH BAR & CATEGORIES ---
interface SearchHeaderProps {
  query: string;
  setQuery: (q: string) => void;
  selectedCategory: FoodCategory | 'ALL';
  setSelectedCategory: (c: FoodCategory | 'ALL') => void;
  labels: IngredientsLabels; // 👈 Tipat estricte
}

export function SearchHeader({ query, setQuery, selectedCategory, setSelectedCategory, labels }: SearchHeaderProps) {
  return (
    <div className="space-y-3 mb-4 shrink-0 relative z-10">
      <div className="flex gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 focus-within:border-purple-500 transition-colors">
        <Search className="text-slate-500 ml-2 mt-2.5" size={18} />
        <input 
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.search_placeholder}
          className="flex-1 bg-transparent text-white outline-none p-2 placeholder:text-slate-600"
        />
        {query && (
          <button onClick={() => setQuery('')} className="p-2 text-slate-500 hover:text-white"><X size={16} /></button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-linear-fade">
        <CategoryPill active={selectedCategory === 'ALL'} onClick={() => setSelectedCategory('ALL')} label={labels.category_all} />
        {PRESET_CATEGORIES.map(cat => (
          <CategoryPill key={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)} label={cat} />
        ))}
      </div>
    </div>
  );
}

function CategoryPill({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${active ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'}`}
    >
      {label}
    </button>
  );
}

// --- GRID DE PRESETS ---
interface PresetsGridProps {
  presets: PresetItem[]; // 👈 Tipat estricte en lloc de any[]
  inventory: InventoryItemUI[];
  onSelect: (preset: PresetItem) => void;
  emptyLabel: string;
}

export function PresetsGrid({ presets, inventory, onSelect, emptyLabel }: PresetsGridProps) {
  return (
    <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar relative z-0">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-20">
        {presets.map(preset => {
          const inPantry = inventory.some(i => i.name.toLowerCase().includes(preset.name.toLowerCase()));
          return (
            <button
              key={preset.id} onClick={() => onSelect(preset)}
              className={`relative flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all text-center group ${inPantry ? 'bg-emerald-900/10 border-emerald-500/30 hover:bg-emerald-900/20' : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800 hover:border-purple-500/50'}`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{preset.emoji}</span>
              <span className="text-[10px] font-bold text-slate-300 leading-tight line-clamp-2 min-h-[2.5ex]">{preset.name}</span>
              {inPantry && <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
            </button>
          )
        })}
      </div>
      {presets.length === 0 && (
        <div className="text-center py-10 opacity-50"><p>{emptyLabel}</p></div>
      )}
    </div>
  );
}