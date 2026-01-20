// src/components/recipes/RecipeGrid.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { saveRecipeAction } from '@/app/actions/recipe-actions';
import { Recipe, RecipeProps } from '@/core/domain/entities/Recipe';
import { getDishEmoji } from '@/lib/utils/dish-emojis';
import { EditorData } from '@/features/recipes/components/editor/types';

interface Props {
  recipes: RecipeProps[];
  userId: string;
  onCancel: () => void;
}

// ✅ Interface local estesa que accepta nulls
interface ExtendedIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  emoji?: string;
  linkedProductId?: string | null;
  linkedProductImage?: string | null;
  estimatedCost?: number;
}

interface ExtendedStep { id?: string; content?: string; }

export function RecipeGrid({ recipes, onCancel }: Props) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);
  // 🔍 DEBUG: Afegeix això per veure què arriba realment al navegador
  console.log("🔍 [RecipeGrid DEBUG] Receptes rebudes:", recipes.length);
  if (recipes.length > 0) {
    console.log("🔍 [RecipeGrid DEBUG] Mostra de la 1a recepta:", {
      nom: recipes[0].name,
      cost: recipes[0].estimatedCost,
      tipus_cost: typeof recipes[0].estimatedCost,
      ingredients_count: recipes[0].ingredients.length
    });
  }
  const handleSelect = async (recipe: Recipe | RecipeProps) => {
    if (savingId) return;

    const recipeId = recipe.id;
    // Si ve com a classe, extraiem les primitives. Si ve com a objecte (JSON), ja ho és.
    const plainData = recipe instanceof Recipe ? recipe.toPrimitives() : recipe;

    setSavingId(recipeId);
    console.log("📤 [RecipeGrid] Guardant:", plainData.name);

    const payload: EditorData = {
      id: plainData.id,
      name: plainData.name,
      prepTimeMinutes: Number(plainData.prepTimeMinutes) || 30,
      description: "",
      servings: 2,
      difficulty: "medium",

      tags: plainData.tags || [],
      dietaryTags: plainData.dietaryTags || [],

      // 🔥 CORRECCIÓ DE DADES PERDUDES
      ingredients: plainData.ingredients.map((ing) => {
        // Càsting per accedir a camps opcionals que poden venir del backend
        const extendedIng = ing as unknown as ExtendedIngredient;

        // DEBUG: Comprovem si el camp existeix abans d'enviar
        if (extendedIng.linkedProductId) {
          console.log(`   💎 [GRID] Vincle trobat: ${extendedIng.name} -> ${extendedIng.linkedProductId}`);
        }

        return {
          id: extendedIng.id,
          name: extendedIng.name,
          quantity: extendedIng.quantity,
          unit: extendedIng.unit,
          emoji: extendedIng.emoji,

          // 🛑 CRUCIAL: Usem '|| null'.
          // Si és undefined o null, enviem null. Així el JSON no ho elimina.
          linkedProductId: extendedIng.linkedProductId || null,
          linkedProductImage: extendedIng.linkedProductImage || null,

          estimatedCost: extendedIng.estimatedCost || 0
        };
      }),

      steps: plainData.steps.map((step) => {
        if (typeof step === 'string') return { id: crypto.randomUUID(), content: step };
        const stepObj = step as ExtendedStep;
        return { id: stepObj.id || crypto.randomUUID(), content: stepObj.content || "" };
      }),

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
          // Assegurem que name no sigui null
          const safeName = recipe.name || "Recepta sense nom";
          const emoji = getDishEmoji(safeName);
          const hasCost = recipe.estimatedCost && recipe.estimatedCost > 0;

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
                <div className="flex flex-col items-end gap-1">
                  {recipe.prepTimeMinutes && (
                    <span className="text-[10px] font-bold bg-black/40 text-slate-300 px-2 py-1 rounded-full">
                      {recipe.prepTimeMinutes} min
                    </span>
                  )}
                  {hasCost ? (
                    <span className="text-[10px] font-bold bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
                      {recipe.estimatedCost?.toFixed(2)}€
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-400">0.00€</span>
                  )}
                </div>
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
