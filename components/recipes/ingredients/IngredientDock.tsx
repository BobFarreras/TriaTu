'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBasket } from 'lucide-react';
import { InventoryItemUI } from '../editor/types';

interface Props {
  ingredients: InventoryItemUI[]; // O PendingInventoryItem, com comparteixen estructura funciona
  onRemove: (index: number) => void;
  labels: {
    title: string;
    empty: string;
  };
}

export function IngredientDock({ ingredients, onRemove, labels }: Props) {
  
  // Si està buit, mostrem l'estat buit (Més compacte)
  if (ingredients.length === 0) {
    return (
      <div className="w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-4 pb-8 flex items-center justify-center gap-3 text-slate-500 transition-all">
        <ShoppingBasket size={20} />
        <span className="text-sm font-medium">{labels.empty}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col"
    >
      {/* HEADER DE LA CISTELLA */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50 bg-slate-900/50">
        <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg shadow-purple-500/30">
                {ingredients.length}
            </span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                {labels.title}
            </span>
        </div>
        {/* Aquí podries posar un botó de "Buidar" si volguessis */}
      </div>

      {/* LLISTA D'INGREDIENTS (AMB SALT DE LÍNIA) */}
      <div className="p-4">
        {/* ✅ AQUI ESTÀ EL CANVI: flex-wrap + max-height */}
        <div className="flex flex-wrap gap-2 max-h-[35vh] overflow-y-auto custom-scrollbar content-start pr-1">
          <AnimatePresence mode='popLayout'>
            {ingredients.map((ing, i) => (
              <motion.button
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                key={`${ing.name}-${i}`} // Clau única combinada
                onClick={() => onRemove(i)}
                className="group relative flex items-center gap-2 bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 pl-2 pr-3 py-1.5 rounded-xl transition-all"
              >
                <span className="text-lg leading-none filter drop-shadow-sm">{ing.emoji || '📦'}</span>
                
                <div className="flex flex-col items-start min-w-0">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-red-200 truncate max-w-30">
                        {ing.name}
                    </span>
                    <span className="text-[9px] text-slate-400 group-hover:text-red-300 font-mono leading-none mt-0.5">
                        {ing.quantity} {ing.unit}
                    </span>
                </div>

                {/* Icona d'eliminar que apareix al hover (opcional, o sempre visible subtil) */}
                <div className="ml-1 text-slate-500 group-hover:text-red-400">
                    <X size={12} strokeWidth={3} />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}