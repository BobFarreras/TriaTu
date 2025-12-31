'use client';

import { useState } from 'react';
import { CountdownTimer } from './CountdownTimer';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

interface IngredientSimple {
  name: string;
}

interface Props {
  steps: string[];
  ingredients: IngredientSimple[]; 
}

// Helper d'emojis (Mantingues la teva lògica o importa-la)
const getIngredientEmoji = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('tomaquet') || n.includes('tomàquet')) return '🍅';
    if (n.includes('ceba')) return '🧅';
    if (n.includes('all')) return '🧄';
    if (n.includes('oli')) return '🫒';
    if (n.includes('sal')) return '🧂';
    if (n.includes('ou')) return '🥚';
    if (n.includes('patata')) return '🥔';
    if (n.includes('pollastre')) return '🍗';
    if (n.includes('vedella') || n.includes('carn')) return '🥩';
    if (n.includes('formatge')) return '🧀';
    if (n.includes('llet') || n.includes('nata')) return '🥛';
    if (n.includes('arròs')) return '🍚';
    if (n.includes('pasta') || n.includes('macarr')) return '🍝';
    if (n.includes('xocolata')) return '🍫';
    if (n.includes('sucre')) return '🍬';
    return '🥘';
};

export function StepsPanel({ steps, ingredients }: Props) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const next = new Set(completedSteps);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setCompletedSteps(next);
  };

  // ✨ MÀGIA CORREGIDA: Parsejar Tokens [Ingredient] i ⏰ Temps
  const renderEnrichedText = (text: string) => {
    // 1. Regex Mestra: Captura [Qualsevol cosa] O ⏰ seguit de temps
    const masterRegex = /(\[.*?\]|⏰\s*\d+\s*(?:min|minuts|minutes|s|segons))/gi;
    
    const parts = text.split(masterRegex);

    return parts.map((part, index) => {
        // CAS A: És un ingredient [Patata]
        if (part.startsWith('[') && part.endsWith(']')) {
            const rawName = part.slice(1, -1); // Treiem els claudàtors [ ]
            const emoji = getIngredientEmoji(rawName); // Busquem l'emoji pel nom
            
            return (
                <span 
                    key={`ing-${index}`} 
                    className="inline-flex items-center gap-1.5 mx-1 px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-300 font-bold text-sm border border-purple-500/20 align-middle shadow-sm hover:bg-purple-500/20 transition-colors cursor-default select-none"
                >
                    <span className="text-base filter drop-shadow-sm">{emoji}</span>
                    <span className="capitalize">{rawName}</span>
                </span>
            );
        }

        // CAS B: És un temps ⏰ 10 min
        if (part.includes('⏰')) {
            // Extraiem només els números per passar-li al component
            const timeMatch = part.match(/(\d+)/);
            const minutes = timeMatch ? parseInt(timeMatch[0]) : 0;
            return <CountdownTimer key={`timer-${index}`} minutes={minutes} />;
        }

        // CAS C: Text normal
        return <span key={`text-${index}`}>{part}</span>;
    });
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-end mb-8 px-2">
        <h3 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="text-3xl">👨‍🍳</span> Instruccions
        </h3>
        <span className="text-xs font-bold bg-slate-900 text-slate-400 px-3 py-1 rounded-full border border-slate-800">
            {completedSteps.size} de {steps.length} passos
        </span>
      </div>

      <div className="relative space-y-6 pb-12">
         {/* Línia connectora de fons */}
         <div className="absolute left-[19px] top-4 bottom-10 w-0.5 bg-slate-800/50 -z-10" />

         {steps.length > 0 ? steps.map((step, i) => {
             const isDone = completedSteps.has(i);
             return (
                 <motion.div 
                    key={i}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => toggleStep(i)}
                    className={`
                        relative flex gap-5 cursor-pointer group select-none
                        ${isDone ? 'opacity-50 grayscale' : 'opacity-100'}
                    `}
                 >
                    {/* BOLETA NÚMERO */}
                    <div className={`
                        w-10 h-10 rounded-full border-4 flex items-center justify-center text-sm font-bold shadow-xl transition-all duration-300 z-10 shrink-0
                        ${isDone 
                            ? 'bg-emerald-500 border-slate-950 text-white scale-90' 
                            : 'bg-slate-900 border-slate-950 text-slate-400 group-hover:border-purple-500 group-hover:text-white'
                        }
                    `}>
                        {isDone ? <CheckCircle2 size={20} /> : i + 1}
                    </div>

                    {/* TEXT CARD */}
                    <div className={`
                        flex-1 p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
                        ${isDone 
                            ? 'bg-transparent border-transparent text-slate-600' 
                            : 'bg-slate-900/60 border-slate-800/50 text-slate-200 shadow-lg backdrop-blur-sm group-hover:border-purple-500/30 group-hover:bg-slate-900/80'
                        }
                    `}>
                        {/* Decoració subtil quan fas hover */}
                        {!isDone && <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />}

                        <p className={`leading-relaxed text-lg flex flex-wrap items-center gap-y-1 ${isDone ? 'line-through decoration-slate-700' : ''}`}>
                            {renderEnrichedText(step)}
                        </p>
                    </div>
                 </motion.div>
             )
         }) : (
             <div className="text-center py-10 opacity-50 border-2 border-dashed border-slate-800 rounded-3xl">
                 <p>Sense passos detallats.</p>
             </div>
         )}
      </div>
    </div>
  );
}