// ARXIU: src/components/shopping/ShoppingActiveList.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingListItem, ShoppingItemUI } from './ShoppingListItem';


interface Props {
    items: ShoppingItemUI[];
    onToggle: (id: string, val: boolean) => void;

    onFinish: () => void;
    isCompleting: boolean;
    cartTotal: number;
}

export function ShoppingActiveList({ items, onToggle, onFinish, isCompleting, cartTotal }: Props) {
    const checkedCount = items.filter(i => i.isChecked).length;

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            
           
            {/* Llista */}
            <div className="space-y-2 pb-32">
                <AnimatePresence mode='popLayout'>
                    {items.map((item) => (
                        <ShoppingListItem key={item.id} item={item} onToggle={onToggle} />
                    ))}
                </AnimatePresence>

                {items.length === 0 && (
                    <div className="text-center py-10 text-slate-500 bg-slate-900/20 rounded-xl border border-slate-800/50 border-dashed">
                        <div className="text-2xl mb-2">🛒</div>
                        La llista està buida.
                    </div>
                )}
            </div>

            {/* Footer Flotant */}
            <AnimatePresence>
                {checkedCount > 0 && (
                    <motion.div
                        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                        className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40"
                    >
                        <button
                            onClick={onFinish}
                            disabled={isCompleting}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-2xl shadow-emerald-900/50 flex items-center gap-3 transition-all active:scale-95 border-t border-emerald-400/20"
                        >
                            {isCompleting ? <span className="animate-spin">⏳</span> : <span>💳 Finalitzar Compra</span>}
                            <span className="bg-emerald-800 px-2 py-0.5 rounded-full text-xs font-mono border border-emerald-700">
                                {cartTotal.toFixed(2)}€
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}