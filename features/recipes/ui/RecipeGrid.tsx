'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// ✅ IMPORTACIÓ CORRECTA
import { saveRecipeAction } from '@/app/actions/recipe-actions';
import { Recipe, RecipeProps } from '@/core/domain/entities/Recipe';
import { getDishEmoji } from '@/lib/utils/dish-emojis'; // ✅ Importem la utilitat
// ✅ Importem el tipus EditorData per fer el casting correcte
import { EditorData } from '@/components/recipes/editor/types';
interface Props {
  recipes: RecipeProps[];
  userId: string;
  onCancel: () => void;
}

const DEMO_IDS = [
  "1090b513-97e9-4ea5-93ab-b8de7bb43c32",
  "f5d2abe7-95b3-42fd-96fc-7db1d33bbd63"
];

// Definim tipus locals per evitar els 'any' dins del map
interface LocalStep {
  id?: string;
  content: string;
}

export function RecipeGrid({ recipes, onCancel }: Props) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleSelect = async (recipe: Recipe | RecipeProps) => {
    if (savingId) return;
    
    // Extreiem les dades
    const recipeId = recipe.id;
    // Càsting segur: si és una instància de Recipe, agafem props, sinó és l'objecte directament
    const plainData = recipe instanceof Recipe ? recipe.toPrimitives() : recipe;

    setSavingId(recipeId);

    if (recipeId && DEMO_IDS.includes(recipeId)) {
        toast.success("Obrint recepta de mostra...");
        router.push(`/recipes/${recipeId}`);
        return;
    }

    console.log("📤 [RecipeGrid] Enviant a saveRecipeAction:", plainData.name);

    // ✅ PREPARACIÓ DEL PAYLOAD
    // Creem l'objecte que compleix amb EditorData manualment
   // ✅ PREPARACIÓ DEL PAYLOAD (Tipat com EditorData)
    const payload: EditorData = {
        id: plainData.id,
        name: plainData.name,
        prepTimeMinutes: Number(plainData.prepTimeMinutes) || 30, // Assegurem number
        
        // Camps que falten a RecipeProps:
        description: "", 
        servings: 2, 
        
        // 🔥 FIX ERROR DIFFICULTY: Forcem el tipus estricte
        difficulty: "medium" as "easy" | "medium" | "hard",

        // Mapeig segur d'Ingredients
        ingredients: plainData.ingredients.map((ing) => ({
            id: ing.id,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            emoji: ing.emoji,
            estimatedCost: 0
        })),

        // Mapeig segur de Steps
        steps: plainData.steps.map((step) => {
            if (typeof step === 'string') {
                return { id: crypto.randomUUID(), content: step };
            }
            const stepObj = step as LocalStep;
            return { 
                id: stepObj.id || crypto.randomUUID(), 
                content: stepObj.content || "" 
            };
        }),

        dietaryTags: plainData.dietaryTags || [],
        
        // Flag IA
        isAiGenerated: true 
    };

    const result = await saveRecipeAction(payload);

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
        <button onClick={onCancel} className="text-xs font-bold text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors">
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

              <h4 className="font-bold text-lg text-white mb-2 line-clamp-2">{safeName}</h4>

              <div className="flex flex-wrap gap-1 mb-4">
                {recipe.ingredients?.slice(0, 3).map((ing, i) => (
                  <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    {ing.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}