'use client';

import { RecipeProps } from '@/core/domain/entities/Recipe';
import { DecisionResultCard } from '@/components/decision/DecisionResultCard';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  choice: string;
  reason: string;
  generatedRecipe?: RecipeProps;
  isLoadingRecipe: boolean;
  onGenerateRecipe: () => void;
  onCookSuccess: () => void;
  onReset: () => void;
  userId: string;
}

export function FateResult({ 
  choice, reason, generatedRecipe, isLoadingRecipe, 
  onGenerateRecipe, onCookSuccess, onReset, userId 
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-6 animate-in zoom-in-50 duration-500 ease-out w-full">
      
      <DecisionResultCard 
        resultText={choice}
        recipe={generatedRecipe}
        userId={userId}
        onCookSuccess={onCookSuccess}
      />

      {/* Raó original (només si no tenim recepta per no embrutar) */}
      {!generatedRecipe && (
        <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-xl relative max-w-md w-full text-center">
          <p className="text-gray-300 italic text-sm">"{reason}"</p>
        </div>
      )}

      {/* Botó Màgic: Només si no tenim recepta */}
      {!generatedRecipe && !isLoadingRecipe && (
        <button 
          onClick={onGenerateRecipe}
          className="group relative inline-flex items-center justify-center px-6 py-2 font-bold text-white transition-all duration-200 bg-purple-600/20 border border-purple-500 rounded-full hover:bg-purple-600 hover:border-purple-600 active:scale-95"
        >
          <span className="mr-2">🪄</span> Com ho cuino amb el que tinc?
        </button>
      )}

      {/* Loader */}
      {isLoadingRecipe && (
        <div className="text-purple-400 text-sm animate-pulse flex items-center gap-2">
          <span>👨‍🍳</span> Mirant el rebost...
        </div>
      )}

      <div className="pt-4 w-full max-w-md">
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full border-zinc-700 hover:border-zinc-500 text-gray-400 hover:text-white bg-transparent hover:bg-zinc-800"
        >
          {t.decision.roll_again}
        </Button>
      </div>
    </div>
  );
}