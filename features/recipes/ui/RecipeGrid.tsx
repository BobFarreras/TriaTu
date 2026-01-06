'use client';

import { useState} from 'react';

import { saveAndViewRecipeAction } from '@/app/actions/recipe-persistence';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Recipe, RecipeProps } from '@/core/domain/entities/Recipe';
interface Props {
  recipes: RecipeProps[];
  userId: string; // Encara el rebem per si el necessites per UI, però no s'envia a l'acció
  onCancel: () => void;
}
// LLISTA D'IDS DE DEMO QUE NO S'HAN DE TORNAR A GUARDAR
const DEMO_IDS = [
  "1090b513-97e9-4ea5-93ab-b8de7bb43c32",
  "f5d2abe7-95b3-42fd-96fc-7db1d33bbd63"
];
function getDishEmoji(name: string): string {
  if (!name) return '🍽️';

  const n = name.toLowerCase();

  // 🍕 Fast Food / Casual
  if (n.includes('pizza')) return '🍕';
  if (n.includes('burger') || n.includes('hamburg')) return '🍔';
  if (n.includes('taco') || n.includes('fajita') || n.includes('burrito')) return '🌮';
  if (n.includes('entrep') || n.includes('bocata') || n.includes('sandwich') || n.includes('bikini')) return '🥪';
  if (n.includes('frit') || n.includes('fregit') || n.includes('croquet')) return '🍟';

  // 🍝 Pasta & Arròs
  if (n.includes('pasta') || n.includes('espagueti') || n.includes('macarron') || n.includes('ravioli')) return '🍝';
  if (n.includes('arròs') || n.includes('paella') || n.includes('risotto')) return '🥘';
  if (n.includes('fideu')) return '🍜';

  // 🥗 Saludable / Verdures
  if (n.includes('amanida') || n.includes('enciam') || n.includes('salad') || n.includes('verd')) return '🥗';
  if (n.includes('sopa') || n.includes('crema') || n.includes('brou')) return '🥣';
  if (n.includes('albergínia') || n.includes('carbassó') || n.includes('pastanaga')) return '🥦';

  // 🥩 Proteïna
  if (n.includes('pollastre') || n.includes('pavo') || n.includes('au')) return '🍗';
  if (n.includes('carn') || n.includes('vedella') || n.includes('porc') || n.includes('filet') || n.includes('xai')) return '🥩';
  if (n.includes('sushi') || n.includes('maki')) return '🍣';
  if (n.includes('peix') || n.includes('luç') || n.includes('bacalla') || n.includes('salm') || n.includes('gamba')) return '🐟';
  if (n.includes('ou') || n.includes('truita') || n.includes('remenat')) return '🍳';

  // 🍰 Postres
  if (n.includes('postre') || n.includes('pastís') || n.includes('cake') || n.includes('tiramisú')) return '🍰';
  if (n.includes('gelat')) return '🍦';
  if (n.includes('xocolata') || n.includes('bombó')) return '🍫';
  if (n.includes('fruita') || n.includes('poma') || n.includes('maduixa')) return '🍎';
  if (n.includes('galet')) return '🍪';

  // 🥖 Acompanyaments
  if (n.includes('pa ') || n.includes('torrada')) return '🥖';
  if (n.includes('formatge')) return '🧀';

  // Per defecte
  return '🍽️';
}

export function RecipeGrid({ recipes, onCancel }: Props) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleSelect = async (recipe: Recipe | RecipeProps) => {
    if (savingId) return;
    
    // Obtenim l'ID i les dades
    const recipeId = recipe.id;
    const plainData = 'props' in recipe ? recipe.props : recipe;

    setSavingId(recipeId);

    // --- 🛑 CHECK DE SEGURETAT PER DEMO ---
    // Si és una recepta de mostra existent, NO la guardem de nou.
    // Simplement redirigim.
    if (recipeId && DEMO_IDS.includes(recipeId)) {
        console.log("⏩ [RecipeGrid] Recepta DEMO detectada. Saltant guardat...");
        toast.success("Obrint recepta de mostra...");
        router.push(`/recipes/${recipeId}`);
        return;
    }
    // --------------------------------------

    console.log("📤 Enviant al servidor:", plainData.name);

    const result = await saveAndViewRecipeAction(plainData);

    if (result.success) {
      toast.success("Recepta guardada correctament!");
      router.push(`/recipes/${result.recipeId}`);
    } else {
      toast.error(result.error || "Error guardant la recepta.");
      setSavingId(null);
    }
  };

  if (!recipes || recipes.length === 0) {
    return <div className="text-white p-4">⚠️ No hi ha receptes per mostrar.</div>;
  }

  return (
    <div id="tour-dec-results" className="space-y-6 w-full min-h-75">

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
          const safeName = recipe.name || "Recepta sense nom";
          const emoji = getDishEmoji(safeName);

          return (
            <div
              key={recipe.id || idx}
              onClick={() => handleSelect(recipe)}
              className={`
                group relative flex flex-col justify-between
                p-5 rounded-3xl border cursor-pointer overflow-hidden transition-all duration-300
                bg-slate-900 border-slate-800 hover:border-purple-500
                ${isSaving ? 'opacity-50 pointer-events-none' : 'hover:shadow-xl hover:-translate-y-1'}
              `}
            >
              {isSaving && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
                  <span className="text-2xl animate-spin">⏳</span>
                </div>
              )}

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