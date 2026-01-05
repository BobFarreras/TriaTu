// src/components/recipes/ingredients/IngredientBasket.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Ingredient } from '../types'; // Assumeix que tens aquest tipus exportat

interface Props {
  ingredients: Ingredient[]; // O el tipus que correspongui a la teva definició de dades
  onRemove: (index: number) => void;
  labels: { title: string; empty: string; };
}

export function IngredientBasket({ ingredients, onRemove, labels }: Props) {
  return (
    <div className="mt-4 pt-4 border-t border-slate-800 shrink-0 relative z-10">
      <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">{labels.title}</p>
      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
        {ingredients.length === 0 && <span className="text-xs text-slate-600 italic">{labels.empty}</span>}
        <AnimatePresence>
          {ingredients.map((ing, i) => (
            <motion.div 
              layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
              key={`${ing.name}-${i}`} 
              className="flex items-center gap-2 bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-lg border border-slate-700"
            >
              <span>{ing.name}</span>
              <span className="text-slate-500 text-[10px] font-mono">{ing.quantity}{ing.unit}</span>
              <button onClick={() => onRemove(i)} className="text-red-400 hover:text-white ml-1"><X size={12} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}