'use client'

import { useState, useTransition } from 'react';
import { makeIndividualDecisionAction } from '@/app/actions/decision-actions';
import { Button } from '@/components/ui/Button';
import { DecisionType } from '@/core/domain/entities/Decision';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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

  // --- RESULTAT (Sempre Fosc) ---
  if (result) {
    const reasonKey = result.reason as keyof typeof t.decision.reasons;
    const translatedReason = t.decision.reasons[reasonKey] || result.reason;

    return (
      <div className="text-center space-y-6 animate-in zoom-in-50 duration-500 ease-out">
        <div className="inline-block animate-bounce text-6xl mb-2 drop-shadow-md">
          🎉
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {t.decision.fate_spoken}
          </h3>
          {/* Títol Blanc (Forçat) */}
          <h2 className="text-4xl font-black text-white leading-tight">
            {result.choice}
          </h2>
        </div>

        {/* Caixa de Resultat: Fosc + Groc subtil */}
        <div className="bg-yellow-900/20 border-2 border-yellow-700 p-4 rounded-2xl relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-900 text-yellow-100 text-xs font-bold px-2 py-1 rounded-full border border-yellow-700">
            {t.decision.why}
          </span>
          <p className="text-gray-300 italic font-medium mt-1">
            "{translatedReason}"
          </p>
        </div>

        <div className="pt-4">
          {/* Botó secundari fosc */}
          <Button
            variant="outline"
            onClick={() => setResult(null)}
            className="w-full border-zinc-700 hover:border-zinc-500 text-gray-400 hover:text-white bg-transparent hover:bg-zinc-800"
          >
            {t.decision.roll_again}
          </Button>
        </div>
      </div>
    );
  }

  // --- FORMULARI (Sempre Fosc) ---
  return (
    <div className="space-y-8">
      <div className="text-center">
        {/* Títol Blanc/Gris clar */}
        <h2 className="text-xl font-bold text-gray-200">
          {t.decision.title_food}
        </h2>
      </div>

      {/* ENERGIA: Fons fosc semitransparent */}
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
          {/* Barra de fons fosca */}
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

          {/* Tirador fosc amb vora clara */}
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
            // Input fosc (bg-black/30) amb text blanc
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