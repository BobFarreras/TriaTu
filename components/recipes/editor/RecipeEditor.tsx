'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { IngredientsManager } from './IngredientsManager';
import { StepsBuilder } from './StepsBuilder';
import { MetaControls } from './MetaControls';
import { ChefHat, ListChecks, Save, Settings2 } from 'lucide-react';
import { InventoryItemUI, StepsLabels, IngredientsLabels } from './types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { useRecipeForm } from './useRecipeForm';
import { FeedbackModal } from '@/components/ui/FeedbackModal';

interface Props {
  userInventory: InventoryItemUI[];
}

// ✅ TIPUS PER A LES PESTANYES
type TabType = 'meta' | 'ingredients' | 'steps';

export function RecipeEditor({ userInventory }: Props) {
  const { t } = useLanguage();
  
  // ✅ USEM EL NOU TIPUS AQUÍ
  const [activeTab, setActiveTab] = useState<TabType>('ingredients');

  const { data, setData, loading, errors, handleSave, feedback, closeFeedback } = useRecipeForm(t.create_recipe, setActiveTab);
  const { startTour, currentStepIndex, isActive, steps: activeSteps } = useOnboarding();

  const onboardingSteps: TourStep[] = useMemo(() => [
    { targetId: 'tour-recipe-title', title: t.onboarding.editor.step1_title, description: t.onboarding.editor.step1_desc, requiredTab: 'meta' },
    { targetId: 'tour-prep-time', title: t.onboarding.editor.step2_title, description: t.onboarding.editor.step2_desc, requiredTab: 'meta' }, // També a meta
    { targetId: 'tour-dietary-tags', title: t.onboarding.editor.step3_title, description: t.onboarding.editor.step3_desc, requiredTab: 'meta' }, // També a meta
    { targetId: 'tour-ing-input', title: t.onboarding.editor.step4_title, description: t.onboarding.editor.step4_desc, requiredTab: 'ingredients' },
    { targetId: 'tour-ing-list', title: t.onboarding.editor.step5_title, description: t.onboarding.editor.step5_desc, requiredTab: 'ingredients' },
    { targetId: 'tour-step-textarea', title: t.onboarding.editor.step6_title, description: t.onboarding.editor.step6_desc, requiredTab: 'steps' },
    { targetId: 'tour-step-chips', title: t.onboarding.editor.step7_title, description: t.onboarding.editor.step7_desc, requiredTab: 'steps' },
    { targetId: 'tour-save-btn', title: t.onboarding.editor.step8_title, description: t.onboarding.editor.step8_desc }
  ], [t]);

  useEffect(() => {
    startTour('recipe-editor', onboardingSteps);
  }, [startTour, onboardingSteps]);

  const safeIngredientsLabels: IngredientsLabels = {
    ...(t.create_recipe.ingredients as unknown as Record<string, string>),
    title: t.create_recipe.ingredients.title || "Ingredients",
    selected: t.create_recipe.ingredients.selected || "Seleccionat",
    search_placeholder: t.create_recipe.ingredients.search_placeholder || "Cercar...",
    category_all: t.create_recipe.ingredients.category_all || "Tot",
    empty_search: t.create_recipe.ingredients.empty_search || "Res trobat",
    basket_title: t.create_recipe.ingredients.basket_title || "Llista",
    basket_empty: t.create_recipe.ingredients.basket_empty || "Buit",
    search_placeholder_recipe: "Ex: Pit de pollastre..."
  } as IngredientsLabels;

  const safeStepsLabels: StepsLabels = {
    ...(t.create_recipe.steps as unknown as Record<string, string>),
    title: "Passos", placeholder: "Ex: Tallar la ceba...", empty_state: "Afegeix el primer pas...",
    new_step_title: "Nou Pas", new_step_desc: "Escriu i prem Enter"
  } as StepsLabels;

  // Gestió de canvi de tab automàtic pel tour
  useEffect(() => {
    if (!isActive) return;
    const currentStep = activeSteps[currentStepIndex];
    if (currentStep?.requiredTab && activeTab !== currentStep.requiredTab) {
        // ✅ CORRECCIÓ: Check segur per satisfer TypeScript sense usar 'any'
        const reqTab = currentStep.requiredTab;
        if (reqTab === 'meta' || reqTab === 'ingredients' || reqTab === 'steps') {
             const timer = setTimeout(() => setActiveTab(reqTab), 100);
             return () => clearTimeout(timer);
        }
    }
  }, [currentStepIndex, isActive, activeSteps, activeTab]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 overflow-hidden relative">
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={closeFeedback}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />
      
      <div className="absolute top-4 right-4 z-[9990]">
        <TourTrigger tourId="recipe-editor" steps={onboardingSteps} />
      </div>

      <div className="shrink-0 px-6 pt-4 pb-2 bg-slate-950 flex items-center justify-center">
          <h1 className="text-slate-200 font-bold text-lg truncate max-w-[200px] opacity-80 cursor-pointer" onClick={() => setActiveTab('meta')}>
             {data.name || "Nova Recepta"}
          </h1>
      </div>

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
          
          <TabButton
            active={activeTab === 'meta'} onClick={() => setActiveTab('meta')} error={errors.name}
            icon={<Settings2 size={16} />} label="Info" count={0}
          />
          <TabButton
            active={activeTab === 'ingredients'} onClick={() => setActiveTab('ingredients')} error={errors.ingredients}
            icon={<ChefHat size={16} />} label="Ingredients" count={data.ingredients.length}
          />
          <TabButton
            active={activeTab === 'steps'} onClick={() => setActiveTab('steps')} error={errors.steps}
            icon={<ListChecks size={16} />} label="Passos" count={data.steps.length}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative w-full p-2 sm:p-4 md:p-6">
        <div id="tour-content-area" className="h-full w-full bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden relative backdrop-blur-sm shadow-inner">
          
          {activeTab === 'meta' && (
             <div className="h-full overflow-y-auto p-4 animate-in fade-in zoom-in-95 scrollbar-thin scrollbar-thumb-slate-800">
                <div className="max-w-2xl mx-auto space-y-6 pt-4 pb-20">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-black text-white mb-2">Detalls de la Recepta 📝</h2>
                        <p className="text-slate-400 text-sm">Posa nom, temps i etiquetes a la teva creació.</p>
                    </div>
                    <MetaControls data={data} update={setData} hasError={errors.name} />
                </div>
             </div>
          )}

          {activeTab === 'ingredients' && (
            <IngredientsManager
              data={data}
              update={setData}
              inventory={userInventory}
              labels={safeIngredientsLabels}
            />
          )}

          {activeTab === 'steps' && (
            <StepsBuilder data={data} update={setData} labels={safeStepsLabels} />
          )}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-[60]">
        <motion.button
          id="tour-save-btn"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={handleSave} disabled={loading}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] flex items-center justify-center ring-4 transition-all ${loading ? 'bg-slate-800 cursor-wait ring-slate-700' : 'bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/40 cursor-pointer ring-slate-950/80'
            }`}
        >
          {loading ? <span className="animate-spin text-2xl">⏳</span> : <Save className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[2.5px]" />}
        </motion.button>
      </div>
    </div>
  );
}

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