'use client'

import { useState, useTransition } from 'react';
import { makeIndividualDecisionAction } from '@/app/actions/decision-actions';
// 👇 1. IMPORTS NOUS PER LA RECEPTA
import { generateRecipeFromDecisionAction } from '@/app/actions/decision-cooking';
import { DecisionResultCard } from '@/components/decision/DecisionResultCard';
import { RecipeProps } from '@/core/domain/entities/Recipe';

import { Button } from '@/components/ui/Button';
import { DecisionType } from '@/core/domain/entities/Decision';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { toast } from 'sonner';

const getEnergyEmoji = (level: number) => {
  if (level <= 3) return '😴';
  if (level <= 7) return '🙂';
  return '🔥';
};

export function IndividualDecisionForm({ userId }: { userId: string }) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ choice: string, reason: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 👇 2. ESTATS NOUS PER GESTIONAR LA RECEPTA
  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeProps | undefined>(undefined);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [hasCooked, setHasCooked] = useState(false);

  const [energy, setEnergy] = useState(5);
  const [time, setTime] = useState(30);

  const sliderPercentage = (energy / 10) * 100;

  const getEnergyLabel = (level: number) => {
    if (level <= 3) return t.decision.energy_levels.low;
    if (level <= 7) return t.decision.energy_levels.mid;
    return t.decision.energy_levels.high;
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    // Resetegem estats de recepta quan fem una nova tirada
    setGeneratedRecipe(undefined);
    setHasCooked(false);

    startTransition(async () => {
      await new Promise(r => setTimeout(r, 800));

      const response = await makeIndividualDecisionAction({
        userId,
        type: DecisionType.FOOD,
        energyLevel: Number(energy),
        timeMinutes: Number(time)
      });

      if (response.success && response.data) {
        setResult({
          choice: response.data.choice!,
          reason: response.data.reason!
        });
      } else {
        setError(response.error || t.common.error);
      }
    });
  };

  // 👇 3. FUNCIÓ PER GENERAR LA RECEPTA (Cridada des del botó màgic)
  const handleGenerateRecipe = async () => {
    if (!result) return;
    
    setIsLoadingRecipe(true);
    const response = await generateRecipeFromDecisionAction(userId, result.choice);
    
    if (response.success && response.recipe) {
      setGeneratedRecipe(response.recipe);
      toast.success("Recepta trobada al teu inventari!");
    } else {
      toast.error(response.error || "No s'ha pogut generar la recepta.");
    }
    setIsLoadingRecipe(false);
  };

  const handleReset = () => {
      setResult(null);
      setGeneratedRecipe(undefined);
      setHasCooked(false);
  };

  // --- RESULTAT (Sempre Fosc) ---
  if (result) {
    
    // Si ja s'ha cuinat, mostrem un estat final net
    if (hasCooked) {
        return (
            <div className="text-center p-8 animate-in zoom-in bg-slate-900/50 rounded-3xl border border-slate-800">
                <div className="text-6xl mb-4">🍽️</div>
                <h2 className="text-3xl font-black text-white mb-2">Bon Profit!</h2>
                <p className="text-slate-400 mb-6">L'inventari s'ha actualitzat correctament.</p>
                <Button onClick={handleReset} variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                    Fer una altra decisió
                </Button>
            </div>
        );
    }

    return (
      <div className="flex flex-col items-center gap-6 animate-in zoom-in-50 duration-500 ease-out w-full">
        
        {/* 👇 4. INTEGRACIÓ DEL COMPONENT DE DECISIÓ */}
        {/* Aquest component ja gestiona el botó "Cuinar" internament quan li passem la 'recipe' */}
        <DecisionResultCard 
            resultText={result.choice}
            recipe={generatedRecipe}
            userId={userId}
            onCookSuccess={() => setHasCooked(true)}
        />

        {/* Mostrem la raó original de la IA (si no tenim recepta encara, o sota la card) */}
        {!generatedRecipe && (
             <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-xl relative max-w-md w-full text-center">
                <p className="text-gray-300 italic text-sm">"{result.reason}"</p>
            </div>
        )}

        {/* 👇 5. BOTÓ MÀGIC: Només apareix si tenim resultat però no recepta */}
        {!generatedRecipe && !isLoadingRecipe && (
             <button 
                onClick={handleGenerateRecipe}
                className="group relative inline-flex items-center justify-center px-6 py-2 font-bold text-white transition-all duration-200 bg-purple-600/20 border border-purple-500 rounded-full hover:bg-purple-600 hover:border-purple-600 active:scale-95"
             >
                <span className="mr-2">🪄</span> Com ho cuino amb el que tinc?
             </button>
        )}

        {/* Loader de recepta */}
        {isLoadingRecipe && (
            <div className="text-purple-400 text-sm animate-pulse flex items-center gap-2">
                <span>👨‍🍳</span> Mirant el rebost...
            </div>
        )}

        <div className="pt-4 w-full max-w-md">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full border-zinc-700 hover:border-zinc-500 text-gray-400 hover:text-white bg-transparent hover:bg-zinc-800"
          >
            {t.decision.roll_again}
          </Button>
        </div>
      </div>
    );
  }

  // --- FORMULARI (ES MANTÉ IGUAL QUE EL TEU CODI ORIGINAL) ---
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-200">
          {t.decision.title_food}
        </h2>
      </div>

      {/* ENERGIA */}
      <div className="space-y-3 bg-black/20 p-4 rounded-2xl border-2 border-dashed border-zinc-700">
        <div className="flex justify-between items-end">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            {t.decision.energy_label}
          </label>
          <span className="text-3xl filter drop-shadow-sm transition-all duration-300 transform hover:scale-125 cursor-help" title={getEnergyLabel(energy)}>
            {getEnergyEmoji(energy)}
          </span>
        </div>

        <div className="relative w-full h-8 flex items-center">
          <div className="absolute w-full h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-600">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-red-600 transition-all duration-150 ease-out"
              style={{ width: `${sliderPercentage}%` }}
            />
          </div>

          <input
            type="range"
            min="0" max="10" step="1"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="absolute w-full h-8 opacity-0 cursor-pointer z-10"
          />

          <div
            className="absolute h-6 w-6 bg-zinc-900 border-2 border-white rounded-full shadow-md pointer-events-none transition-all duration-150 ease-out"
            style={{ left: `calc(${sliderPercentage}% - 12px)` }}
          />
        </div>

        <p className="text-xs text-center font-bold text-gray-400">
          {getEnergyLabel(energy)}
        </p>
      </div>

      {/* TEMPS */}
      <div className="space-y-1">
        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
          {t.decision.time_label}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">⏱️</span>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-zinc-700 bg-black/30 text-white font-bold text-lg focus:outline-none focus:ring-4 focus:ring-blue-900/50 focus:border-blue-500 transition-all placeholder-zinc-600"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">min</span>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-900/30 text-red-400 p-3 rounded-xl text-center text-sm font-bold animate-pulse border border-red-900/50">
          🚫 {error}
        </div>
      )}

      {/* ACTION BUTTON */}
      <div className="pt-2">
        <Button
          onClick={handleSubmit}
          isLoading={isPending}
          className="w-full text-xl py-4 bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 text-white shadow-lg shadow-emerald-900/20"
          variant="primary"
        >
          {t.decision.button_decide}
        </Button>
        <p className="text-[10px] text-center text-gray-500 mt-3 font-medium">
          {t.decision.disclaimer}
        </p>
      </div>
    </div>
  );
}