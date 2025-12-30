'use client';

import { useState } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { toggleIngredientStockAction } from '@/app/actions/inventory-quick-update'; 
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Props {
  ingredients: Ingredient[];
  inventory: InventoryItemProps[];
  userId: string;
}

const getIngredientEmoji = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('tomaquet') || n.includes('tomàquet')) return '🍅';
    if (n.includes('ceba')) return '🧅';
    if (n.includes('all')) return '🧄';
    if (n.includes('oli')) return '🫒';
    if (n.includes('sal')) return '🧂';
    if (n.includes('ou')) return '🥚';
    if (n.includes('patata')) return '🥔';
    if (n.includes('pollastre')) return '🍗';
    if (n.includes('vedella') || n.includes('carn')) return '🥩';
    if (n.includes('formatge')) return '🧀';
    if (n.includes('llet') || n.includes('nata')) return '🥛';
    if (n.includes('arròs')) return '🍚';
    if (n.includes('pasta') || n.includes('macarr')) return '🍝';
    return '🥗';
};

export function IngredientsPanel({ ingredients, inventory, userId }: Props) {
  const router = useRouter();
  const [localInventory, setLocalInventory] = useState(inventory);
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const handleToggleItem = async (index: number, ing: Ingredient) => {
    if (loadingItems.has(index)) return;

    const isChecking = !checkedItems.has(index);
    const action = isChecking ? 'CONSUME' : 'RESTORE';

    setLoadingItems(prev => { const n = new Set(prev); n.add(index); return n; });

    const result = await toggleIngredientStockAction(userId, ing.name, ing.quantity, action);

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
        toast.error(result.error || "Error de connexió");
    }
  };

  const handleFinish = () => {
      toast.success("✨ Felicitats xef! Inventari actualitzat.");
      router.push('/inventory');
  };

  const allChecked = checkedItems.size === ingredients.length && ingredients.length > 0;

  return (
    <div className="bg-slate-900/50 border-r border-slate-800 flex flex-col h-full rounded-bl-3xl overflow-hidden">
      
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
            const stockItem = localInventory.find(item => 
                item.name.toLowerCase().includes(ing.name.toLowerCase()) || 
                ing.name.toLowerCase().includes(item.name.toLowerCase())
            );
            
            const hasEnough = stockItem ? stockItem.quantity >= 0 : false;
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
                    {/* LOADING OVERLAY (Subtil) */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-slate-900/60 z-20 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                            <span className="animate-spin text-white text-xs">⏳</span>
                        </div>
                    )}

                    {/* ESQUERRA: Check + Nom */}
                    <div className="flex items-center gap-3 overflow-hidden">
                        {/* Checkbox Petit */}
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

                    {/* DRETA: Comparativa Compacta */}
                    <div className="flex items-center gap-2 pl-2 shrink-0">
                        
                        {/* 1. EL QUE CAL (Lila) */}
                        <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded-md">
                            {ing.quantity}{ing.unit}
                        </span>

                        <span className="text-slate-600 text-[10px] font-light">/</span>

                        {/* 2. EL QUE TENS (Coloritzat) */}
                        {stockItem ? (
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${hasEnough ? 'text-emerald-400 bg-emerald-500/10' : 'text-orange-400 bg-orange-500/10'}`}>
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