import { useState, useTransition } from 'react';
import { getRecipeSuggestionsAction } from '@/app/actions/suggest-recipes';
import { getRandomRecipesAction } from '@/app/actions/get-random-recipes';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { toast } from 'sonner';

export type DecisionMode = 'FATE' | 'CHEF';

export function useIndividualDecision(userId: string) {
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<DecisionMode>('FATE');
  
  // Estats de Dades
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Inputs
  const [energy, setEnergy] = useState(5);
  const [time, setTime] = useState(30);
  const [error, setError] = useState<string | null>(null);

  const executeAction = () => {
    setError(null);
    startTransition(async () => {
      try {
        let response;

        if (mode === 'FATE') {
            // Mode Compacte: Només 1 recepta si és destí
            response = await getRandomRecipesAction(userId, 1);
        } else {
            response = await getRecipeSuggestionsAction(userId, energy, time);
        }

        if (response.success && response.recipes && response.recipes.length > 0) {
            setRecipes(response.recipes);
            setShowResults(true);
        } else {
            const msg = mode === 'FATE' 
                ? "No tens receptes compatibles guardades." 
                : "No s'han trobat combinacions amb el teu inventari.";
            toast.error(msg);
            setError(msg);
        }
      } catch (e) {
        console.error(e);
        toast.error("Error de connexió.");
      }
    });
  };

  const reset = () => {
    setRecipes([]);
    setShowResults(false);
    setError(null);
  };

  return {
    // State
    mode, setMode,
    energy, setEnergy,
    time, setTime,
    recipes,
    showResults,
    isPending,
    error,
    // Actions
    executeAction,
    reset
  };
}