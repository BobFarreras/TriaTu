'use client';

import { useState } from 'react';
import { generateRecipeFromDecisionAction } from '@/app/actions/decision-cooking';
import { DecisionResultCard } from '@/components/decision/DecisionResultCard';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { toast } from 'sonner';

interface RoomOutcomeProps {
  decisionText: string; // Ex: "Truita de Patates"
  userId: string;       
  isHost: boolean;     
}

export function RoomOutcome({ decisionText, userId, isHost }: RoomOutcomeProps) {
  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeProps | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCooked, setHasCooked] = useState(false);

  // Botó màgic: "Com ho cuino amb el que tinc?"
  const handleLoadRecipe = async () => {
    setIsLoading(true);
    // Cridem a la Server Action nova (Fase 6)
    const result = await generateRecipeFromDecisionAction(userId, decisionText);
    
    if (result.success && result.recipe) {
      setGeneratedRecipe(result.recipe);
      toast.success("Recepta generada amb el teu inventari!");
    } else {
      toast.error(result.error || "No s'ha pogut generar la recepta.");
    }
    setIsLoading(false);
  };

  // ESTAT FINAL: Tot fet
  if (hasCooked) {
    return (
      <div className="text-center p-10 animate-in zoom-in duration-500 bg-slate-900/50 rounded-3xl border border-slate-800">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-3xl font-black text-white mb-2">Bon Profit!</h2>
        <p className="text-slate-400 mb-6">L'inventari s'ha actualitzat correctament.</p>
        <a href="/dashboard" className="text-purple-400 hover:text-purple-300 font-bold underline underline-offset-4">
          Tornar al Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto py-10">
      
      {/* 1. Mostrem la targeta amb el resultat */}
      <DecisionResultCard 
        resultText={decisionText}
        recipe={generatedRecipe}
        userId={userId}
        onCookSuccess={() => setHasCooked(true)}
      />

      {/* 2. Botó per cridar a la IA (Només si encara no tenim recepta i som el Host o l'usuari principal) */}
      {!generatedRecipe && !isLoading && (
        <div className="text-center space-y-3 animate-in slide-in-from-bottom-4 delay-300 fill-mode-forwards opacity-0" style={{ animationDelay: '500ms' }}>
          <p className="text-sm text-slate-500 font-medium">
            Vols saber si tens ingredients per fer-ho?
          </p>
          <button 
            onClick={handleLoadRecipe}
            className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-purple-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-purple-500 active:scale-95"
          >
             <span className="mr-2 text-xl">🪄</span> Generar Recepta Intel·ligent
             <div className="absolute -inset-3 rounded-full bg-purple-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
          </button>
        </div>
      )}

      {/* 3. Loading State (Skeleton o Spinner divertit) */}
      {isLoading && (
        <div className="flex flex-col items-center gap-3 text-purple-400 animate-pulse mt-4">
          <div className="text-4xl animate-bounce">👨‍🍳</div>
          <span className="font-mono text-xs uppercase tracking-widest">El xef digital està revisant el teu rebost...</span>
        </div>
      )}
    </div>
  );
}