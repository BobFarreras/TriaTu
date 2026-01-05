// src/components/recipes/editor/StepsBuilder.tsx
'use client'

import { useState } from 'react';
import { EditorData, StepsLabels } from './types';
import { useStepsManager } from './steps/useStepsManager';
import { StepsInput } from './steps/StepsInput';
import { StepsList } from './steps/StepsList';
import { PenLine, Eye } from 'lucide-react'; 

interface Props {
  data: EditorData;
  update: (d: EditorData) => void;
  labels: StepsLabels; 
}

export function StepsBuilder({ data, update, labels }: Props) {
  const {
    currentStepText,
    setCurrentStepText,
    textareaRef,
    listEndRef,
    addStep,
    removeStep,
    handleReorder
  } = useStepsManager(data, update);

  // Estat visual només per a mòbil
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  const handleAddStep = () => {
    addStep();
    // Opcional: Feedback visual o canvi de vista
  };

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-2 lg:divide-x divide-slate-800 relative">
      
      {/* --- MOBILE TOGGLE (Ocult en Desktop 'lg:hidden') --- */}
      <div className="lg:hidden shrink-0 flex p-1 bg-slate-900 border-b border-slate-800">
          <button
            onClick={() => setMobileView('edit')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                mobileView === 'edit' 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <PenLine size={14} /> Editor
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                mobileView === 'preview' 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Eye size={14} /> Llista ({data.steps.length})
          </button>
      </div>

      {/* 1. INPUT + CONTEXT (COLUMNA ESQUERRA)
          Lògica CSS:
          - mobileView === 'preview'? -> hidden (oculta en mòbil)
          - lg:flex -> PERÒ en Desktop FORÇA que es vegi sempre (Split View)
      */}
      <div className={`
          flex-col h-full overflow-hidden
          ${mobileView === 'preview' ? 'hidden lg:flex' : 'flex'}
      `}>
          <StepsInput 
            data={data}
            currentText={currentStepText}
            onChangeText={setCurrentStepText}
            onAdd={handleAddStep}
            textareaRef={textareaRef}
            labels={labels}
          />
      </div>

      {/* 2. LLISTA VISUAL (COLUMNA DRETA)
          Lògica CSS:
          - mobileView === 'edit'? -> hidden (oculta en mòbil)
          - lg:flex -> PERÒ en Desktop FORÇA que es vegi sempre
          - bg-slate-950/40 -> Fons lleugerament diferent per separar visualment
      */}
      <div className={`
          flex-col h-full overflow-hidden bg-slate-950/40
          ${mobileView === 'edit' ? 'hidden lg:flex' : 'flex'}
      `}>
          <StepsList 
            steps={data.steps}
            ingredients={data.ingredients} // ✅ Crucial: Passem ingredients pel lookup
            onReorder={handleReorder}
            onRemove={removeStep}
            listEndRef={listEndRef}
            labels={labels}
          />
      </div>
    </div>
  );
}