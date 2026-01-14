// ARXIU: src/components/shopping/ShoppingListManager.tsx
'use client';

import { useState } from 'react';
import { toggleShoppingItemAction, completeShoppingSessionAction } from '@/app/actions/shopping-list-actions';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isChecked: boolean;
}

export function ShoppingListManager({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [isCompleting, setIsCompleting] = useState(false);

  const checkedCount = items.filter(i => i.isChecked).length;

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // Optimistic Update
    setItems(prev => prev.map(i => i.id === id ? { ...i, isChecked: !currentStatus } : i));
    
    await toggleShoppingItemAction(id, !currentStatus);
  };

  const handleFinish = async () => {
    if (checkedCount === 0) return;
    setIsCompleting(true);
    
    const result = await completeShoppingSessionAction();
    
    if (result.success) {
        toast.success(`🎉 Compra finalitzada!`, {
            description: `${result.count} productes moguts al rebost.`
        });
        // Eliminem visualment els marcats
        setItems(prev => prev.filter(i => !i.isChecked));
    } else {
        toast.error("Error finalitzant la compra");
    }
    setIsCompleting(false);
  };

  if (items.length === 0) {
      return (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
           <div className="text-4xl mb-4">🛒</div>
           <p className="text-slate-500">La llista està buida.</p>
           <p className="text-xs text-slate-600 mt-1">Afegeix coses des de les receptes o l'inventari.</p>
        </div>
      );
  }

  return (
    <>
      <div className="space-y-2">
        <AnimatePresence>
            {items.map((item) => (
                <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => handleToggle(item.id, item.isChecked)}
                    className={`
                        flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all select-none
                        ${item.isChecked 
                            ? 'bg-emerald-950/30 border-emerald-900/50 opacity-60' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'}
                    `}
                >
                    <div className="flex items-center gap-4">
                        <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                            ${item.isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}
                        `}>
                            {item.isChecked && <span className="text-black text-xs font-bold">✓</span>}
                        </div>
                        <span className={`text-lg ${item.isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {item.name}
                        </span>
                    </div>
                    <span className="font-mono text-sm text-slate-400 bg-slate-950 px-2 py-1 rounded">
                        {item.quantity}{item.unit}
                    </span>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* FOOTER FLOTANT */}
      <AnimatePresence>
        {checkedCount > 0 && (
            <motion.div 
                initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40"
            >
                <button
                    onClick={handleFinish}
                    disabled={isCompleting}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-2xl shadow-emerald-900/50 flex items-center gap-3 active:scale-95 transition-all"
                >
                    {isCompleting ? <span className="animate-spin">⏳</span> : <span>🛒 Finalitzar Compra</span>}
                    <span className="bg-emerald-800 px-2 py-0.5 rounded-full text-xs">
                        {checkedCount}
                    </span>
                </button>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}