'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, AlertCircle } from 'lucide-react';
import { EditorData } from './types';

interface Props {
  data: EditorData;
  update: (d: EditorData) => void;
  // ✅ Nova prop
  labels: {
    title: string;
    placeholder: string;
    quick_insert: string;
    timer: string;
    add_timer: string;
    warning_ingredients: string;
    add_btn: string;
    empty_state: string;
  }
}

export function StepsBuilder({ data, update, labels }: Props) {
  const [currentStep, setCurrentStep] = useState('');

  const insertToken = (text: string) => {
    setCurrentStep(prev => `${prev} ${text} `);
  };

  const addStep = () => {
    if (!currentStep.trim()) return;
    update({ ...data, steps: [...data.steps, currentStep] });
    setCurrentStep('');
  };

  const removeStep = (index: number) => {
    update({ ...data, steps: data.steps.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative h-full flex flex-col">
       <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
       
       <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">👨‍🍳</span> {labels.title}
      </h2>

      {/* EDITOR */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 focus-within:border-purple-500 transition-colors shadow-inner flex flex-col gap-3">
         
         <textarea 
           value={currentStep}
           onChange={(e) => setCurrentStep(e.target.value)}
           placeholder={labels.placeholder}
           className="w-full bg-transparent text-white outline-none resize-none h-24 placeholder:text-slate-600 leading-relaxed"
           onKeyDown={(e) => {
               if(e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   addStep();
               }
           }}
         />

         {/* BARRA EINES */}
         <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
             <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500">
                <span>{labels.quick_insert}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {labels.timer}</span>
             </div>
             
             <div className="flex flex-wrap gap-2">
                <button 
                   onClick={() => insertToken("⏰ 5 min")}
                   className="bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 px-2 py-1 rounded-md text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                >
                   {labels.add_timer}
                </button>

                {data.ingredients.map((ing, i) => (
                    <button
                        key={i}
                        onClick={() => insertToken(`[${ing.name}]`)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-1 rounded-md text-xs transition-all active:scale-95 flex items-center gap-1"
                    >
                        + {ing.name}
                    </button>
                ))}
                
                {data.ingredients.length === 0 && (
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                        <AlertCircle size={12} /> {labels.warning_ingredients}
                    </span>
                )}
             </div>
         </div>

         <div className="flex justify-end mt-2">
             <button 
                onClick={addStep}
                disabled={!currentStep.trim()}
                className="bg-white text-black font-bold px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
             >
                {labels.add_btn}
             </button>
         </div>
      </div>

      {/* TIMELINE */}
      <div className="mt-6 space-y-4 flex-1 overflow-y-auto">
         <AnimatePresence>
            {data.steps.map((step, i) => (
                <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    key={i}
                    className="flex gap-4 group"
                >
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-900/30 z-10">
                            {i + 1}
                        </div>
                        {i !== data.steps.length - 1 && (
                            <div className="w-0.5 flex-1 bg-slate-800 my-1 group-hover:bg-purple-500/30 transition-colors" />
                        )}
                    </div>
                    
                    <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl rounded-tl-none relative group-hover:border-slate-700 transition-colors">
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {step.split(/(\[.*?\]|⏰.*?min)/g).map((part, idx) => {
                                if (part.startsWith('[') && part.endsWith(']')) {
                                    return <span key={idx} className="font-bold text-purple-400 bg-purple-500/10 px-1 rounded">{part.slice(1, -1)}</span>
                                }
                                if (part.includes('⏰')) {
                                    return <span key={idx} className="font-bold text-yellow-400 bg-yellow-500/10 px-1 rounded">{part}</span>
                                }
                                return part;
                            })}
                        </p>
                        <button 
                            onClick={() => removeStep(i)}
                            className="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            ))}
         </AnimatePresence>
         
         {data.steps.length === 0 && (
             <div className="flex flex-col items-center justify-center h-32 opacity-30">
                 <div className="w-1 bg-slate-700 h-10 mb-2"></div>
                 <p className="text-sm">{labels.empty_state}</p>
             </div>
         )}
      </div>
    </div>
  );
}