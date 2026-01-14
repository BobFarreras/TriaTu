'use client';

import { useState, useEffect } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { toggleIngredientStockAction } from '@/app/actions/inventory-quick-update';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getIngredientEmoji } from '@/lib/utils/emojiUtils';
import { MissingIngredientDialog, Ingredient } from '@/components/recipes/MissingIngredientDialog'; // ✅ Importem el modal


interface Props {
    ingredients: Ingredient[];
    inventory: InventoryItemProps[];
    userId: string;
}


export function IngredientsPanel({ ingredients, inventory, userId }: Props) {
    const router = useRouter();
    const [localInventory, setLocalInventory] = useState(inventory);
    const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
    // ✅ Nou estat per gestionar el modal
    const [missingIngredient, setMissingIngredient] = useState<Ingredient | null>(null);

    // Sincronització inicial i quan canvia el servidor
    useEffect(() => {
        console.log("🔄 [CLIENT] Inventari rebut (props):", inventory.length, "items");
        setLocalInventory(inventory);
    }, [inventory]);

    const handleToggleItem = async (index: number, ing: Ingredient) => {
        if (loadingItems.has(index)) return;

        const isChecking = !checkedItems.has(index);
        const action = isChecking ? 'CONSUME' : 'RESTORE';

        // 🔍 LOG CLIENT 1
        console.log(`🖱️ [CLIENT CLICK] Item: "${ing.name}" | Acció: ${action}`);

        setLoadingItems(prev => { const n = new Set(prev); n.add(index); return n; });

        const result = await toggleIngredientStockAction(userId, ing.name, ing.quantity, action, ing.unit);

        setLoadingItems(prev => { const n = new Set(prev); n.delete(index); return n; });

        // 🔍 LOG CLIENT 2
        console.log(`📩 [CLIENT RESULT] Success: ${result.success}`, result);

        if (result.success && result.newQuantity !== undefined) {
            setCheckedItems(prev => {
                const next = new Set(prev);
                if (isChecking) next.add(index);
                else next.delete(index);
                return next;
            });

            // Actualització Optimista / Local
            setLocalInventory(prev => prev.map(item => {
                // Lògica de matching local
                if (item.name.toLowerCase().includes(ing.name.toLowerCase()) ||
                    ing.name.toLowerCase().includes(item.name.toLowerCase())) {
                    console.log(`✅ [CLIENT UPDATE] Actualitzant localment "${item.name}" a ${result.newQuantity}`);
                    return { ...item, quantity: result.newQuantity! };
                }
                return item;
            }));

            if (isChecking) toast.success(`Restat: ${ing.quantity}${ing.unit}`);
            else toast.info(`Restaurat: ${ing.name}`);
        } else {
            // ❌ ERROR DETECTAT
            console.warn("⚠️ Stock Error:", result.error);

            // Detectem si és error de falta d'estoc
            const isMissingError = result.error?.includes("No tens") || result.error?.includes("no existeix");

            // Dins de handleToggleItem, quan detectem error:
            if (isMissingError && isChecking) {
                // ✅ Calculem l'emoji abans de passar-lo al modal
                const currentEmoji = getIngredientEmoji(ing.name);

                setMissingIngredient({
                    ...ing,
                    emoji: currentEmoji // <--- AFEGIM AIXÒ
                });
            } else {
                // Altres errors (ex: base de dades caiguda)
                toast.error(result.error || "Error desconegut");
            }
        }
    };

    const handleFinish = () => {
        toast.success("✨ Felicitats xef! Inventari actualitzat.");
        router.push('/inventory');
    };

    const allChecked = checkedItems.size === ingredients.length && ingredients.length > 0;


    return (

        <div className="bg-slate-900/50 border-r  border-slate-800 flex flex-col h-full rounded-bl-3xl overflow-hidden">
            {/* RENDERITZEM EL MODAL */}
            <MissingIngredientDialog
                isOpen={!!missingIngredient}
                ingredient={missingIngredient}
                onClose={() => setMissingIngredient(null)}
                onSuccess={() => {
                    // Opcional: Si l'usuari l'ha afegit a l'inventari, podríem tornar a intentar consumir-lo automàticament
                    // o simplement deixar que l'usuari torni a fer click (més segur).
                    console.log("Ingredient gestionat correctament");
                }}
            />
            {/* HEADER */}
            <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                <h3 className="font-black text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                    <span>🛒</span> Cistella
                </h3>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                    {checkedItems.size}/{ingredients.length}
                </span>
            </div>

            {/* LLISTA COMPACTA */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {ingredients.map((ing, i) => {
                    // Lògica de matching per pintar l'estat actual
                    const stockItem = localInventory.find(item =>
                        item.name.toLowerCase().includes(ing.name.toLowerCase()) ||
                        ing.name.toLowerCase().includes(item.name.toLowerCase())
                    );


                    const isChecked = checkedItems.has(i);
                    const isLoading = loadingItems.has(i);
                    const emoji = getIngredientEmoji(ing.name);

                    return (
                        <div
                            key={i}
                            onClick={() => handleToggleItem(i, ing)}
                            className={`
                        group relative flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 border
                        ${isChecked
                                    ? 'bg-slate-900/50 border-slate-800 opacity-50'
                                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-purple-500/50'
                                }
                    `}
                        >
                            {/* LOADING */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-slate-900/60 z-20 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                                    <span className="animate-spin text-white text-xs">⏳</span>
                                </div>
                            )}

                            {/* ESQUERRA */}
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`
                            w-6 h-6 rounded-lg flex items-center justify-center text-sm transition-colors shrink-0
                            ${isChecked ? 'bg-emerald-600/20 text-emerald-500' : 'bg-slate-900 text-slate-500 group-hover:bg-slate-600'}
                        `}>
                                    {isChecked ? '✓' : emoji}
                                </div>

                                <span className={`text-sm truncate font-medium ${isChecked ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                                    {ing.name}
                                </span>
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

            {/* FOOTER */}
            <div className="p-2 border-t border-slate-800 bg-slate-950">
                <button
                    onClick={handleFinish}
                    className={`
                w-full py-2.5 font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide
                ${allChecked
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                        }
            `}
                >
                    {allChecked ? '✅ Finalitzar' : '🚪 Sortir'}
                </button>
            </div>
        </div>
    );
}