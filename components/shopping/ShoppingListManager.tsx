'use client';

import { useState } from 'react';
import { toggleShoppingItemAction, completeShoppingSessionAction, addToShoppingListAction } from '@/app/actions/shopping-list-actions';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalAddItem } from '@/components/ui/UniversalAddItem';

// ✅ INTERFÍCIE ACTUALITZADA
interface Item {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    isChecked: boolean;
    emoji?: string;
    // Nous camps per a productes rics
    productId?: string;
    productImage?: string; 
    estimatedCost?: number;
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

    const handleAddItem = async (name: string, qty: number, unit: string, emoji: string) => {
        // Optimistic Update
        const tempId = crypto.randomUUID();
        const newItem: Item = { id: tempId, name, quantity: qty, unit, isChecked: false, emoji };
        setItems(prev => [newItem, ...prev]);

        // Nota: UniversalAddItem encara no suporta cercar productes, així que aquí no passem productId
        const result = await addToShoppingListAction(name, qty, unit, emoji);

        if (!result.success) {
            toast.error("Error guardant");
            setItems(prev => prev.filter(i => i.id !== tempId));
            return false;
        }
        return true;
    };

    if (items.length === 0) {
        return (
            <div className="space-y-6">
                 <UniversalAddItem
                    onAdd={handleAddItem}
                    placeholder="Afegir a la llista (ex: Llet)..."
                    defaultUnit="ut"
                />
                <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
                    <div className="text-4xl mb-4">🛒</div>
                    <p className="text-slate-500">La llista està buida.</p>
                    <p className="text-xs text-slate-600 mt-1">Afegeix coses des de les receptes o l'inventari.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">

            {/* 1. INPUT D'AFEGIR */}
            <UniversalAddItem
                onAdd={handleAddItem}
                placeholder="Afegir a la llista (ex: Llet)..."
                defaultUnit="ut"
            />

            {/* 2. LLISTA VISUAL */}
            <div className="space-y-2 pb-24">
                <AnimatePresence>
                    {items.map((item) => {
                        const hasImage = !!item.productImage;

                        return (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => handleToggle(item.id, item.isChecked)}
                            className={`
                                flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all select-none
                                ${item.isChecked
                                    ? 'bg-emerald-950/20 border-emerald-900/30 opacity-60'
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800'}
                            `}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                {/* CHECKBOX */}
                                <div className={`
                                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                                    ${item.isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}
                                `}>
                                    {item.isChecked && <span className="text-black text-xs font-bold">✓</span>}
                                </div>

                                {/* IMATGE O EMOJI */}
                                <div className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 bg-white p-0.5
                                    ${!hasImage && 'bg-transparent p-0'}
                                `}>
                                    {hasImage ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={item.productImage} alt={item.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-2xl">{item.emoji || '📦'}</span>
                                    )}
                                </div>

                                {/* INFO */}
                                <div className="flex flex-col min-w-0">
                                    <span className={`text-base truncate ${item.isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                        {item.name}
                                    </span>
                                    {/* PREU (Si existeix) */}
                                    {item.estimatedCost && !item.isChecked && (
                                        <span className="text-[10px] text-emerald-400 font-mono">
                                            {item.estimatedCost.toFixed(2)}€
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* QUANTITAT */}
                            <span className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-2 py-1 rounded shrink-0 ml-2">
                                {item.quantity}{item.unit}
                            </span>
                        </motion.div>
                    )})}
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
        </div>
    );
}