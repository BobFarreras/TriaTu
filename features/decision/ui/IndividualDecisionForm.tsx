// =================== FILE: features/decision/ui/IndividualDecisionForm.tsx ===================

'use client'

import { useState, useTransition} from 'react';
import { makeIndividualDecisionAction } from '@/app/actions/decision-actions';
import { Button } from '@/components/ui/Button';
import { DecisionType } from '@/core/domain/entities/Decision';

// Funció auxiliar per obtenir l'emoji segons l'energia
const getEnergyEmoji = (level: number) => {
  if (level <= 3) return '😴'; // Cansat
  if (level <= 7) return '🙂'; // Normal
  return '🔥'; // A tope
};

const getEnergyLabel = (level: number) => {
  if (level <= 3) return 'Mode peresa';
  if (level <= 7) return 'Ni fu ni fa';
  return 'A menjar-se el món!';
};

export function IndividualDecisionForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ choice: string, reason: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estat local del formulari
  const [energy, setEnergy] = useState(5);
  const [time, setTime] = useState(30);
  
  // Efecte visual pel slider (per pintar el background progressivament)
  // Això és un petit truc visual
  const sliderPercentage = (energy / 10) * 100;

  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    startTransition(async () => {
      // Simulem un petit retard extra per donar suspens "dramàtic" (opcional)
      await new Promise(r => setTimeout(r, 800));

      const response = await makeIndividualDecisionAction({
        userId,
        type: DecisionType.FOOD, // Hardcoded per MVP
        energyLevel: Number(energy),
        timeMinutes: Number(time)
      });

      if (response.success && response.data) {
        setResult({
          choice: response.data.choice!,
          reason: response.data.reason!
        });
      } else {
        setError(response.error || 'Something went wrong');
      }
    });
  };

  // --- RENDERITZAT DEL RESULTAT (PANTALLA DE VICTÒRIA) ---
  if (result) {
    return (
      <div className="text-center space-y-6 animate-in zoom-in-50 duration-500 ease-out">
        <div className="inline-block animate-bounce text-6xl mb-2 drop-shadow-md">
          🎉
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            El destí ha parlat
          </h3>
          <h2 className="text-4xl font-black text-gray-800 dark:text-white leading-tight">
            {result.choice}
          </h2>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-700 p-4 rounded-2xl relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 text-xs font-bold px-2 py-1 rounded-full border border-yellow-300">
            Per què?
          </span>
          <p className="text-gray-700 dark:text-gray-300 italic font-medium mt-1">
            "{result.reason}"
          </p>
        </div>
        
        <div className="pt-4">
          <Button 
            variant="outline" 
            onClick={() => setResult(null)}
            className="w-full border-gray-300 hover:border-gray-400 text-gray-500"
          >
            🔄 Tornar a tirar
          </Button>
        </div>
      </div>
    );
  }

  // --- RENDERITZAT DEL FORMULARI (HUD DE JOC) ---
  return (
    <div className="space-y-8">
      {/* TÍTOL INTERN (Opcional, ja en tenim a fora, però aquest és funcional) */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
          Què mengem avui? 🍽️
        </h2>
      </div>
      
      {/* CONTROL LLISCANT D'ENERGIA */}
      <div className="space-y-3 bg-gray-50 dark:bg-black/20 p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-end">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Nivell d'Energia
          </label>
          <span className="text-3xl filter drop-shadow-sm transition-all duration-300 transform hover:scale-125 cursor-help" title={getEnergyLabel(energy)}>
            {getEnergyEmoji(energy)}
          </span>
        </div>
        
        <div className="relative w-full h-8 flex items-center">
          {/* Custom Track Background */}
          <div className="absolute w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
             <div 
               className="h-full bg-linear-to-r from-yellow-400 to-red-500 transition-all duration-150 ease-out"
               style={{ width: `${sliderPercentage}%` }}
             />
          </div>
          
          {/* L'Input real (invisible però funcional a sobre) */}
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="1"
            value={energy} 
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="absolute w-full h-8 opacity-0 cursor-pointer z-10"
          />
          
          {/* Thumb visual (la boleta que es mou) */}
          <div 
            className="absolute h-6 w-6 bg-white border-4 border-gray-800 rounded-full shadow-md pointer-events-none transition-all duration-150 ease-out"
            style={{ left: `calc(${sliderPercentage}% - 12px)` }}
          />
        </div>
        
        <p className="text-xs text-center font-bold text-gray-400">
          {getEnergyLabel(energy)}
        </p>
      </div>

      {/* INPUT DE TEMPS */}
      <div className="space-y-1">
        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
          Temps disponible
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">⏱️</span>
          <input 
            type="number" 
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">min</span>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-xl text-center text-sm font-bold animate-pulse">
          🚫 {error}
        </div>
      )}

      {/* ACTION BUTTON */}
      <div className="pt-2">
        <Button 
          onClick={handleSubmit} 
          isLoading={isPending}
          // Canviem a un color EMERALD (més fosc/elegant) i afegim l'emoji 🎲
          className="w-full text-xl py-4 bg-emerald-500 hover:bg-emerald-400 border-emerald-700 text-white shadow-emerald-200 dark:shadow-none"
          variant="primary" // Usem la base, però sobreescrivim classes amb className
        >
          🎲 Decideix per mi!
        </Button>
        <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
          *Sense devolucions, el destí és definitiu.
        </p>
      </div>
    </div>
  );
}