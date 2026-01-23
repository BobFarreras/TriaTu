'use client'

import { useState, useEffect, useMemo, useTransition, useRef } from 'react';
import { IngredientsManager } from './IngredientsManager';
import { StepsBuilder } from './StepsBuilder';
import { MetaControls } from './MetaControls';
import { Save, Trash2 } from 'lucide-react'; // Importem icona Trash2

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
import { getEditorTourSamples, getEditorTourSteps, mapRecipeToFormData } from './editor/utils';
import { EditorHeader } from './editor/EditorHeader';
import { deleteRecipeAction } from '@/app/actions/delete-recipe'; // Importem l'acció
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
  const [isPendingDelete, startDeleteTransition] = useTransition();
  // 2. FORM LOGIC
  const { data, setData, loading, errors, handleSave, feedback, closeFeedback } =
    useRecipeForm(t.create_recipe, setActiveTab, initialFormData);

  // 3. ONBOARDING LOGIC
  const { startTour, currentStepIndex, isActive, steps: activeSteps } = useOnboarding();
  const onboardingSteps = useMemo(() => getEditorTourSteps(t), [t]);
  const tourSamples = useMemo(() => getEditorTourSamples(), []);
  const simulationRef = useRef({
    name: false,
    prep: false,
    tags: false,
    ingredients: false,
    linked: false,
    stepText: false,
    stepSaved: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = initialRecipe ? 'tour:recipe-editor-edit' : 'tour:recipe-editor-create';
    const hasSeen = window.localStorage.getItem(key);
    if (hasSeen) return;
    const timer = setTimeout(() => {
      startTour('recipe-editor', onboardingSteps);
      window.localStorage.setItem(key, '1');
    }, 800);
    return () => clearTimeout(timer);
  }, [startTour, onboardingSteps, initialRecipe]);

  useEffect(() => {
    if (!isActive) return;
    const stepId = activeSteps[currentStepIndex]?.targetId;
    if (!stepId) return;

    if (stepId === 'tour-recipe-title' && !simulationRef.current.name && !data.name.trim()) {
      simulationRef.current.name = true;
      setData({ ...data, name: tourSamples.name });
      return;
    }

    if (stepId === 'tour-prep-time' && !simulationRef.current.prep) {
      simulationRef.current.prep = true;
      setData({ ...data, prepTimeMinutes: tourSamples.prepTimeMinutes });
      return;
    }

    if (stepId === 'tour-dietary-tags' && !simulationRef.current.tags) {
      simulationRef.current.tags = true;
      const mergedTags = Array.from(new Set([...data.dietaryTags, ...tourSamples.dietaryTags]));
      setData({ ...data, dietaryTags: mergedTags });
      return;
    }

    if (stepId === 'tour-ing-input' && !simulationRef.current.ingredients && data.ingredients.length === 0) {
      simulationRef.current.ingredients = true;
      setData({ ...data, ingredients: tourSamples.ingredients });
      return;
    }

    if (stepId === 'tour-ing-list' && !simulationRef.current.linked && data.ingredients.length > 0) {
      simulationRef.current.linked = true;
      setData({ ...data, ingredients: tourSamples.linkedIngredients });
      return;
    }

    if (stepId === 'tour-step-textarea' && !simulationRef.current.stepText) {
      simulationRef.current.stepText = true;
      return;
    }

    if (stepId === 'tour-step-chips' && !simulationRef.current.stepSaved && data.steps.length === 0) {
      simulationRef.current.stepSaved = true;
      setData({
        ...data,
        steps: [{ id: crypto.randomUUID(), content: tourSamples.stepText }]
      });
    }
  }, [activeSteps, currentStepIndex, data, isActive, setData, tourSamples]);

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
  // NOU HANDLER: Gestió de l'eliminació
  const handleDelete = async () => {
    if (!initialRecipe?.id) return;

    // UX: Confirmació nativa (Simple i efectiva per accions destructives)
    // En el futur es pot canviar per un Modal de UI si es vol més estil.
    const confirmed = window.confirm("Estàs segur que vols eliminar aquesta recepta? Aquesta acció no es pot desfer.");

    if (confirmed) {
      startDeleteTransition(async () => {
        const result = await deleteRecipeAction(initialRecipe.id!);
        if (result?.error) {
          // Si falla, mostrem feedback utilitzant el sistema existent
          // Nota: necessitaràs exposar 'setFeedback' des de useRecipeForm o similar
          alert(result.error); // Fallback si no tenim accés al setFeedback des d'aquí fàcilment
        }
      });
    }
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


      {/* HEADER MODIFICAT: Passem la funció de delete o col·loquem el botó aquí si EditorHeader ho permet */}
      {/* Si EditorHeader no accepta children o accions extra, podem posar el botó flotant a l'esquerra del Save o a dalt */}

      <div className="relative z-50">

        <EditorHeader
          title={data.name}
          isEditing={!!initialRecipe}
          onExit={handleExit}
          onTitleClick={() => setActiveTab('meta')}
          rightSlot={<TourTrigger tourId="recipe-editor" steps={onboardingSteps} />}
        />
        {/* Botó d'eliminar absolut a la capçalera (ajustar posició segons disseny de EditorHeader) */}
        {initialRecipe && (
          <button
            onClick={handleDelete}
            disabled={isPendingDelete || loading}
            data-testid="recipe-delete-button"
            className="absolute top-4 right-16 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
            title="Eliminar recepta"
          >
            {isPendingDelete ? <span className="animate-spin">⏳</span> : <Trash2 className="w-5 h-5" />}
          </button>
        )}
      </div>

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
              forceLinkerOpen={isActive && activeSteps[currentStepIndex]?.targetId === 'tour-ing-list'}
            />
          )}

          {activeTab === 'steps' && (
            <StepsBuilder
              data={data}
              update={setData}
              labels={safeStepsLabels}
              textareaId="tour-step-textarea"
              stepsListId="tour-step-chips"
              simulatedText={isActive && activeSteps[currentStepIndex]?.targetId === 'tour-step-textarea' ? tourSamples.stepText : undefined}
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
          data-testid="recipe-save-button"
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] flex items-center justify-center ring-4 transition-all ${loading ? 'bg-slate-800 cursor-wait ring-slate-700' : 'bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/40 cursor-pointer ring-slate-950/80'}`}
        >
          {loading ? <span className="animate-spin text-2xl">⏳</span> : <Save className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[2.5px]" />}
        </motion.button>
      </div>
    </div>
  );
}
