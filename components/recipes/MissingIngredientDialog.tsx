// ARXIU: src/components/recipes/MissingIngredientDialog.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { addToShoppingListAction } from '@/app/actions/shopping-list-actions';
import { quickAddInventoryAction } from '@/app/actions/inventory';
import { toast } from 'sonner';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  emoji?: string; // ✅ Assegurem que pot tenir emoji
}

interface Props {
  isOpen: boolean;
  ingredient: Ingredient | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function MissingIngredientDialog({ isOpen, ingredient, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState<'list' | 'inventory' | null>(null);

  if (!isOpen || !ingredient) return null;

  const handleAddToList = async () => {
    setLoading('list');
    const result = await addToShoppingListAction(ingredient.name, ingredient.quantity, ingredient.unit);
    
    if (result.success) {
      toast.success(`📝 Afegit a la llista: ${ingredient.name}`);
      onClose();
    } else {
      toast.error("Error afegint a la llista");
    }
    setLoading(null);
  };

  const handleAddToInventory = async () => {
    setLoading('inventory');
    // ✅ PASSEM L'EMOJI A L'ACCIÓ
    const result = await quickAddInventoryAction(
        ingredient.name, 
        ingredient.quantity, 
        ingredient.unit,
        ingredient.emoji // <--- AQUI
    );

    if (result.success) {
      toast.success(`📦 Afegit al rebost: ${ingredient.name}`);
      onClose();
      onSuccess();
    } else {
      toast.error(result.error || "Error afegint a l'inventari");
    }
    setLoading(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // ✅ CORRECCIÓ Z-INDEX: Pugem a z-[100] per superar qualsevol sticky header
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* ... Contingut visual (igual que abans) ... */}
            <div className="bg-linear-to-r from-purple-900/40 to-slate-900 p-6 text-center border-b border-slate-800">
              <div className="text-4xl mb-3">{ingredient.emoji || '⚠️'}</div> {/* Mostrem l'emoji també aquí */}
              <h2 className="text-xl font-bold text-white">Et falta ingredient!</h2>
       
            </div>

            {/* ... Botons (igual que abans) ... */}
             <div className="p-6 space-y-3">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Què vols fer?</p>
              
              <button
                onClick={handleAddToList}
                disabled={loading !== null}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-slate-900 p-2 rounded-lg group-hover:scale-110 transition-transform">📝</span>
                  <div className="text-left">
                    <div className="font-bold text-slate-200">Afegir a la Llista</div>
                    <div className="text-xs text-slate-400">Per comprar-ho més tard</div>
                  </div>
                </div>
                {loading === 'list' && <span className="animate-spin">⏳</span>}
              </button>

              <button
                onClick={handleAddToInventory}
                disabled={loading !== null}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  {/* Usem l'emoji de l'ingredient o la caixa */}
                  <span className="text-2xl bg-slate-900 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    {ingredient.emoji || '📦'}
                  </span>
                  <div className="text-left">
                    <div className="font-bold text-slate-200">Ja en tinc (Afegir stock)</div>
                    <div className="text-xs text-slate-400">L'afegeix al rebost immediatament</div>
                  </div>
                </div>
                 {loading === 'inventory' && <span className="animate-spin">⏳</span>}
              </button>
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
              <button onClick={onClose} className="text-sm text-slate-500 hover:text-white transition-colors">
                Cancel·lar operació
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}