// src/components/recipes/ingredients/IngredientActionSheet.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X } from 'lucide-react';

// Definim les unitats com a constant, potser en un fitxer de constants global en el futur
const UNITS = ['ut', 'g', 'ml', 'tbsp', 'tsp', 'cup'];

interface Props {
  activeItem: { name: string; emoji: string; unit: string } | null;
  qty: number;
  setQty: (val: number) => void;
  updateItemUnit: (unit: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function IngredientActionSheet({ activeItem, qty, setQty, updateItemUnit, onClose, onConfirm }: Props) {
  const adjustQty = (delta: number) => setQty(Math.max(0.5, qty + delta));

  return (
    <AnimatePresence>
      {activeItem && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Sheet Panel */}
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full sm:max-w-md bg-slate-900 border-t sm:border border-slate-700 rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden"
          >
            {/* Handle visual per mòbil */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-700 rounded-full sm:hidden" />

            <div className="p-6 pt-8 flex flex-col gap-6">
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-4xl bg-slate-800 p-2 rounded-2xl border border-slate-700">{activeItem.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Afegir ingredient</p>
                    <h3 className="text-2xl font-black text-white leading-tight">{activeItem.name}</h3>
                  </div>
                </div>
                <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-slate-400 p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Stepper Control */}
              <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800 flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Quantitat</label>
                <div className="flex items-center justify-between bg-slate-900 rounded-2xl p-2 border border-slate-800">
                  <button onClick={() => adjustQty(-1)} className="w-14 h-14 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl transition-all">
                    <Minus size={24} />
                  </button>
                  <div className="flex-1 flex justify-center">
                    <input 
                      type="number" value={qty}
                      onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
                      className="w-24 bg-transparent text-center text-4xl font-black text-white outline-none appearance-none m-0 p-0" 
                    />
                  </div>
                  <button onClick={() => adjustQty(1)} className="w-14 h-14 flex items-center justify-center bg-purple-600 hover:bg-purple-500 active:scale-95 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                    <Plus size={24} />
                  </button>
                </div>
              </div>

              {/* Unit Chips */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-3 block">Unitat</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-linear-fade-right">
                  {UNITS.map(u => (
                    <button
                      key={u}
                      onClick={() => updateItemUnit(u)}
                      className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${activeItem.unit === u ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <button onClick={onConfirm} className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                <Plus size={24} strokeWidth={3} />
                Afegir a la recepta
              </button>
              
              <div className="h-4 sm:hidden" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}