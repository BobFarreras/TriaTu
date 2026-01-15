'use client';

import { Ingredient } from '../../types'; // Ajusta la ruta segons on tinguis types
import { FOOD_PRESETS } from "@/lib/foot-presets";

interface Props {
  name: string;
  ingredient?: Ingredient;
}

// Definim un tipus estès localment per evitar el 'any'
interface ExtendedIngredient extends Ingredient {
  linkedProductImage?: string;
  estimatedCost?: number;
}

export function IngredientChip({ name, ingredient }: Props) {
  // 1. Recuperem la imatge (prioritzem la del producte vinculat)
  // Fem un cast segur per accedir a propietats opcionals
  const ingData = ingredient as unknown as ExtendedIngredient | undefined;
  
  const imageUrl = ingData?.image || ingData?.linkedProductImage;
  const hasImage = !!imageUrl;

  // 2. Recuperem l'emoji (del preset o de l'ingredient)
  const preset = FOOD_PRESETS.find((p) => p.name === name);
  const emoji = ingData?.emoji || preset?.emoji || '📦';

  // 3. Recuperem el preu i quantitat
  const price = ingData?.estimatedCost ? ingData.estimatedCost.toFixed(2) : null;
  const quantity = ingData ? `${ingData.quantity}${ingData.unit}` : '';

  console.log(`RENDER CHIP [${name}]: hasImage=${hasImage}, url=${imageUrl}`);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 align-middle mx-1 px-1.5 py-0.5 rounded-lg border shadow-sm select-none transition-all
        ${hasImage
          ? 'bg-slate-800/90 border-emerald-500/40 text-white pr-2 shadow-emerald-900/20' // Estil Premium
          : 'bg-slate-800 border-slate-700 text-emerald-100'
        }
      `}
    >
      {/* FOTO o EMOJI */}
      <span className="w-5 h-5 rounded bg-white flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-black/10">
        {hasImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain p-0.5"
          />
        ) : (
          <span className="text-xs leading-none">{emoji}</span>
        )}
      </span>

      {/* NOM */}
      <span className="text-xs font-bold truncate max-w-30">{name}</span>

      {/* QUANTITAT (Griset) */}
      {quantity && (
        <span className="text-[9px] text-slate-300 font-mono leading-none bg-slate-950/50 px-1 py-0.5 rounded border border-slate-700/50">
          {quantity}
        </span>
      )}

      {/* PREU (Verd) - Opcional, però queda molt pro */}
      {price && (
        <span className="text-[9px] font-black text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded leading-none border border-emerald-500/20">
          {price}€
        </span>
      )}
    </span>
  );
}