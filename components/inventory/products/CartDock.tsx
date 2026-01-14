'use client';

import { useState } from 'react';
import { ProductResult } from '@/app/actions/inventory';

interface CartItem {
  product: ProductResult;
  quantity: number;
}

interface Props {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function CartDock({ items, onRemove, onSave, isSaving }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <>
      {/* MASCARA FOSCA */}
      {isExpanded && (
        <div 
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in"
        />
      )}

      {/* EL DOCK */}
      <div 
        className={`
           fixed bottom-0 left-0 right-0 z-50 
           bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]
           transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)
           ${isExpanded ? 'translate-y-0' : 'translate-y-0'} 
        `}
      >
        
        {/* PESTANYA (Handle) */}
        <div 
           onClick={() => setIsExpanded(!isExpanded)}
           className="w-full h-5 flex items-center justify-center cursor-pointer active:opacity-50 pt-2"
        >
           <div className="w-12 h-1 bg-slate-700 rounded-full" />
        </div>

        <div className="px-4 pb-6 pt-1">
           
           {/* HEADER (Resum) */}
           <div className="flex items-center justify-between mb-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-3 text-left group"
              >
                 <div className="relative transition-transform group-active:scale-95">
                    <span className="text-4xl filter drop-shadow-md">🛒</span>
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[11px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-slate-900 shadow-sm">
                      {totalItems}
                    </span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total estimat</span>
                    <span className="text-xl font-black text-white leading-none">{totalPrice.toFixed(2)}€</span>
                 </div>
              </button>

              {/* BOTÓ GUARDAR */}
              <button
                onClick={onSave}
                disabled={isSaving}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all flex items-center gap-2"
              >
                {isSaving ? '...' : (
                   <>
                     <span>Afegir</span>
                     <span className="bg-black/10 px-1.5 py-0.5 rounded text-xs">↵</span>
                   </>
                )}
              </button>
           </div>

           {/* AREA EXPANSIBLE (Carrusel) */}
           <div className={`
              overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
              ${isExpanded ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}
           `}>
              <div className="h-[1px] w-full bg-slate-800 mb-4" />
              
              {/* ✅ AFEGIT pt-3 PERQUÈ ELS BADGES NO ES TALLIN A DALT */}
              <div className="flex gap-4 overflow-x-auto pb-4 pt-3 scrollbar-hide snap-x px-1">
                {items.map((item) => (
                  <div key={item.product.id} className="relative flex-none w-20 group snap-start">
                    
                    {/* Badge Qty (Ara té espai gràcies al pt-3 del pare) */}
                    <div className="absolute -top-2 -right-2 z-20 bg-slate-100 text-slate-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
                      {item.quantity}
                    </div>

                    {/* Imatge */}
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 overflow-hidden border border-slate-700 relative shadow-sm">
                       {item.product.image ? (
                         /* eslint-disable-next-line @next/next/no-img-element */
                         <img src={item.product.image} className="w-full h-full object-contain" alt="" />
                       ) : (
                         <span className="text-3xl">{item.product.emoji}</span>
                       )}

                       {/* Botó X */}
                       <button 
                         onClick={() => onRemove(item.product.id)}
                         className="absolute inset-0 bg-red-500/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-2xl transition-all z-10 backdrop-blur-[2px]"
                       >
                         ✕
                       </button>
                    </div>
                    
                    {/* Nom */}
                    <div className="text-[10px] text-slate-400 text-center mt-2 leading-tight line-clamp-2 w-full px-1 font-medium">
                      {item.product.name}
                    </div>
                  </div>
                ))}
                
                {/* Espai extra al final */}
                <div className="w-2" />
              </div>
           </div>
           
        </div>
      </div>
    </>
  );
}