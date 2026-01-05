import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBasket } from 'lucide-react';
import { Ingredient } from '../editor/types';
import { FOOD_PRESETS } from "@/lib/food-presets"; // ✅ Importem per buscar emojis

interface Props {
  ingredients: Ingredient[];
  onRemove: (index: number) => void;
  labels: { title: string; empty: string; };
}

export function IngredientDock({ ingredients, onRemove, labels }: Props) {
  if (ingredients.length === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 p-3 pb-6 sm:pb-3 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center gap-2 mb-2 px-1">
        <ShoppingBasket size={14} className="text-purple-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {ingredients.length} {labels.title}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade-right">
        <AnimatePresence>
          {ingredients.map((ing, i) => {
            // ✅ MÀGIA: Busquem l'emoji basat en el nom de l'ingredient
            const preset = FOOD_PRESETS.find(p => p.name === ing.name);
            const emoji = preset ? preset.emoji : '🥘';

            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                key={`${ing.name}-${i}`} 
                className="flex items-center gap-2 bg-slate-800 text-white text-xs pl-2 pr-2 py-1.5 rounded-xl border border-slate-700 shrink-0 shadow-lg select-none"
              >
                {/* Mostrem l'Emoji */}
                <span className="text-base leading-none">{emoji}</span>
                
                <span className="font-bold truncate max-w-25">{ing.name}</span>
                
                <span className="bg-slate-950 px-1.5 py-0.5 rounded text-[10px] font-mono text-purple-300 ml-1">
                  {ing.quantity} {ing.unit}
                </span>
                
                <button 
                  onClick={() => onRemove(i)} 
                  className="bg-slate-700/50 hover:bg-red-500/20 hover:text-red-400 p-1 rounded-full transition-colors ml-1"
                >
                  <X size={12} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}