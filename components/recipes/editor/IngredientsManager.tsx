'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X } from 'lucide-react';
import { EditorData, InventoryItemUI } from './types';
import { FOOD_PRESETS, PRESET_CATEGORIES, FoodCategory } from "@/lib/food-presets"; 

interface Props {
  data: EditorData;
  update: (d: EditorData) => void;
  inventory: InventoryItemUI[];
  // ✅ Nova prop
  labels: {
    title: string;
    selected: string;
    search_placeholder: string;
    category_all: string;
    empty_search: string;
    basket_title: string;
    basket_empty: string;
  }
}

export function IngredientsManager({ data, update, inventory, labels }: Props) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  const [activeItem, setActiveItem] = useState<{name: string, unit: string} | null>(null);
  const [qty, setQty] = useState(1);

  const filteredPresets = FOOD_PRESETS.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || preset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectPreset = (preset: typeof FOOD_PRESETS[0]) => {
    setActiveItem({ name: preset.name, unit: preset.defaultUnit });
    setQty(1);
  };

  const confirmAddIngredient = () => {
    if (!activeItem) return;
    update({
      ...data,
      ingredients: [...data.ingredients, { name: activeItem.name, quantity: qty, unit: activeItem.unit }]
    });
    setActiveItem(null);
    setQty(1);
    setQuery('');
  };

  const removeIngredient = (index: number) => {
    update({
      ...data,
      ingredients: data.ingredients.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col h-150">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      {/* CAPÇALERA */}
      <div className="flex items-center justify-between mb-4 relative z-10">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="text-2xl">🥕</span> {labels.title}
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            {data.ingredients.length} {labels.selected}
          </span>
      </div>

      {/* 1. CERCA I CATEGORIES */}
      <div className="space-y-3 mb-4 shrink-0">
          <div className="flex gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 focus-within:border-purple-500 transition-colors">
             <Search className="text-slate-500 ml-2 mt-2.5" size={18} />
             <input 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder={labels.search_placeholder}
               className="flex-1 bg-transparent text-white outline-none p-2 placeholder:text-slate-600"
             />
             {query && (
                <button onClick={() => setQuery('')} className="p-2 text-slate-500 hover:text-white">
                    <X size={16} />
                </button>
             )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-linear-fade">
             <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === 'ALL' ? 'bg-white text-black border-white' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'}`}
             >
                {labels.category_all}
             </button>
             {PRESET_CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'}`}
                >
                    {cat}
                </button>
             ))}
          </div>
      </div>

      {/* 2. GRID SELECCIÓ */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar">
          
          <AnimatePresence>
            {activeItem && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute inset-x-4 bottom-4 z-50 bg-slate-800 border border-slate-600 p-4 rounded-2xl shadow-2xl flex flex-col gap-3"
                >
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{activeItem.name}</span>
                        <button onClick={() => setActiveItem(null)}><X size={16} className="text-slate-400"/></button>
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            autoFocus
                            value={qty} 
                            onChange={e => setQty(Number(e.target.value))}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                        />
                        <select 
                            value={activeItem.unit}
                            onChange={e => setActiveItem({...activeItem, unit: e.target.value})}
                            className="w-20 bg-slate-950 border border-slate-700 rounded-xl px-2 text-xs text-white outline-none"
                        >
                            <option value="ut">ut</option>
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                        </select>
                        <button onClick={confirmAddIngredient} className="bg-purple-600 text-white px-4 rounded-xl font-bold">
                            <Plus />
                        </button>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
             {filteredPresets.map(preset => {
                const inPantry = inventory.some(i => i.name.toLowerCase().includes(preset.name.toLowerCase()));
                return (
                    <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`
                            relative flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all text-center group
                            ${inPantry 
                                ? 'bg-emerald-900/10 border-emerald-500/30 hover:bg-emerald-900/20' 
                                : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800 hover:border-purple-500/50'
                            }
                        `}
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{preset.emoji}</span>
                        <span className="text-[10px] font-bold text-slate-300 leading-tight line-clamp-2 min-h-[2.5ex]">{preset.name}</span>
                        {inPantry && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        )}
                    </button>
                )
             })}
          </div>

          {filteredPresets.length === 0 && (
              <div className="text-center py-10 opacity-50">
                  <p>{labels.empty_search}</p>
              </div>
          )}
      </div>

      {/* 3. FOOTER */}
      <div className="mt-4 pt-4 border-t border-slate-800 shrink-0">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">{labels.basket_title}</p>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
             {data.ingredients.length === 0 && <span className="text-xs text-slate-600 italic">{labels.basket_empty}</span>}
             
             <AnimatePresence>
                {data.ingredients.map((ing, i) => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        key={`${ing.name}-${i}`} 
                        className="flex items-center gap-2 bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-lg border border-slate-700"
                    >
                        <span>{ing.name}</span>
                        <span className="text-slate-500 text-[10px] font-mono">{ing.quantity}{ing.unit}</span>
                        <button onClick={() => removeIngredient(i)} className="text-red-400 hover:text-white ml-1">
                            <X size={12} />
                        </button>
                    </motion.div>
                ))}
             </AnimatePresence>
          </div>
      </div>
    </div>
  );
}