'use client';

import { useState } from 'react';
import { CountdownTimer } from './CountdownTimer';

export function StepsPanel({ steps }: { steps: string[] }) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const next = new Set(completedSteps);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setCompletedSteps(next);
  };

  // Funció per detectar temps al text i injectar el component Timer
  const renderStepWithTimer = (text: string) => {
    // Regex per buscar "X min", "X minuts", "X minutes"
    const timeRegex = /(\d+)\s*(?:min|minuts|minutes)/i;
    const match = text.match(timeRegex);

    if (match) {
        const minutes = parseInt(match[1]);
        const parts = text.split(match[0]); // Partim el text on hi ha el temps
        
        return (
            <span>
                {parts[0]}
                <CountdownTimer minutes={minutes} />
                {parts[1]}
            </span>
        );
    }
    return text;
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/30 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white flex items-center gap-2">
            <span>👨‍🍳</span> Instruccions
        </h3>
        <span className="text-xs text-slate-500 font-medium">
            {completedSteps.size}/{steps.length} Fets
        </span>
      </div>

      <div className="space-y-4 relative">
          {/* Línia Vertical */}
          <div className="absolute left-3.75 top-2 bottom-2 w-0.5 bg-slate-800 z-0"></div>
          
          {steps.length > 0 ? steps.map((step, i) => {
              const isDone = completedSteps.has(i);
              
              return (
                <div 
                    key={i} 
                    onClick={() => toggleStep(i)}
                    className={`
                        relative z-10 flex gap-4 group cursor-pointer transition-all duration-300
                        ${isDone ? 'opacity-50 grayscale' : 'opacity-100'}
                    `}
                >
                    {/* Número Checkbox */}
                    <div className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all shadow-lg shrink-0
                        ${isDone 
                            ? 'bg-emerald-600 border-emerald-500 text-white scale-90' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:border-purple-500 group-hover:text-white'
                        }
                    `}>
                        {isDone ? '✓' : i + 1}
                    </div>

                    {/* Text del Pas */}
                    <div className={`
                        flex-1 p-3 rounded-xl border transition-all
                        ${isDone 
                            ? 'bg-transparent border-transparent text-slate-500 line-through decoration-slate-600' 
                            : 'bg-slate-950/50 border-slate-800/50 text-slate-300 group-hover:bg-slate-900 group-hover:border-purple-500/30'
                        }
                    `}>
                        <p className="leading-relaxed text-sm md:text-base">
                            {renderStepWithTimer(step)}
                        </p>
                    </div>
                </div>
              );
          }) : (
              <p className="text-slate-500 italic">Sense passos detallats.</p>
          )}
      </div>
    </div>
  );
}