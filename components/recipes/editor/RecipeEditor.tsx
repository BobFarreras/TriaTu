'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { IngredientsManager } from './IngredientsManager';
import { StepsBuilder } from './StepsBuilder';
import { MetaControls } from './MetaControls';
import { Save} from 'lucide-react';
import { InventoryItemUI, StepsLabels, IngredientsLabels } from './types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/components/onboarding/OnboardingContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { useRecipeForm } from './useRecipeForm';
import { FeedbackModal } from '@/components/ui/FeedbackModal';
import { useRouter } from 'next/navigation';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { EditorTabs, TabType } from './editor/EditorTabs';
import { getEditorTourSteps, mapRecipeToFormData } from './editor/utils';
import { EditorHeader } from './editor/EditorHeader';

interface Props {
  userInventory: InventoryItemUI[];
  initialRecipe?: RecipeProps;
}

export function RecipeEditor({ userInventory, initialRecipe }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('meta');

  // 1. DATA MAPPING (Extret a utils)
  const initialFormData = useMemo(() => mapRecipeToFormData(initialRecipe), [initialRecipe]);

  // 2. FORM LOGIC
  const { data, setData, loading, errors, handleSave, feedback, closeFeedback } =
    useRecipeForm(t.create_recipe, setActiveTab, initialFormData);
  
  // 3. ONBOARDING LOGIC
  const { startTour, currentStepIndex, isActive, steps: activeSteps } = useOnboarding();
  const onboardingSteps = useMemo(() => getEditorTourSteps(t), [t]);

  useEffect(() => {
    if (initialRecipe) return; 
    const timer = setTimeout(() => startTour('recipe-editor', onboardingSteps), 800);
    return () => clearTimeout(timer);
  }, [startTour, onboardingSteps, initialRecipe]);

  // Sincronització de Tabs amb el Tour
  useEffect(() => {
    if (!isActive) return;
    const currentStep = activeSteps[currentStepIndex];
    if (currentStep?.requiredTab && activeTab !== currentStep.requiredTab) {
      const timer = setTimeout(() => setActiveTab(currentStep.requiredTab as TabType), 0);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isActive, activeSteps, activeTab]);

  // 4. HANDLERS
  const handleExit = () => {
    if (confirm("Vols sortir sense guardar els canvis?")) router.back();
  };

  // 5. LABELS (Mapeig segur)
  const safeIngredientsLabels: IngredientsLabels = {
    ...(t.create_recipe.ingredients as unknown as Record<string, string>),
    title: t.create_recipe.ingredients.title || "Ingredients",
    basket_title: "La teva Cistella",
    basket_empty: "Encara no has afegit ingredients"
  } as IngredientsLabels;

  const safeStepsLabels: StepsLabels = {
    ...(t.create_recipe.steps as unknown as Record<string, string>),
    title: "Passos"
  } as StepsLabels;

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 overflow-hidden relative">
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={closeFeedback}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />

      <div className="absolute top-4 right-4 z-50">
        <TourTrigger tourId="recipe-editor" steps={onboardingSteps} />
      </div>

      <EditorHeader 
        title={data.name} 
        isEditing={!!initialRecipe} 
        onExit={handleExit} 
        onTitleClick={() => setActiveTab('meta')} 
      />

      <EditorTabs 
        activeTab={activeTab} 
        onChange={setActiveTab} 
        errors={{ name: errors.name, ingredients: errors.ingredients, steps: errors.steps }}
        counts={{ ingredients: data.ingredients.length, steps: data.steps.length }}
      />

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative w-full p-2 sm:p-4 md:p-6">
        <div id="tour-content-area" className="h-full w-full bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden relative backdrop-blur-sm shadow-inner">
          
          {activeTab === 'meta' && (
            <div className="h-full overflow-y-auto p-4 animate-in fade-in zoom-in-95 scrollbar-thin scrollbar-thumb-slate-800">
              <div className="max-w-2xl mx-auto space-y-6 pt-4 pb-20">
                <MetaControls
                  data={data}
                  update={setData}
                  hasError={errors.name}
                  titleInputId="tour-recipe-title"
                  prepTimeId="tour-prep-time"
                  tagsContainerId="tour-dietary-tags"
                />
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <IngredientsManager
              data={data}
              update={setData}
              inventory={userInventory}
              labels={safeIngredientsLabels}
              searchInputId="tour-ing-input"
              ingredientsListId="tour-ing-list"
            />
          )}

          {activeTab === 'steps' && (
            <StepsBuilder
              data={data}
              update={setData}
              labels={safeStepsLabels}
              textareaId="tour-step-textarea"
              stepsListId="tour-step-chips"
            />
          )}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="absolute bottom-6 right-6 z-60">
        <motion.button
          id="tour-save-btn"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={handleSave} disabled={loading}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] flex items-center justify-center ring-4 transition-all ${loading ? 'bg-slate-800 cursor-wait ring-slate-700' : 'bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/40 cursor-pointer ring-slate-950/80'}`}
        >
          {loading ? <span className="animate-spin text-2xl">⏳</span> : <Save className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[2.5px]" />}
        </motion.button>
      </div>
    </div>
  );
}