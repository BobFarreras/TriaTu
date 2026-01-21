'use client';

import { useState } from 'react';
import { Plus, ShoppingBasket } from 'lucide-react';
import { Ingredient } from '../../types';

interface Props {
  ingredients: Ingredient[];
  prepTimeMinutes: number;
  onInsert: (text: string) => void;
}

// ✅ DEFINICIÓ LOCAL SEGURA (Evita 'any')
interface ExtendedIngredient extends Ingredient {
  linkedProductImage?: string;
}

export function SuggestionChips({ ingredients, prepTimeMinutes, onInsert }: Props) {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  return (
    <div className="shrink-0 p-3 bg-slate-900/50 border-b border-slate-800 max-h-40 overflow-y-auto custom-scrollbar">
      <div className="flex flex-wrap gap-2 items-center">
        
        {/* --- 1. BOTÓ TEMPS --- */}
        <button
          onClick={() => onInsert(`⏰ ${prepTimeMinutes} min`)}
          className="group flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-purple-900/20 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all active:scale-95 h-[42px]"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700 group-hover:border-purple-500/30">
            <span className="text-base">⏰</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Temps</span>
            <span className="text-xs font-mono font-bold text-purple-200 group-hover:text-white leading-none">
              {prepTimeMinutes}m
            </span>
          </div>
        </button>

        <div className="w-px h-8 bg-slate-800 mx-1"></div>

        {/* --- 2. INGREDIENTS --- */}
        {ingredients.map((ing, i) => {
          // ✅ CAST SEGUR A ExtendedIngredient
          const extendedIng = ing as unknown as ExtendedIngredient;
          
          const imageUrl = extendedIng.image || extendedIng.linkedProductImage;
          const hasImage = !!imageUrl && !imgErrors[ing.id];
          const displayEmoji = ing.emoji || '📦';
          const safeKey = ing.id || `ing-fallback-${i}`;

          const cardStyle = hasImage
            ? 'bg-slate-800/80 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-slate-800'
            : 'bg-slate-800 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/80';

          return (
            <button
              key={safeKey}
              onClick={() => onInsert(`[${ing.name}]`)}
              className={`group relative flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border transition-all active:scale-95 h-[42px] ${cardStyle}`}
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm ring-1 ring-black/10">
                {hasImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imageUrl}
                    alt={ing.name}
                    className="w-full h-full object-contain p-0.5"
                    onError={() => setImgErrors((prev) => ({ ...prev, [ing.id]: true }))}
                  />
                ) : (
                  <span className="text-lg leading-none">{displayEmoji}</span>
                )}
              </div>

              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs font-bold text-slate-200 truncate max-w-[100px] leading-tight">
                  {ing.name}
                </span>
                <span className="text-[9px] text-slate-400 font-mono leading-none mt-0.5">
                  {ing.quantity} {ing.unit}
                </span>
              </div>

              <Plus size={12} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
            </button>
          );
        })}

        {/* --- 3. ESTAT BUIT --- */}
        {ingredients.length === 0 && (
          <div className="flex items-center gap-2 text-slate-500 italic py-2 px-2 bg-slate-900/30 rounded-lg border border-dashed border-slate-800">
            <ShoppingBasket size={14} />
            <span className="text-xs">Afegeix productes...</span>
          </div>
        )}
      </div>
    </div>
  );
}
