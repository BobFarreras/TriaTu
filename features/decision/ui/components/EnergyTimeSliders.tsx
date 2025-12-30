'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

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

  const getEnergyLabel = (level: number) => {
    if (level <= 3) return t.decision.energy_levels.low;
    if (level <= 7) return t.decision.energy_levels.mid;
    return t.decision.energy_levels.high;
  };

  return (
    <div className="space-y-4">
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
            onChange={(e) => onTimeChange(Number(e.target.value))}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-zinc-700 bg-black/30 text-white font-bold text-lg focus:outline-none focus:ring-4 focus:ring-blue-900/50 focus:border-blue-500 transition-all placeholder-zinc-600"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">min</span>
        </div>
      </div>
    </div>
  );
}