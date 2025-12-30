'use client';

import { useState, useEffect } from 'react'; // <--- AFEGIR useEffect
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { saveAndViewRecipeAction } from '@/app/actions/recipe-persistence';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  recipes: RecipeProps[];
  userId: string;
  onCancel: () => void;
}

// 🧠 1. HELPER: SMART EMOJI MAPPER
// Intenta endevinar l'emoji basant-se en paraules clau del nom del plat.
function getDishEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('pizz')) return '🍕';
  if (n.includes('hamburg')) return '🍔';
  if (n.includes('amanida') || n.includes('enciam')) return '🥗';
  if (n.includes('past') || n.includes('espaguet') || n.includes('macarr')) return '🍝';
  if (n.includes('arròs') || n.includes('paella')) return '🥘';
  if (n.includes('sopa') || n.includes('crema') || n.includes('brou')) return '🥣';
  if (n.includes('pollastre') || n.includes('gall')) return '🍗';
  if (n.includes('carn') || n.includes('vedella') || n.includes('filet')) return '🥩';
  if (n.includes('peix') || n.includes('lluç') || n.includes('rap')) return '🐟';
  if (n.includes('ou') || n.includes('truita') || n.includes('remenat')) return '🍳';
  if (n.includes('postre') || n.includes('pastís') || n.includes('xocolata')) return '🍰';
  if (n.includes('entrepà') || n.includes('biquini')) return '🥪';
  if (n.includes('taco') || n.includes('mexic')) return '🌮';
  if (n.includes('sushi')) return '🍣';
  
  // Fallback genèric si no troba res
  return '🍽️';
}

export function RecipeGrid({ recipes, userId, onCancel }: Props) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleSelect = async (recipe: RecipeProps) => {
    setSavingId(recipe.id); // Activem estat de càrrega visual
    
    // Guardem i redirigim
    const result = await saveAndViewRecipeAction(userId, recipe);

    if (result.success && result.recipeId) {
      router.push(`/recipes/${result.recipeId}`);
    } else {
      toast.error("Error guardant la recepta.");
      setSavingId(null);
    }
  };
// 🔍 LOG DE MUNTATGE
  useEffect(() => {
    console.log("🖼️ [RecipeGrid] Muntat amb receptes:", recipes.length);
  }, [recipes]);


  // PROTECCIÓ: Si no hi ha receptes, mostrem missatge en lloc de petar
  if (!recipes || recipes.length === 0) {
    return <div className="text-white p-4">⚠️ No hi ha receptes per mostrar.</div>;
  }
  return (
    // ✨ FIX CSS: Treiem animacions complexes inicials per descartar problemes de visibilitat
    <div className="space-y-6 w-full min-h-75"> 
      
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>👨‍🍳</span> Propostes del Xef
            </h3>
            <p className="text-xs text-slate-400">Tria la que més t'agradi.</p>
        </div>
        <button 
            onClick={onCancel} 
            className="text-xs font-bold text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors"
        >
          Tancar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe, idx) => {
          const isSaving = savingId === recipe.id;
          // Protecció contra noms nuls
          const safeName = recipe.name || "Recepta sense nom";
          const emoji = getDishEmoji(safeName);

          return (
            <div 
              key={idx}
              onClick={() => !savingId && handleSelect(recipe)}
              // ✨ FIX: Simplifiquem l'animació per assegurar que es veu
              className={`
                group relative flex flex-col justify-between
                p-5 rounded-3xl border cursor-pointer overflow-hidden transition-all duration-300
                bg-slate-900 border-slate-800 hover:border-purple-500
                ${isSaving ? 'opacity-50' : 'hover:shadow-xl hover:-translate-y-1'}
              `}
            >
              {/* Loader Overlay */}
              {isSaving && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
                  <span className="text-2xl animate-spin">⏳</span>
                </div>
              )}

              {/* CONTINGUT CARD */}
              <div className="flex justify-between items-start mb-3">
                 <div className="text-3xl bg-slate-800 w-12 h-12 flex items-center justify-center rounded-2xl">
                    {emoji}
                 </div>
                 {recipe.prepTimeMinutes && (
                    <span className="text-[10px] font-bold bg-black/40 text-slate-300 px-2 py-1 rounded-full">
                      {recipe.prepTimeMinutes} min
                    </span>
                 )}
              </div>

              <h4 className="font-bold text-lg text-white mb-2 line-clamp-2">
                {safeName}
              </h4>

              <div className="flex flex-wrap gap-1 mb-4">
                  {recipe.ingredients?.slice(0, 3).map((ing, i) => (
                    <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {ing.name}
                    </span>
                  ))}
              </div>

              <div className="mt-auto pt-3 border-t border-slate-800 flex justify-between">
                 <span className="text-[10px] uppercase font-bold text-purple-400">Cuinar</span>
                 <span className="text-slate-500 text-xs">➔</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}