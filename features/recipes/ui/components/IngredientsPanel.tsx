'use client';

import { useState, useEffect } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { toggleIngredientStockAction } from '@/app/actions/inventory-quick-update';
import { toast } from 'sonner';
import { getIngredientEmoji } from '@/lib/utils/emojiUtils';
import { MissingIngredientDialog, Ingredient as ModalIngredient } from '@/components/recipes/MissingIngredientDialog';
import { ChevronDown } from 'lucide-react'; 
import { AnimatePresence, motion } from 'framer-motion';

// ✅ INTERFÍCIE CORRECTA (Sense index signature [key: string]: unknown)
export interface IngredientWithMeta {
    name: string;
    quantity: number;
    unit: string;
    // Camps opcionals
    id?: string;
    emoji?: string;
    image?: string;
    // Camps de producte ric
    linkedProductImage?: string;
    estimatedCost?: number;
    linkedProductId?: string; // ✅ Opcional perquè potser no existeix
}

interface Props {
    ingredients: IngredientWithMeta[];
    inventory: InventoryItemProps[];
    userId: string;
}

export function IngredientsPanel({ ingredients, inventory, userId }: Props) {

    const [localInventory, setLocalInventory] = useState(inventory);
    const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
    const [missingIngredient, setMissingIngredient] = useState<ModalIngredient | null>(null);
    
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        setLocalInventory(inventory);
    }, [inventory]);

    const handleToggleItem = async (index: number, ing: IngredientWithMeta) => {
        if (loadingItems.has(index)) return;

        const isChecking = !checkedItems.has(index);
        const action = isChecking ? 'CONSUME' : 'RESTORE';

        setLoadingItems(prev => { const n = new Set(prev); n.add(index); return n; });

        const currentEmoji = ing.emoji || getIngredientEmoji(ing.name);

        const result = await toggleIngredientStockAction(userId, ing.name, ing.quantity, action, ing.unit);

        setLoadingItems(prev => { const n = new Set(prev); n.delete(index); return n; });

        if (result.success && result.newQuantity !== undefined) {
            setCheckedItems(prev => {
                const next = new Set(prev);
                if (isChecking) next.add(index);
                else next.delete(index);
                return next;
            });

            setLocalInventory(prev => prev.map(item => {
                if (item.name.toLowerCase().includes(ing.name.toLowerCase()) ||
                    ing.name.toLowerCase().includes(item.name.toLowerCase())) {
                    return { ...item, quantity: result.newQuantity! };
                }
                return item;
            }));

            if (isChecking) toast.success(`Restat: ${ing.quantity}${ing.unit}`);
            else toast.info(`Restaurat: ${ing.name}`);
        } else {
            console.warn("⚠️ Stock Error:", result.error);
            const isMissingError = result.error?.includes("No tens") || result.error?.includes("no existeix");

            if (isMissingError && isChecking) {
                
                // ✅ CORRECCIÓ: Eliminem 'as any' perquè la interfície ja ho suporta
                const modalIng: ModalIngredient = {
                    name: ing.name,
                    quantity: ing.quantity,
                    unit: ing.unit,
                    emoji: currentEmoji,
                    // Accés directe i tipat
                    linkedProductId: ing.linkedProductId || '', // Valor per defecte si és undefined
                    linkedProductImage: ing.linkedProductImage || ing.image,
                    estimatedCost: ing.estimatedCost
                };

                console.log("🛠️ [CLIENT] Obrint modal amb:", modalIng);
                setMissingIngredient(modalIng);
            } else {
                toast.error(result.error || "Error desconegut");
            }
        }
    };

    return (
        <div className="bg-slate-900/50 border-r border-slate-800 flex flex-col h-full rounded-bl-3xl overflow-hidden">
            <MissingIngredientDialog
                isOpen={!!missingIngredient}
                ingredient={missingIngredient}
                onClose={() => setMissingIngredient(null)}
                onSuccess={() => console.log("Ingredient gestionat")}
            />

            {/* HEADER CLICABLE */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 border-b border-slate-800/50 bg-slate-900/80 hover:bg-slate-800 flex justify-between items-center w-full transition-colors"
            >
                <div className="flex items-center gap-3">
                    <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                        <span>🛒</span> Cistella
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                        {checkedItems.size}/{ingredients.length}
                    </span>
                </div>

                <ChevronDown
                    className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    size={20}
                />
            </button>

            {/* CONTINGUT PLEGABLE */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {ingredients.map((ing, i) => {
                                const stockItem = localInventory.find(item =>
                                    item.name.toLowerCase().includes(ing.name.toLowerCase()) ||
                                    ing.name.toLowerCase().includes(item.name.toLowerCase())
                                );

                                const isChecked = checkedItems.has(i);
                                const isLoading = loadingItems.has(i);
                                const emoji = ing.emoji || getIngredientEmoji(ing.name);
                                const imageUrl = ing.image || ing.linkedProductImage;
                                const hasImage = !!imageUrl;
                                const price = ing.estimatedCost;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleToggleItem(i, ing)}
                                        className={`
                                        group relative flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 border select-none
                                        ${isChecked
                                            ? 'bg-slate-900/50 border-slate-800 opacity-50'
                                            : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-emerald-500/50'
                                        }
                                    `}
                                    >
                                        {/* LOADING OVERLAY */}
                                        {isLoading && (
                                            <div className="absolute inset-0 bg-slate-900/60 z-20 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                                                <span className="animate-spin text-white text-xs">⏳</span>
                                            </div>
                                        )}

                                        {/* ESQUERRA: ICONA + NOM */}
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`
                                        w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-black/10 transition-colors
                                        ${isChecked ? 'bg-emerald-900/20' : 'bg-white'}
                                    `}>
                                                {isChecked ? (
                                                    <span className="text-emerald-500 font-bold">✓</span>
                                                ) : hasImage ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img src={imageUrl} alt={ing.name} className="w-full h-full object-contain p-0.5" />
                                                ) : (
                                                    <span className="text-lg leading-none">{emoji}</span>
                                                )}
                                            </div>

                                            <div className="flex flex-col min-w-0">
                                                <span className={`text-sm truncate font-bold ${isChecked ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                                                    {ing.name}
                                                </span>
                                                {price && !isChecked && (
                                                    <span className="text-[9px] font-mono text-emerald-400 leading-none">
                                                        {price.toFixed(2)}€
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* DRETA */}
                                        <div className="flex items-center gap-2 pl-2 shrink-0">
                                            <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded-md">
                                                {ing.quantity}{ing.unit}
                                            </span>
                                            <span className="text-slate-600 text-[10px] font-light">/</span>
                                            {stockItem ? (
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${stockItem.quantity > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                                                    {stockItem.quantity}{stockItem.unit}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-md">
                                                    0
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}