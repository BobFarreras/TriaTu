'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WizardData } from './RecipeWizard';
import { Plus, X } from 'lucide-react';

interface Props {
  data: WizardData;
  update: (d: WizardData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepInstructions({ data, update, onNext, onBack }: Props) {
  const [stepText, setStepText] = useState('');

  const addStep = () => {
    if (!stepText.trim()) return;
    update({ ...data, steps: [...data.steps, stepText] });
    setStepText('');
  };

  const removeStep = (index: number) => {
    update({ ...data, steps: data.steps.filter((_, i) => i !== index) });
  };

  return (
    <motion.div 
        initial={{ x: 20, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        exit={{ x: -20, opacity: 0 }}
        className="space-y-6"
    >
       <div className="text-center">
        <span className="text-6xl animate-bounce inline-block">🍳</span>
        <h2 className="text-2xl font-bold mt-4">Mans a l'obra!</h2>
      </div>

      <div className="flex gap-2">
        <textarea 
            value={stepText}
            onChange={(e) => setStepText(e.target.value)}
            placeholder="Descriu el pas (ex: Barreja els ous...)"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:border-purple-500 outline-none resize-none h-24"
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addStep();
                }
            }}
        />
        <button 
            onClick={addStep}
            disabled={!stepText.trim()}
            className="w-16 bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50"
        >
            <Plus />
        </button>
      </div>

      <div className="space-y-3">
        {data.steps.map((step, i) => (
            <motion.div 
                layout
                key={i} 
                className="flex gap-3 items-start bg-slate-800/30 p-4 rounded-xl border border-slate-800"
            >
                <span className="w-6 h-6 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                </span>
                <p className="text-slate-300 text-sm flex-1 leading-relaxed">{step}</p>
                <button onClick={() => removeStep(i)} className="text-slate-600 hover:text-red-400">
                    <X size={16} />
                </button>
            </motion.div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={onBack} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700">Enrere</button>
        <button 
            onClick={onNext} 
            disabled={data.steps.length === 0}
            className="flex-1 py-4 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 disabled:opacity-50"
        >
            Següent
        </button>
      </div>
    </motion.div>
  );
}