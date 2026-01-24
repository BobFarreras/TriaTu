// src/components/recipes/editor/StepsBuilder.tsx
'use client'

import { useEffect, useState, useRef } from 'react';
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
  simulatedText?: string;
  simulatedIngredient?: string;
  simulatedAppendText?: string;
  simulateSave?: boolean;
  forceMobileView?: 'edit' | 'preview';
}

export function StepsBuilder({
  data, update, labels,
  textareaId, stepsListId, simulatedText, simulatedIngredient, simulatedAppendText, simulateSave, forceMobileView
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
  const simulationRef = useRef({ ingredient: false, append: false, saved: false });

  useEffect(() => {
    if (!simulatedText) return;
    if (editingId) return;
    if (currentStepText.trim()) return;
    setCurrentStepText(simulatedText);
  }, [currentStepText, editingId, setCurrentStepText, simulatedText]);

  useEffect(() => {
    if (!simulatedIngredient) {
      simulationRef.current.ingredient = false;
      return;
    }
    if (simulationRef.current.ingredient) return;
    const token = `[${simulatedIngredient}]`;
    if (currentStepText.includes(token)) {
      simulationRef.current.ingredient = true;
      return;
    }
    setCurrentStepText((prev) => {
      const base = prev || '';
      const needsSpace = base.length > 0 && !base.endsWith(' ');
      return `${base}${needsSpace ? ' ' : ''}${token}`;
    });
    simulationRef.current.ingredient = true;
  }, [currentStepText, setCurrentStepText, simulatedIngredient]);

  useEffect(() => {
    if (!simulatedAppendText) {
      simulationRef.current.append = false;
      return;
    }
    if (simulationRef.current.append) return;
    if (currentStepText.includes(simulatedAppendText)) {
      simulationRef.current.append = true;
      return;
    }
    setCurrentStepText((prev) => {
      const base = prev || '';
      const needsSpace = base.length > 0 && !base.endsWith(' ');
      return `${base}${needsSpace ? ' ' : ''}${simulatedAppendText}`;
    });
    simulationRef.current.append = true;
  }, [currentStepText, setCurrentStepText, simulatedAppendText]);

  useEffect(() => {
    if (!simulateSave) {
      simulationRef.current.saved = false;
      return;
    }
    if (simulationRef.current.saved) return;
    if (!currentStepText.trim()) return;
    if (simulatedIngredient && !currentStepText.includes(`[${simulatedIngredient}]`)) return;
    if (simulatedAppendText && !currentStepText.includes(simulatedAppendText)) return;
    saveStep();
    simulationRef.current.saved = true;
  }, [currentStepText, saveStep, simulateSave, simulatedAppendText, simulatedIngredient]);

  const shouldAutoPreview = Boolean(
    simulateSave &&
    currentStepText.trim() &&
    (!simulatedIngredient || currentStepText.includes(`[${simulatedIngredient}]`)) &&
    (!simulatedAppendText || currentStepText.includes(simulatedAppendText))
  );
  const resolvedMobileView = forceMobileView ?? (shouldAutoPreview ? 'preview' : mobileView);

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
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${resolvedMobileView === 'edit'
            ? 'bg-slate-800 text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          <PenLine size={14} /> Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${resolvedMobileView === 'preview'
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
          ${resolvedMobileView === 'preview' ? 'hidden lg:flex' : 'flex'}
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
          ${resolvedMobileView === 'edit' ? 'hidden lg:flex' : 'flex'}
      `}>
        <StepsList
          // ✅ CORRECCIÓ: Forcem que cada step tingui un id string per satisfer TS
          steps={data.steps.map(step => ({
            ...step,
            id: step.id || crypto.randomUUID() // Si no hi ha ID, en creem un de temporal
          }))}
          ingredients={data.ingredients}
          onReorder={handleReorder}
          onRemove={removeStep}
          onEdit={handleEditClick}
          editingId={editingId}
          listEndRef={listEndRef}
          labels={labels}
        />
      </div>
    </div>
  );
}
