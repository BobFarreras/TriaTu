'use client';

import { Ingredient } from '../types';
import { useProductLinker } from './useProductLinker';
import { Loader2, Check, X, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  onUpdateIngredients: (updated: Ingredient[]) => void;
}

export function ProductLinkerModal({ isOpen, onClose, ingredients, onUpdateIngredients }: Props) {
  const { loading, matches, selectedProducts, selectProduct, applyChanges, totalCost } = useProductLinker(ingredients, isOpen);

  const handleConfirm = () => {
    const updated = applyChanges(ingredients);
    onUpdateIngredients(updated);
    onClose();
  };

  if (!isOpen || typeof document === 'undefined') return null;

  const linkedCount = Object.keys(selectedProducts).length;
  const totalIngredients = ingredients.length;
  const progress = Math.round((linkedCount / totalIngredients) * 100);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 isolate">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-slate-900 w-full max-w-4xl h-[85vh] rounded-3xl border border-slate-800 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
          <div>
             <h2 className="text-xl font-black text-white flex items-center gap-2">
               <span className="text-2xl">🪄</span> Càlcul de Costos
             </h2>
             <p className="text-sm text-slate-400 mt-0.5">
               Connectant amb <span className="text-yellow-500 font-bold">Bonpreu</span>
             </p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 custom-scrollbar">
          
          {loading && Object.keys(matches).length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                <p className="animate-pulse">Buscant preus al supermercat...</p>
             </div>
          ) : (
             ingredients.map((ing) => {
                const productOptions = matches[ing.id] || [];
                const selected = selectedProducts[ing.id];
                const isLinked = !!ing.linkedProductId || !!selected;
                const hasOptions = productOptions.length > 0;

                return (
                  <div key={ing.id} className="relative pl-4 border-l-2 border-slate-800 hover:border-slate-700 transition-colors py-1">
                    <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors ${isLinked ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-900 border-slate-600'}`} />

                    {/* Títol Ingredient */}
                    <div className="flex items-center gap-3 mb-3">
                       <span className="text-2xl">{ing.emoji || '🥗'}</span>
                       <div>
                          <h3 className="text-white font-bold text-lg leading-tight">{ing.name}</h3>
                          <p className="text-xs text-purple-300 font-mono">
                             {ing.quantity} {ing.unit}
                          </p>
                       </div>
                    </div>

                    {/* ZONA DE PRODUCTES (SCROLL HORITZONTAL) */}
                    <div className="pl-2">
                       {!hasOptions && !loading ? (
                          <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 text-slate-400 border border-dashed border-slate-700 text-sm">
                             <AlertCircle size={16} />
                             <span>No hem trobat "{ing.name}". Prova de simplificar el nom.</span>
                          </div>
                       ) : (
                          // ✅ TORNEM A L'SCROLL HORITZONTAL (snap-x)
                          <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-slate-700 snap-x">
                             {productOptions.map(prod => {
                                const isSelected = selected?.id === prod.id;
                                return (
                                  <button
                                    key={prod.id}
                                    onClick={() => selectProduct(ing.id, prod)}
                                    className={`
                                       relative flex-none w-36 snap-start text-left group transition-all duration-200
                                       border rounded-xl overflow-hidden flex flex-col
                                       ${isSelected 
                                          ? 'bg-emerald-900/10 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg scale-[1.02]' 
                                          : 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                                       }
                                    `}
                                  >
                                     {/* Imatge */}
                                     <div className="h-24 w-full bg-white p-2 flex items-center justify-center relative shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={prod.image} className="h-full object-contain mix-blend-multiply" alt="" />
                                        {isSelected && (
                                           <div className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full shadow-md animate-in zoom-in">
                                              <Check size={10} strokeWidth={4} />
                                           </div>
                                        )}
                                     </div>

                                     {/* Info */}
                                     <div className="p-2.5 flex flex-col justify-between flex-1 min-h-[70px]">
                                        <p className={`text-[10px] font-medium leading-tight line-clamp-2 mb-2 ${isSelected ? 'text-emerald-300' : 'text-slate-300'}`}>
                                           {prod.name}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                           <span className="text-[9px] text-slate-500">
                                              {prod.quantityAmount ? `${prod.quantityAmount}${prod.quantityUnit}` : 'Unitat'}
                                           </span>
                                           <span className="font-mono font-black text-xs text-white bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                              {prod.price}€
                                           </span>
                                        </div>
                                     </div>
                                  </button>
                                );
                             })}
                          </div>
                       )}
                    </div>
                  </div>
                );
             })
          )}
        </div>

        {/* FOOTER */}
        <div className="shrink-0 bg-slate-950 border-t border-slate-800 p-4 sm:p-6 pb-8 sm:pb-6">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-xs hidden sm:block">
                 <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 uppercase">
                    <span>Progrés</span>
                    <span>{linkedCount} / {totalIngredients}</span>
                 </div>
                 <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                       className="h-full bg-linear-to-r from-purple-500 to-emerald-500 transition-all duration-500 ease-out" 
                       style={{ width: `${progress}%` }}
                    />
                 </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                 <div className="text-right">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                    <span className="block text-2xl font-black text-emerald-400 font-mono leading-none">
                       {totalCost.toFixed(2)}€
                    </span>
                 </div>

                 <button 
                   onClick={handleConfirm}
                   className="bg-white hover:bg-slate-200 text-slate-900 font-black py-3 px-6 rounded-xl shadow-lg shadow-white/5 active:scale-95 transition-all flex items-center gap-2 text-sm"
                 >
                   <LinkIcon size={16} strokeWidth={2.5} />
                   Aplicar
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
