'use client';

import { useState } from 'react';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { cookRecipeAction } from '@/app/actions/recipes'; // Assegura't que tens aquesta acció creada a la Fase 5
import { toast } from 'sonner';

interface Props {
  resultText: string;      
  recipe?: RecipeProps;    
  userId: string;
  onCookSuccess?: () => void;
}

export function DecisionResultCard({ resultText, recipe, userId, onCookSuccess }: Props) {
  const [isCooking, setIsCooking] = useState(false);

  const handleCook = async () => {
    if (!recipe) return;

    // UX: Confirmació per evitar clics accidentals que esborren menjar
    if (!window.confirm(`Segur que vols cuinar "${recipe.name}"? Es descomptaran els ingredients.`)) {
      return;
    }

    setIsCooking(true);
    // Cridem a l'acció que fa servir el UseCase CookRecipe
    const result = await cookRecipeAction(userId, recipe);
    setIsCooking(false);

    if (result.success) {
      toast.success('👨‍🍳 Inventari actualitzat! Bon profit.');
      if (onCookSuccess) onCookSuccess();
    } else {
      toast.error(`Error: ${result.error}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border-2 border-purple-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
      
      {/* Glow de fons */}
      <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-purple-600/20 blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 text-center">
        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 block">
          La Sala ha decidit:
        </span>
        
        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight drop-shadow-lg">
          {resultText}
        </h2>

        {/* ESTAT 1: Tenim la recepta carregada */}
        {recipe ? (
          <div className="mt-4 bg-black/40 rounded-xl p-4 text-left border border-white/10 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <span>🛒</span> Ingredients a utilitzar:
            </h3>
            <ul className="text-xs text-slate-400 space-y-2 mb-5 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex justify-between items-center border-b border-white/5 pb-1">
                  <span>{ing.name}</span>
                  <span className="font-mono text-purple-400 font-bold bg-purple-900/30 px-2 py-0.5 rounded">
                    {ing.quantity} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCook}
              disabled={isCooking}
              className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCooking ? (
                <span className="animate-pulse">🔥 Cuinant...</span>
              ) : (
                <>🍳 Cuinar i Restar Estoc</>
              )}
            </button>
          </div>
        ) : (
          /* ESTAT 2: Només tenim el text, esperant generar recepta (es gestiona des del pare) */
          <div className="h-4"></div> 
        )}
      </div>
    </div>
  );
}