// src/components/recipes/editor/RecipeEditor.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { IngredientsManager } from './IngredientsManager';
import { StepsBuilder } from './StepsBuilder';
import { MetaControls } from './MetaControls';
import { ChefHat, ListChecks, Save } from 'lucide-react';
import { InventoryItemUI, StepsLabels } from './types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { useRecipeForm } from './useRecipeForm';
import { FeedbackModal } from '@/components/ui/FeedbackModal';
interface Props {
  userInventory: InventoryItemUI[];
}

export function RecipeEditor({ userInventory }: Props) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');

  const { data, setData, loading, errors, handleSave, feedback, closeFeedback } = useRecipeForm(t.create_recipe, setActiveTab);
  const { startTour, currentStepIndex, isActive, steps: activeSteps } = useOnboarding();

  const onboardingSteps: TourStep[] = useMemo(() => [
    { targetId: 'tour-recipe-title', title: t.onboarding.editor.step1_title, description: t.onboarding.editor.step1_desc },
    { targetId: 'tour-prep-time', title: t.onboarding.editor.step2_title, description: t.onboarding.editor.step2_desc },
    { targetId: 'tour-dietary-tags', title: t.onboarding.editor.step3_title, description: t.onboarding.editor.step3_desc },
    { targetId: 'tour-ing-input', title: t.onboarding.editor.step4_title, description: t.onboarding.editor.step4_desc, requiredTab: 'ingredients' },
    { targetId: 'tour-ing-list', title: t.onboarding.editor.step5_title, description: t.onboarding.editor.step5_desc, requiredTab: 'ingredients' },
    { targetId: 'tour-step-textarea', title: t.onboarding.editor.step6_title, description: t.onboarding.editor.step6_desc, requiredTab: 'steps' },
    { targetId: 'tour-step-chips', title: t.onboarding.editor.step7_title, description: t.onboarding.editor.step7_desc, requiredTab: 'steps' },
    { targetId: 'tour-save-btn', title: t.onboarding.editor.step8_title, description: t.onboarding.editor.step8_desc }
  ], [t]);

  // 3. INICI I GESTIÓ DEL TOUR
  useEffect(() => {
    // Passem l'ID 'recipe-editor'
    startTour('recipe-editor', onboardingSteps);
  }, [startTour, onboardingSteps]);

  // CANVI DE PESTANYA PEL TOUR
  useEffect(() => {
    if (!isActive) return;
    const currentStep = activeSteps[currentStepIndex];
    if (currentStep?.requiredTab && activeTab !== currentStep.requiredTab) {
      const timer = setTimeout(() => setActiveTab(currentStep.requiredTab!), 100);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isActive, activeSteps, activeTab]);

  const safeStepsLabels: StepsLabels = {
    ...(t.create_recipe.steps as unknown as Record<string, string>),
    title: "Passos", placeholder: "Ex: Tallar la ceba...", empty_state: "Afegeix el primer pas...",
    new_step_title: "Nou Pas", new_step_desc: "Escriu i prem Enter"
  } as StepsLabels;

  return (
    <div className="flex flex-col h-full bg-slate-950 relative">
      {/* ✅ AFEGIM EL MODAL AQUÍ (Pot anar a qualsevol lloc, és fixed) */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={closeFeedback}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />
      {/* ✅ CORRECTE: El botó està aquí, fora de les pestanyes i del header */}
      {/* top-4 right-4 el posiciona relatiu a tota la pantalla/contenidor */}
      <div className="absolute top-4 right-4 z-9990">
        <TourTrigger tourId="recipe-editor" steps={onboardingSteps} />
      </div>

      <MetaControls data={data} update={setData} hasError={errors.name} />

      <div className="shrink-0 px-4 py-2 bg-slate-950 border-b border-slate-900 z-40">
        <div id="tour-tabs" className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800/50 relative max-w-md mx-auto">
          <motion.div
            layoutId="activeTab"
            className={`absolute inset-y-1 rounded-lg bg-slate-800 shadow-sm ${activeTab === 'ingredients' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+4px)] w-[calc(50%-8px)]'}`}
          />
          <TabButton
            active={activeTab === 'ingredients'} onClick={() => setActiveTab('ingredients')} error={errors.ingredients}
            icon={<ChefHat size={14} />} label="Ingredients" count={data.ingredients.length}
          />
          <TabButton
            active={activeTab === 'steps'} onClick={() => setActiveTab('steps')} error={errors.steps}
            icon={<ListChecks size={14} />} label="Passos" count={data.steps.length}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative w-full p-2 sm:p-4 md:p-6">
        <div id="tour-content-area" className="h-full w-full bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden relative backdrop-blur-sm">
          {activeTab === 'ingredients' ? (
            <IngredientsManager data={data} update={setData} inventory={userInventory} labels={t.create_recipe.ingredients} />
          ) : (
            <StepsBuilder data={data} update={setData} labels={safeStepsLabels} />
          )}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-50">
        <motion.button
          id="tour-save-btn"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={handleSave} disabled={loading}
          className={`w-16 h-16 rounded-full shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] flex items-center justify-center ring-4 transition-all ${loading ? 'bg-slate-800 cursor-wait ring-slate-700' : 'bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/40 cursor-pointer ring-slate-950/80'
            }`}
        >
          {loading ? <span className="animate-spin text-2xl">⏳</span> : <Save className="w-7 h-7 text-white stroke-[2.5px]" />}
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
    <button onClick={onClick} className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 ${error ? 'text-red-400 animate-pulse' : (active ? 'text-white' : 'text-slate-500')}`}>
      {icon} {error ? `Falten ${label}!` : label} {count > 0 && !error && <span className="bg-purple-600 text-white text-[9px] px-1.5 rounded-full">{count}</span>}
    </button>
  );
}