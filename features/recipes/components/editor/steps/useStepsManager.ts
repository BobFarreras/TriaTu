// src/components/recipes/editor/steps/useStepsManager.ts
import { useState, useRef } from 'react';
import { EditorData, RecipeStep } from '../types';

export function useStepsManager(data: EditorData, update: (d: EditorData) => void) {
  const [currentStepText, setCurrentStepText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null); // ✅ Nou estat
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  // Aquesta funció ara serveix per AFEGIR o ACTUALITZAR
  const saveStep = () => {
    if (!currentStepText.trim()) return;
    
    // CAS 1: ESTEM EDITANT UN PAS EXISTENT
    if (editingId) {
        const updatedSteps = data.steps.map(step => 
            step.id === editingId 
                ? { ...step, content: currentStepText.trim() }
                : step
        );
        update({ ...data, steps: updatedSteps });
        setEditingId(null); // Sortim del mode edició
    } 
    // CAS 2: ESTEM CREANT UN PAS NOU
    else {
        const newStep: RecipeStep = {
            id: crypto.randomUUID(), 
            content: currentStepText.trim()
        };
        update({
            ...data,
            steps: [...data.steps, newStep]
        });
        
        // Scroll automàtic només si afegim un nou pas
        setTimeout(() => {
            listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    setCurrentStepText('');
    
    // Tornar el focus
    setTimeout(() => {
        textareaRef.current?.focus();
    }, 100);
  };

  const removeStep = (id: string) => {
    update({
      ...data,
      steps: data.steps.filter(s => s.id !== id)
    });
    // Si estàvem editant aquest pas, cancelem l'edició
    if (editingId === id) {
        setEditingId(null);
        setCurrentStepText('');
    }
  };

  const handleReorder = (newOrder: RecipeStep[]) => {
    update({ ...data, steps: newOrder });
  };

  // ✅ Nova funció: Carregar un pas per editar-lo
  const startEditing = (step: RecipeStep) => {
      setEditingId(step.id);
      setCurrentStepText(step.content);
      // En mòbil, potser voldràs canviar la vista aquí, però això ho gestiona el Builder
      setTimeout(() => {
          textareaRef.current?.focus();
      }, 50);
  };

  // ✅ Cancel·lar edició
  const cancelEditing = () => {
      setEditingId(null);
      setCurrentStepText('');
  };

  return {
    currentStepText,
    setCurrentStepText,
    editingId,       // Exportem l'estat
    startEditing,    // Exportem la funció
    cancelEditing,   // Exportem la funció
    saveStep,        // Abans es deia addStep
    textareaRef,
    listEndRef,
    removeStep,
    handleReorder
  };
}