'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Plus, Trash2, Search, ShoppingBag } from 'lucide-react';
import { EditorData, InventoryItemUI } from './types'; // ✅ IMPORT
// Simulació de Base de Dades "Food Parts" (Pots connectar-ho a una API real)
const FOOD_DB = [
  "Tomàquet", "Ceba", "All", "Oli d'Oliva", "Sal", "Pebre", 
  "Pollastre", "Arròs", "Pasta", "Formatge", "Ous", "Llet", 
  "Patata", "Pastanaga", "Carbassó", "Tonyina", "Salmó"
];

interface Props {
  data: EditorData;
  // ✅ TIPATGE EXACTE: Funció que rep EditorData i no retorna res
  update: (d: EditorData) => void; 
  inventory: InventoryItemUI[]; // ✅ TIPATGE EXACTE
}

export function IngredientsManager({ data, update, inventory }: Props) {
  const [query, setQuery] = useState('');
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState('ut');

  const suggestions = query 
    ? Array.from(new Set([...inventory.map(i => i.name), ...FOOD_DB])) // FOOD_DB ha d'estar definit o importat
        .filter(item => item.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  const addIngredient = (name: string) => {
    update({
      ...data,
      ingredients: [...data.ingredients, { name, quantity: qty, unit }]
    });
    setQuery('');
    setQty(1);
  };

  const removeIngredient = (index: number) => {
    update({
      ...data,
      ingredients: data.ingredients.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🥕</span> Ingredients
      </h2>

      {/* INPUT CERCA INTEL·LIGENT */}
      <div className="relative z-20 mb-4">
        <div className="flex gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 focus-within:border-purple-500 transition-colors">
            <Search className="text-slate-500 ml-2 mt-2.5" size={18} />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cercar ingredient..."
              className="flex-1 bg-transparent text-white outline-none p-2 placeholder:text-slate-600"
              onKeyDown={(e) => e.key === 'Enter' && query && addIngredient(query)}
            />
            
            {/* Controls quantitat compactes */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2">
               <input 
                 type="number" 
                 value={qty} 
                 onChange={(e) => setQty(Number(e.target.value))}
                 className="w-10 bg-transparent text-center outline-none text-sm font-bold" 
               />
               <select 
                 value={unit} 
                 onChange={(e) => setUnit(e.target.value)}
                 className="bg-transparent text-xs text-slate-400 outline-none w-12"
               >
                 <option value="ut">ut</option>
                 <option value="g">g</option>
                 <option value="ml">ml</option>
               </select>
            </div>
            
            <button 
              onClick={() => query && addIngredient(query)}
              className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
        </div>

        {/* SUGGERIMENTS (DROPDOWN) */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl mt-2 z-50 shadow-xl overflow-hidden"
            >
              {suggestions.map((item, i) => {
                 const inPantry = inventory.some(inv => inv.name === item);
                 return (
                   <button
                     key={i}
                     onClick={() => addIngredient(item)}
                     className="w-full text-left px-4 py-3 hover:bg-slate-700 flex items-center justify-between text-sm text-slate-200 border-b border-slate-700/50 last:border-0"
                   >
                     <span>{item}</span>
                     {inPantry && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1"><ShoppingBag size={10}/> Rebost</span>}
                   </button>
                 )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* REBOST RÀPID (XIPS) */}
      <div className="mb-6">
        <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 flex items-center gap-1">
            <ShoppingBag size={12} /> Dels teus productes
        </p>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
            {inventory.length > 0 ? inventory.map((item) => (
                <button
                    key={item.id}
                    onClick={() => addIngredient(item.name)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 hover:border-purple-500 text-slate-300 border border-slate-700 px-2 py-1 rounded-md transition-all active:scale-95"
                >
                    + {item.name}
                </button>
            )) : <span className="text-xs text-slate-600 italic">Rebost buit</span>}
        </div>
      </div>

      {/* LLISTA SELECCIONADA */}
      <div className="space-y-2">
        <AnimatePresence>
            {data.ingredients.map((ing, i) => (
                <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={`${ing.name}-${i}`} 
                    className="flex items-center justify-between bg-slate-800/40 p-2 rounded-lg border border-slate-700/50 group hover:border-purple-500/30 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center text-xs font-bold text-purple-300">
                           {i+1}
                        </div>
                        <span className="text-sm font-medium text-slate-200">
                           {ing.name} <span className="text-slate-500 text-xs">({ing.quantity}{ing.unit})</span>
                        </span>
                    </div>
                    <button onClick={() => removeIngredient(i)} className="text-slate-600 hover:text-red-400 p-1">
                        <Trash2 size={16} />
                    </button>
                </motion.div>
            ))}
        </AnimatePresence>
        {data.ingredients.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl">
                <span className="text-4xl opacity-20">🥗</span>
                <p className="text-xs text-slate-500 mt-2">Afegeix ingredients per començar</p>
            </div>
        )}
      </div>
    </div>
  );
}