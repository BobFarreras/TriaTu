'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Minus, Plus, Clock } from 'lucide-react';

interface Props {
  energy: number;
  time: number;
  onEnergyChange: (val: number) => void;
  onTimeChange: (val: number) => void;
}

const getEnergyEmoji = (level: number) => {
  if (level <= 3) return '😴';
  if (level <= 7) return '🙂';
  return '🔥';
};

export function EnergyTimeSliders({ energy, time, onEnergyChange, onTimeChange }: Props) {
  const { t } = useLanguage();
  const sliderPercentage = (energy / 10) * 100;

  // Lògica per incrementar/decrementar temps (de 5 en 5 minuts)
  const handleTimeChange = (amount: number) => {
    const newVal = time + amount;
    // Mínim 5 minuts, màxim el que vulguis (ex: 240 min)
    if (newVal >= 5) {
      onTimeChange(newVal);
    }
  };

  const getEnergyLabel = (level: number) => {
    if (level <= 3) return t.decision.energy_levels.low;
    if (level <= 7) return t.decision.energy_levels.mid;
    return t.decision.energy_levels.high;
  };

  return (
    <div className="space-y-4">
      
      {/* --- SECCIÓ ENERGIA (Mantiguda igual) --- */}
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
              className="h-full bg-linear-to-r from-yellow-500 to-red-600 transition-all duration-150 ease-out"
              style={{ width: `${sliderPercentage}%` }}
            />
          </div>

          <input
            type="range"
            min="0" max="10" step="1"
            value={energy}
            onChange={(e) => onEnergyChange(Number(e.target.value))}
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

      {/* --- SECCIÓ TEMPS (Renovada i Centrada) --- */}
      <div className="bg-black/20 p-4 rounded-2xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center gap-3">
        
        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
           <Clock className="w-4 h-4" /> {t.decision.time_label}
        </label>

        <div className="flex items-center gap-6">
            
            {/* Botó Menys */}
            <button 
                onClick={() => handleTimeChange(-5)}
                className="w-12 h-12 rounded-xl bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center text-white hover:bg-zinc-700 hover:border-zinc-500 active:scale-95 transition-all shadow-lg"
            >
                <Minus className="w-6 h-6" />
            </button>

            {/* Visualitzador Central */}
            <div className="flex flex-col items-center w-24">
                <span className="text-5xl font-black text-white leading-none tracking-tight">
                    {time}
                </span>
                <span className="text-xs font-bold text-zinc-500 uppercase">minuts</span>
            </div>

            {/* Botó Més */}
            <button 
                onClick={() => handleTimeChange(5)}
                className="w-12 h-12 rounded-xl bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center text-white hover:bg-zinc-700 hover:border-zinc-500 active:scale-95 transition-all shadow-lg"
            >
                <Plus className="w-6 h-6" />
            </button>

        </div>
      </div>

    </div>
  );
}