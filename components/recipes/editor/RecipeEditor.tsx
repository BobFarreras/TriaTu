// src/components/recipes/editor/RecipeEditor.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { IngredientsManager } from './IngredientsManager';
import { StepsBuilder } from './StepsBuilder';
import { MetaControls } from './MetaControls';
import { ArrowLeft, ChefHat, ListChecks, Save, Settings2 } from 'lucide-react';
import { InventoryItemUI, StepsLabels, IngredientsLabels } from './types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { useRecipeForm } from './useRecipeForm';
import { FeedbackModal } from '@/components/ui/FeedbackModal';
import { useRouter } from 'next/navigation';

interface Props {
  userInventory: InventoryItemUI[];
}

type TabType = 'meta' | 'ingredients' | 'steps';

export function RecipeEditor({ userInventory }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('meta'); // Comencem per Meta per l'onboarding

  const { data, setData, loading, errors, handleSave, feedback, closeFeedback } = useRecipeForm(t.create_recipe, setActiveTab);
  const { startTour, currentStepIndex, isActive, steps: activeSteps } = useOnboarding();

  // DEFINICIÓ DELS PASSOS DEL TOUR
  const onboardingSteps: TourStep[] = useMemo(() => [
    { targetId: 'tour-recipe-title', title: t.onboarding.editor.step1_title, description: t.onboarding.editor.step1_desc, requiredTab: 'meta' },
    { targetId: 'tour-prep-time', title: t.onboarding.editor.step2_title, description: t.onboarding.editor.step2_desc, requiredTab: 'meta' },
    { targetId: 'tour-dietary-tags', title: t.onboarding.editor.step3_title, description: t.onboarding.editor.step3_desc, requiredTab: 'meta' },
    { targetId: 'tour-ing-input', title: t.onboarding.editor.step4_title, description: t.onboarding.editor.step4_desc, requiredTab: 'ingredients' },
    { targetId: 'tour-ing-list', title: t.onboarding.editor.step5_title, description: t.onboarding.editor.step5_desc, requiredTab: 'ingredients' },
    { targetId: 'tour-step-textarea', title: t.onboarding.editor.step6_title, description: t.onboarding.editor.step6_desc, requiredTab: 'steps' },
    { targetId: 'tour-step-chips', title: t.onboarding.editor.step7_title, description: t.onboarding.editor.step7_desc, requiredTab: 'steps' },
    { targetId: 'tour-save-btn', title: t.onboarding.editor.step8_title, description: t.onboarding.editor.step8_desc }
  ], [t]);

  useEffect(() => {
    // Petit retard per assegurar el muntatge
    const timer = setTimeout(() => {
      startTour('recipe-editor', onboardingSteps);
    }, 800);
    return () => clearTimeout(timer);
  }, [startTour, onboardingSteps]);

  // Labels segurs...
  const safeIngredientsLabels: IngredientsLabels = {
    ...(t.create_recipe.ingredients as unknown as Record<string, string>),
    title: t.create_recipe.ingredients.title || "Ingredients",
    // ... resta de labels
    basket_title: "La teva Cistella",
    basket_empty: "Encara no has afegit ingredients"
  } as IngredientsLabels;

  const safeStepsLabels: StepsLabels = {
    ...(t.create_recipe.steps as unknown as Record<string, string>),
    title: "Passos"
  } as StepsLabels;
  
  // Sincronització de pestanyes amb el Tour
  useEffect(() => {
    if (!isActive) return;
    const currentStep = activeSteps[currentStepIndex];

    // Comprovem si cal canviar de pestanya
    if (currentStep?.requiredTab && activeTab !== currentStep.requiredTab) {
      // ✅ FIX: Embolcallar en setTimeout per fer-ho asíncron i trencar el cicle de render
      const timer = setTimeout(() => {
        setActiveTab(currentStep.requiredTab as TabType);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isActive, activeSteps, activeTab, setActiveTab]); // Afegit setActiveTab a deps

  const handleExit = () => {
    if (confirm("Vols sortir sense guardar?")) router.back();
  };

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

      {/* HEADER */}
      <div className="shrink-0 px-4 py-3 bg-slate-950 flex items-center justify-between border-b border-slate-900">
        <button onClick={handleExit} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-slate-200 font-bold text-lg cursor-pointer" onClick={() => setActiveTab('meta')}>
          {data.name || "Nova Recepta"}
        </h1>
        <div className="w-10"></div>
      </div>


      {/* TABS */}
      <div className="shrink-0 px-4 py-2 bg-slate-950 border-b border-slate-900 z-40">
        <div id="tour-tabs" className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800/50 relative max-w-lg mx-auto">
          <motion.div
            layoutId="activeTab"
            className="absolute inset-y-1 rounded-lg bg-slate-800 shadow-sm"
            initial={false}
            animate={{
              left: activeTab === 'meta' ? '1%' : activeTab === 'ingredients' ? '34%' : '67%',
              width: '32%'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <TabButton active={activeTab === 'meta'} onClick={() => setActiveTab('meta')} error={errors.name} icon={<Settings2 size={16} />} label="Info" count={0} />
          <TabButton active={activeTab === 'ingredients'} onClick={() => setActiveTab('ingredients')} error={errors.ingredients} icon={<ChefHat size={16} />} label="Ingredients" count={data.ingredients.length} />
          <TabButton active={activeTab === 'steps'} onClick={() => setActiveTab('steps')} error={errors.steps} icon={<ListChecks size={16} />} label="Passos" count={data.steps.length} />
        </div>
      </div>

      {/* CONTENT AREA - AQUÍ PASSEM ELS IDs */}
      <div className="flex-1 overflow-hidden relative w-full p-2 sm:p-4 md:p-6">
        <div id="tour-content-area" className="h-full w-full bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden relative backdrop-blur-sm shadow-inner">

          {activeTab === 'meta' && (
            <div className="h-full overflow-y-auto p-4 animate-in fade-in zoom-in-95 scrollbar-thin scrollbar-thumb-slate-800">
              <div className="max-w-2xl mx-auto space-y-6 pt-4 pb-20">
                <MetaControls
                  data={data}
                  update={setData}
                  hasError={errors.name}
                  // ✅ IDs PER AL TOUR
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
              // ✅ IDs PER AL TOUR
              searchInputId="tour-ing-input"
              ingredientsListId="tour-ing-list"
            />
          )}

          {activeTab === 'steps' && (
            <StepsBuilder
              data={data}
              update={setData}
              labels={safeStepsLabels}
              // ✅ IDs PER AL TOUR
              textareaId="tour-step-textarea"
              stepsListId="tour-step-chips"
            />
          )}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="absolute bottom-6 right-6 z-[60]">
        <motion.button
          id="tour-save-btn" // ✅ ID DIRECTE
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={handleSave} disabled={loading}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] flex items-center justify-center ring-4 transition-all ${loading ? 'bg-slate-800 cursor-wait ring-slate-700' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/40 cursor-pointer ring-slate-950/80'}`}
        >
          {loading ? <span className="animate-spin text-2xl">⏳</span> : <Save className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[2.5px]" />}
        </motion.button>
      </div>
    </div>
  );
}

// ... TabButton implementation stays the same
interface TabButtonProps {
  active: boolean; onClick: () => void; error: boolean; icon: React.ReactNode; label: string; count: number;
}
function TabButton({ active, onClick, error, icon, label, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative z-10 flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 ${error ? 'text-red-400 animate-pulse' : (active ? 'text-white' : 'text-slate-500 hover:text-slate-300')}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {count > 0 && !error && <span className="bg-purple-600 text-white text-[9px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ml-1">{count}</span>}
    </button>
  );
}