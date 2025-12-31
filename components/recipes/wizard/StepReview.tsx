'use client'

import { motion } from 'framer-motion';
import { WizardData } from './RecipeWizard';
import { Check, Clock, Utensils, ListOrdered, Sparkles } from 'lucide-react';

interface Props {
  data: WizardData;
  update: (d: WizardData) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const AVAILABLE_TAGS = [
  { id: 'vegan', label: 'Vegà', icon: '🌱' },
  { id: 'vegetarian', label: 'Vegetarià', icon: '🥗' },
  { id: 'gluten-free', label: 'Sense Gluten', icon: '🌾' },
  { id: 'dairy-free', label: 'Sense Lactosa', icon: '🥛' },
  { id: 'dessert', label: 'Postres', icon: '🍰' },
  { id: 'healthy', label: 'Saludable', icon: '💚' },
  { id: 'spicy', label: 'Picant', icon: '🌶️' },
  { id: 'quick', label: 'Ràpid', icon: '⚡' },
];

export function StepReview({ data, update, onBack, onSubmit, loading }: Props) {

  const toggleTag = (tagId: string) => {
    const currentTags = data.dietaryTags;
    if (currentTags.includes(tagId)) {
      update({ ...data, dietaryTags: currentTags.filter(t => t !== tagId) });
    } else {
      update({ ...data, dietaryTags: [...currentTags, tagId] });
    }
  };

  return (
    <motion.div 
        initial={{ x: 20, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        exit={{ x: -20, opacity: 0 }}
        className="space-y-6"
    >
       <div className="text-center">
        <span className="text-6xl animate-pulse inline-block">✨</span>
        <h2 className="text-2xl font-bold mt-4">Ja gairebé ho tenim!</h2>
        <p className="text-slate-400 text-sm">Revisa i posa les etiquetes finals.</p>
      </div>

      {/* 🧾 RESUM VISUAL (TARGETA PREVIEW) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        {/* Decoració de fons */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

        <h3 className="text-xl font-black text-white mb-4 z-10 relative">{data.name}</h3>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center gap-1 text-slate-300">
                <Clock size={16} className="text-purple-400" />
                <span className="font-bold">{data.prepTimeMinutes} min</span>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center gap-1 text-slate-300">
                <Utensils size={16} className="text-blue-400" />
                <span className="font-bold">{data.ingredients.length} Ing.</span>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center gap-1 text-slate-300">
                <ListOrdered size={16} className="text-pink-400" />
                <span className="font-bold">{data.steps.length} Passos</span>
            </div>
        </div>
      </div>

      {/* 🏷️ SELECTOR DE TAGS */}
      <div>
        <h4 className="text-sm font-bold text-slate-400 uppercase mb-3 ml-1">Etiquetes (Opcional)</h4>
        <div className="grid grid-cols-2 gap-3">
            {AVAILABLE_TAGS.map(tag => {
                const isSelected = data.dietaryTags.includes(tag.id);
                return (
                    <motion.button
                        key={tag.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTag(tag.id)}
                        className={`
                            relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200
                            ${isSelected 
                                ? 'bg-linear-to-r from-purple-600/20 to-pink-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600'
                            }
                        `}
                    >
                        <span className="text-xl">{tag.icon}</span>
                        <span className="font-bold text-sm flex-1">{tag.label}</span>
                        
                        {/* Checkbox animat */}
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-slate-600 bg-slate-900'}`}>
                            {isSelected && <Check size={12} className="text-white" />}
                        </div>
                    </motion.button>
                )
            })}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex gap-4 pt-6">
        <button 
            onClick={onBack} 
            disabled={loading}
            className="w-1/3 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
            Enrere
        </button>
        
        <button 
            onClick={onSubmit} 
            disabled={loading}
            className="flex-1 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-wait hover:scale-[1.02] active:scale-[0.98]"
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <span className="animate-spin text-xl">⏳</span> Guardant...
                </span>
            ) : (
                <>
                    <Sparkles className="fill-white" /> Publicar Recepta!
                </>
            )}
        </button>
      </div>
    </motion.div>
  );
}