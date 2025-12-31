'use client'

import { motion } from 'framer-motion';
import { WizardData } from './RecipeWizard';
import { Minus, Plus} from 'lucide-react';

interface Props {
  data: WizardData;
  update: (d: WizardData) => void;
  onNext: () => void;
}

export function StepBasics({ data, update, onNext }: Props) {
  
  const adjustTime = (amount: number) => {
    update({ ...data, prepTimeMinutes: Math.max(5, data.prepTimeMinutes + amount) });
  };

  return (
    <motion.div 
        initial={{ x: 20, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        exit={{ x: -20, opacity: 0 }}
        className="space-y-8"
    >
      <div className="text-center">
        <span className="text-6xl animate-bounce inline-block">📝</span>
        <h2 className="text-2xl font-bold mt-4">Comencem pel principi</h2>
      </div>

      {/* INPUT NOM */}
      <div className="space-y-2">
        <label className="text-xs uppercase font-bold text-slate-500 ml-2">Nom del Plat</label>
        <input 
          autoFocus
          value={data.name}
          onChange={(e) => update({ ...data, name: e.target.value })}
          placeholder="Ex: Truita de patates..."
          className="w-full bg-slate-900 border-2 border-slate-800 focus:border-purple-500 rounded-2xl p-4 text-xl font-bold text-white outline-none placeholder:text-slate-600 transition-all"
        />
      </div>

      {/* CONTROL DE TEMPS MILLORAT */}
      <div className="space-y-2">
        <label className="text-xs uppercase font-bold text-slate-500 ml-2">Temps de preparació</label>
        
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <button onClick={() => adjustTime(-5)} className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-300 transition-colors">
                <Minus />
            </button>

            <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-white font-mono flex items-center gap-2">
                    {data.prepTimeMinutes}<span className="text-base text-slate-500 font-sans">min</span>
                </span>
            </div>

            <button onClick={() => adjustTime(5)} className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-300 transition-colors">
                <Plus />
            </button>
        </div>

        {/* Presets ràpids */}
        <div className="flex justify-center gap-2 mt-2">
            {[15, 30, 45, 60].map(t => (
                <button 
                    key={t}
                    onClick={() => update({ ...data, prepTimeMinutes: t })}
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${data.prepTimeMinutes === t ? 'bg-purple-500 border-purple-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                >
                    {t}m
                </button>
            ))}
        </div>
      </div>

      <button 
        onClick={onNext}
        disabled={!data.name}
        className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-white/10"
      >
        Següent 👉
      </button>
    </motion.div>
  );
}