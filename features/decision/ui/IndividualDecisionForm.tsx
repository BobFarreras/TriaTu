'use client'

import { useState, useTransition } from 'react';
import { makeIndividualDecisionAction } from '@/app/actions/decision-actions';
import { generateRecipeFromDecisionAction } from '@/app/actions/decision-cooking';
import { getRecipeSuggestionsAction } from '@/app/actions/suggest-recipes';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { DecisionType } from '@/core/domain/entities/Decision';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';

// Imports Refactoritzats
import { EnergyTimeSliders } from './components/EnergyTimeSliders';
import { FateResult } from './components/FateResult';
import { RecipeGrid } from '@/features/recipes/ui/RecipeGrid';

export function IndividualDecisionForm({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [mode, setMode] = useState<'FATE' | 'CHEF'>('FATE');
  const [viewState, setViewState] = useState<'INPUT' | 'RESULT_FATE' | 'RESULT_CHEF'>('INPUT');

  const [fateResult, setFateResult] = useState<{ choice: string, reason: string } | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeProps | undefined>(undefined);
  const [chefSuggestions, setChefSuggestions] = useState<RecipeProps[]>([]);

  const [energy, setEnergy] = useState(5);
  const [time, setTime] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

  // --- ACTIONS ---

  const handleFateDecide = () => {
    setError(null);
    setViewState('INPUT');
    startTransition(async () => {
      await new Promise(r => setTimeout(r, 600));
      const response = await makeIndividualDecisionAction({
        userId,
        type: DecisionType.FOOD,
        energyLevel: energy,
        timeMinutes: time
      });
      if (response.success && response.data) {
        setFateResult({ choice: response.data.choice!, reason: response.data.reason! });
        setViewState('RESULT_FATE');
      } else {
        setError(response.error || t.common.error);
      }
    });
  };

  const handleChefSuggest = () => {
    console.log("🖱️ [CLIENT] Botó 'Xef' clicat");
    setError(null);

    startTransition(async () => {
      console.log("⏳ [CLIENT] Cridant Server Action...");

      try {
        const response = await getRecipeSuggestionsAction(userId, energy, time);

        console.log("📩 [CLIENT] Resposta rebuda:", response);

        if (response.success && response.recipes && response.recipes.length > 0) {
          console.log("✅ [CLIENT] Dades vàlides. Actualitzant Estat...");

          // 1. Guardem les receptes
          setChefSuggestions(response.recipes);

          // 2. Canviem la vista
          setViewState('RESULT_CHEF');

          console.log("🔄 [CLIENT] Estat actualitzat a RESULT_CHEF. Longitud:", response.recipes.length);
        } else {
          console.warn("⚠️ [CLIENT] Success=true però sense receptes o array buit.");
          toast.error(response.error || "No s'han trobat receptes.");
        }
      } catch (e) {
        console.error("💥 [CLIENT] Error en la crida:", e);
        toast.error("Error de connexió.");
      }
    });
  };

  const handleGenerateRecipeFromFate = async () => {
    if (!fateResult) return;
    setIsLoadingRecipe(true);
    const response = await generateRecipeFromDecisionAction(userId, fateResult.choice);
    if (response.success && response.recipe) {
      setGeneratedRecipe(response.recipe);
      toast.success("Recepta trobada!");
    } else {
      toast.error(response.error || "No s'ha pogut generar la recepta.");
    }
    setIsLoadingRecipe(false);
  };

  const handleReset = () => {
    setFateResult(null);
    setGeneratedRecipe(undefined);
    setChefSuggestions([]);
    setViewState('INPUT');
  };

  // --- RENDERING ---

  if (viewState === 'RESULT_FATE' && fateResult) {
    return (
      <FateResult
        choice={fateResult.choice}
        reason={fateResult.reason}
        generatedRecipe={generatedRecipe}
        isLoadingRecipe={isLoadingRecipe}
        onGenerateRecipe={handleGenerateRecipeFromFate}
        onCookSuccess={() => {/* opcional */ }}
        onReset={handleReset}
        userId={userId}
      />
    );
  }

  if (viewState === 'RESULT_CHEF' && chefSuggestions.length > 0) {
    return (
      <RecipeGrid
        recipes={chefSuggestions}
        userId={userId}
        onCancel={handleReset}
      />
    );
  }

  // CAS 3: FORMULARI INPUT (Amb layout fix)
  return (
    <div className="space-y-8">

      {/* Selector de Mode */}
      <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800 relative">
        {/* Fons animat que es mou (Opcional per més qualitat visual, aquí fem botons simples) */}
        <button
          onClick={() => setMode('FATE')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'FATE' ? 'bg-zinc-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
          🎲 Destí
        </button>
        <button
          onClick={() => setMode('CHEF')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'CHEF' ? 'bg-purple-900/50 text-purple-200 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
          👨‍🍳 Xef (Smart)
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-200 transition-all duration-300">
          {mode === 'FATE' ? t.decision.title_food : "Menú Intel·ligent"}
        </h2>

        {/* ✨ FIX: Contenidor d'alçada fixa per evitar salts quan canvia el text */}
        <div className="h-6 mt-1 flex items-center justify-center overflow-hidden">
          <p
            key={mode} // La clau força l'animació quan canvia el mode
            className="text-xs text-gray-500 animate-in fade-in slide-in-from-bottom-1 duration-300"
          >
            {mode === 'FATE' ? "Deixa que l'atzar decideixi per tu." : "4 propostes basades en el teu inventari."}
          </p>
        </div>
      </div>

      <EnergyTimeSliders
        energy={energy}
        time={time}
        onEnergyChange={setEnergy}
        onTimeChange={setTime}
      />

      {error && (
        <div className="bg-red-900/30 text-red-400 p-3 rounded-xl text-center text-sm font-bold animate-pulse border border-red-900/50">
          🚫 {error}
        </div>
      )}

      {/* Botó d'Acció Principal */}
      <div className="pt-2">
        <Button
          onClick={mode === 'FATE' ? handleFateDecide : handleChefSuggest}
          isLoading={isPending}
          className={`w-full text-xl py-4 border-b-4 active:border-b-0 active:translate-y-1 text-white shadow-lg transition-all duration-300
            ${mode === 'FATE'
              ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800 shadow-emerald-900/20'
              : 'bg-purple-600 hover:bg-purple-500 border-purple-800 shadow-purple-900/20'
            }`}
          variant="primary"
        >
          {/* ✨ FIX: Span absolut per transició suau de text (Opcional, text simple també val) */}
          {mode === 'FATE' ? t.decision.button_decide : "🔍 Buscar Receptes"}
        </Button>

        {/* ✨ FIX: Contenidor d'alçada fixa pel footer */}
        <div className="h-4 mt-3 flex items-center justify-center">
          {mode === 'FATE' ? (
            <p className="text-[10px] text-gray-500 font-medium animate-in fade-in">
              {t.decision.disclaimer}
            </p>
          ) : (
            <p className="text-[10px] text-purple-400/60 font-medium animate-in fade-in">
              Utilitza IA avançada
            </p>
          )}
        </div>
      </div>
    </div>
  );
}