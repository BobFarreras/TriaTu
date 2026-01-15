// src/components/recipes/editor/StepsBuilder.tsx
'use client'

import { useState } from 'react';
import { EditorData, StepsLabels, RecipeStep } from './types';
import { useStepsManager } from './steps/useStepsManager';
import { StepsInput } from './steps/StepsInput';
import { StepsList } from './steps/StepsList';
import { PenLine, Eye } from 'lucide-react';

interface Props {
  data: EditorData;
  update: (d: EditorData) => void;
  labels: StepsLabels;
  // ✅ Props per al Tour
  textareaId?: string;
  stepsListId?: string;
}

export function StepsBuilder({
  data, update, labels,
  textareaId, stepsListId
}: Props) {
  const {
    currentStepText,
    setCurrentStepText,
    editingId,
    startEditing,
    cancelEditing,
    saveStep,
    textareaRef,
    listEndRef,
    removeStep,
    handleReorder
  } = useStepsManager(data, update);

  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  // Wrapper per canviar de vista automàticament al mòbil quan editem
  const handleEditClick = (step: RecipeStep) => {
    startEditing(step);
    setMobileView('edit'); // 👈 Màgia UX
  };

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-2 lg:divide-x divide-slate-800 relative">

      {/* MOBILE TOGGLE */}
      <div className="lg:hidden shrink-0 flex p-1 bg-slate-900 border-b border-slate-800">
        <button
          onClick={() => setMobileView('edit')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${mobileView === 'edit'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          <PenLine size={14} /> Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${mobileView === 'preview'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          <Eye size={14} /> Llista ({data.steps.length})
        </button>
      </div>

      {/* INPUT + CONTEXT */}
      <div id={textareaId} className={`
          flex-col h-full overflow-hidden
          ${mobileView === 'preview' ? 'hidden lg:flex' : 'flex'}
      `}>
        <StepsInput
          data={data}
          currentText={currentStepText}
          onChangeText={setCurrentStepText}
          onSave={saveStep} // Canviat de onAdd a onSave
          onCancel={cancelEditing} // Nova prop
          isEditing={!!editingId}  // Nova prop
          textareaRef={textareaRef}
          labels={labels}
        />
      </div>

      {/* LLISTA VISUAL */}
      <div id={stepsListId} // ✅ ID aplicat al contenidor de la llista
        className={`
          flex-col h-full overflow-hidden bg-slate-950/40
          ${mobileView === 'edit' ? 'hidden lg:flex' : 'flex'}
      `}>
        <StepsList
          steps={data.steps}
          ingredients={data.ingredients}
          onReorder={handleReorder}
          onRemove={removeStep}
          onEdit={handleEditClick} // ✅ Passem la funció d'editar
          editingId={editingId}    // ✅ Passem l'ID actiu per marcar-lo visualment
          listEndRef={listEndRef}
          labels={labels}
        />
      </div>
    </div>
  );
}