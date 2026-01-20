// src/components/editor/IngredientDock.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBasket, Sparkles, ChevronUp } from 'lucide-react';
import { Ingredient } from '../editor/types';

interface Props {
  ingredients: Ingredient[];
  onRemove: (id: string) => void;
  labels: { title: string; empty: string };
  onOpenLinker: () => void;
}

export function IngredientDock({ ingredients, onRemove, labels, onOpenLinker }: Props) {
  // Estat local per controlar si el dock està desplegat o minimitzat
  const [isExpanded, setIsExpanded] = useState(true);

  // Estat buit: sense canvis en disseny, només es mostra si no hi ha ingredients
  if (ingredients.length === 0) {
    return (
      <div className="w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-4 pb-8 flex items-center justify-center gap-3 text-slate-500 transition-all z-50">
        <ShoppingBasket size={20} />
        <span className="text-sm font-medium">{labels.empty}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col relative transition-all duration-300 ease-in-out"
    >

      {/* 🔮 BOTÓ MÀGIC "CALCULAR COST" (Flotant a dalt a la dreta) 
          Només el mostrem si està expandit per no solapar en mode minimitzat */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-4 -top-5 pointer-events-auto z-50"
          >
            <button
              onClick={(e) => {
                e.stopPropagation(); // Evitem que el click tanqui el dock
                onOpenLinker();
              }}
              className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-emerald-500/50 text-emerald-300 px-4 py-2 rounded-full shadow-xl hover:bg-emerald-900/20 hover:scale-105 transition-all active:scale-95 group ring-1 ring-white/10"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-spin-slow text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider">Calcular</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER DESPLEGABLE */}
      {/* Fem que tot el header sigui clickable per millorar la UX en mòbil/escriptori */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50 bg-slate-900/50 hover:bg-slate-800/50 transition-colors w-full cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-2">
          {/* Badge contador */}
          <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg shadow-purple-500/30">
            {ingredients.length}
          </span>

          {/* Títol */}
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            {labels.title}
          </span>

          {/* Fleta al costat del nom (Control visual d'estat) */}
          <ChevronUp
            size={16}
            className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </button>

      {/* LLISTA D'INGREDIENTS (Contingut Collapsible) */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="overflow-hidden"
      >
        <div className="p-4">
          <div className="flex flex-wrap gap-2 max-h-[35vh] overflow-y-auto custom-scrollbar content-start pr-1">
            <AnimatePresence mode='popLayout'>
              {ingredients.map((ing) => {
                const hasLink = !!ing.linkedProductId;

                return (
                  <motion.div
                    key={ing.id}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`
                      group relative flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-xl transition-all cursor-default select-none border
                      ${hasLink
                        ? 'bg-slate-800/80 border-emerald-500/30 hover:border-emerald-500/60'
                        : 'bg-slate-800 border-slate-700 hover:border-red-500/50'
                      }
                    `}
                  >
                    {/* FOTO O EMOJI */}
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      {ing.linkedProductImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={ing.linkedProductImage} className="w-full h-full object-contain" alt="" />
                      ) : (
                        <span className="text-xl leading-none">{ing.emoji || '🥗'}</span>
                      )}
                    </div>

                    <div className="flex flex-col items-start min-w-0 mr-6">
                      <span className={`text-xs font-bold truncate max-w-30 ${hasLink ? 'text-white' : 'text-slate-200'}`}>
                        {ing.name}
                      </span>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] text-slate-400 font-mono leading-none">
                          {ing.quantity}{ing.unit}
                        </span>

                        {/* PREU VERD */}
                        {ing.estimatedCost && (
                          <span className="text-[9px] font-black text-emerald-400 bg-emerald-950/50 px-1 rounded">
                            {/* ✅ CORRECCIÓ: Envoltem amb Number() per assegurar que és un número */}
                            {Number(ing.estimatedCost).toFixed(2)}€
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botó X */}
                    <button
                      onClick={() => onRemove(ing.id)}
                      className="absolute right-1 top-1 bottom-1 w-6 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}