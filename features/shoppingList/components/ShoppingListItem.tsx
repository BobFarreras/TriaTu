// ARXIU: src/features/shoppingList/components/ShoppingListItem.tsx
'use client';

import { motion } from 'framer-motion';

export interface ShoppingItemUI {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    isChecked: boolean;
    emoji?: string;
    productId?: string;
    productImage?: string; 
    estimatedCost?: number;
}

interface Props {
    item: ShoppingItemUI;
    onToggle: (id: string, currentStatus: boolean) => void;
}

export function ShoppingListItem({ item, onToggle }: Props) {
    const hasImage = !!item.productImage;

    return (
        <motion.div 
            layout 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            data-testid="shopping-item"
            data-item-id={item.id}
            className={`
                group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all select-none
                ${item.isChecked 
                    ? 'bg-emerald-950/20 border-emerald-900/30 opacity-60' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800'}
            `}
            onClick={() => onToggle(item.id, item.isChecked)}
        >
             {/* ESQUERRA: Imatge + Info */}
             <div className="flex items-center gap-3 min-w-0">
                <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 bg-white p-0.5
                    ${!hasImage && 'bg-transparent p-0'}
                `}>
                    {hasImage && item.productImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                            src={item.productImage} 
                            alt={item.name} 
                            className="w-full h-full object-contain" 
                        />
                    ) : (
                        <span className="text-2xl">{item.emoji || '📦'}</span>
                    )}
                </div>

                <div className="flex flex-col min-w-0">
                    <span className={`text-base truncate font-medium ${item.isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {item.name}
                    </span>
                    {item.estimatedCost && !item.isChecked && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                            {item.estimatedCost.toFixed(2)}€ /ut
                        </span>
                    )}
                </div>
             </div>

             {/* DRETA: Quantitat + Preu Total */}
             <div className="flex flex-col items-end pl-2">
                 <span className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-2 py-1 rounded shrink-0">
                    {item.quantity}{item.unit}
                 </span>
                 {item.estimatedCost && (
                     <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">
                         {(item.estimatedCost * item.quantity).toFixed(2)}€
                     </span>
                 )}
             </div>
        </motion.div>
    );
}
