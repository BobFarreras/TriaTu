'use client';

import { useState } from 'react';
import { generateRecipesAction, cookRecipeAction } from '@/app/actions/recipe-actions';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { toast } from 'sonner'; // O el sistema de notificacions que usis

interface RecipeSuggestionsProps {
  userId: string;
}

export function RecipeSuggestions({ userId }: RecipeSuggestionsProps) {
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    const result = await generateRecipesAction(userId);
    if (result.success && result.recipes) {
      setRecipes(result.recipes);
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleCook = async (recipe: RecipeProps) => {
    const ok = confirm(`Vols cuinar "${recipe.name}"? Es restaran els ingredients de l'inventari.`);
    if (!ok) return;

    const result = await cookRecipeAction(userId, recipe);
    if (result.success) {
      toast.success("Bon profit! Inventari actualitzat.");
      setRecipes([]); // Netegem o refresquem
      window.location.reload(); // Per veure els canvis a la llista d'inventari
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Idees per cuinar</h2>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50 transition-all"
        >
          {isLoading ? 'Pensant...' : '🪄 Generar amb IA'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-2">
                {recipe.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase font-bold">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-bold text-purple-400 mb-3">{recipe.name}</h3>
              <ul className="text-sm text-slate-400 space-y-1 mb-4">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>• {ing.name}: {ing.quantity} {ing.unit}</li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={() => handleCook(recipe)}
              className="w-full bg-slate-800 hover:bg-green-900/30 hover:text-green-400 text-slate-300 py-2 rounded-xl font-bold transition-all border border-slate-700"
            >
              🍳 Cuinar aquest plat
            </button>
          </div>
        ))}
      </div>
      
      {!isLoading && recipes.length === 0 && (
        <p className="text-center text-slate-500 italic py-10 border-2 border-dashed border-slate-800 rounded-3xl">
          Clica el botó per obtenir idees basades en el que tens al rebost.
        </p>
      )}
    </div>
  );
}