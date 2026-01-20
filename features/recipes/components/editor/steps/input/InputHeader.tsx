'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Check, X, ArrowDown } from 'lucide-react';

interface Props {
  isEditing: boolean;
  isListening: boolean;
  hasContent: boolean;
  labels: { title: string; subtitle: string };
  onSave: () => void;
  onCancel: () => void;
  onToggleSpeech: () => void;
}

export function InputHeader({ isEditing, isListening, hasContent, labels, onSave, onCancel, onToggleSpeech }: Props) {
  return (
    <div className="p-4 pb-2 shrink-0 flex justify-between items-center bg-slate-900/20">
      <div>
        <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${isEditing ? 'text-purple-400' : 'text-slate-500'}`}>
          <span className="text-lg">{isEditing ? '✏️' : '✍️'}</span>
          {isEditing ? 'Editant Pas...' : labels.title}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        {/* BOTÓ CANCEL·LAR */}
        {isEditing && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:bg-red-900/30 hover:text-red-400 hover:border-red-500/50 transition-colors"
            title="Cancel·lar edició"
          >
            <X size={16} strokeWidth={3} />
          </motion.button>
        )}

        {/* BOTÓ VEU */}
        <button
          onClick={onToggleSpeech}
          className={`
            h-8 px-3 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border
            ${isListening
              ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-red-500/20 shadow-lg'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }
          `}
        >
          {isListening ? <MicOff size={14} /> : <Mic size={14} />}
          <span className="hidden sm:inline">{isListening ? 'Stop' : 'Dictar'}</span>
        </button>

        {/* BOTÓ GUARDAR/AFEGIR */}
        <AnimatePresence mode="popLayout">
          {(hasContent || isEditing) && (
            <motion.button
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSave}
              data-testid="recipe-step-save"
              className={`
                h-8 px-3 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border shadow-lg
                ${isEditing
                  ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                  : 'bg-purple-600 text-white border-purple-500 hover:bg-purple-500'
                }
              `}
            >
              {isEditing ? <Check size={16} strokeWidth={3} /> : <ArrowDown size={16} strokeWidth={3} />}
              <span className="hidden sm:inline">{isEditing ? 'Guardar' : 'Afegir'}</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
