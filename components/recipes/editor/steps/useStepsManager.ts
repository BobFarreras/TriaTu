// src/components/recipes/editor/steps/useStepsManager.ts
import { useState, useRef } from 'react';
import { EditorData, RecipeStep } from '../types';

export function useStepsManager(data: EditorData, update: (d: EditorData) => void) {
  const [currentStepText, setCurrentStepText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  const addStep = () => {
    if (!currentStepText.trim()) return;
    
    const newStep: RecipeStep = {
      id: crypto.randomUUID(), 
      content: currentStepText.trim()
    };

    update({
      ...data,
      steps: [...data.steps, newStep]
    });
    setCurrentStepText('');
    
    // Focus i Scroll
    setTimeout(() => {
        textareaRef.current?.focus();
        listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const removeStep = (id: string) => {
    update({
      ...data,
      steps: data.steps.filter(s => s.id !== id)
    });
  };

  const handleReorder = (newOrder: RecipeStep[]) => {
    update({ ...data, steps: newOrder });
  };

  return {
    currentStepText,
    setCurrentStepText,
    textareaRef,
    listEndRef,
    addStep,
    removeStep,
    handleReorder
  };
}