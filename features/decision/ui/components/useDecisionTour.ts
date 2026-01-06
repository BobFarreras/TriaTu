'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';
import { RecipeProps } from '@/core/domain/entities/Recipe';

// Dades Fictícies
const DUMMY_RECIPES: RecipeProps[] = [
    { 
        id: 'demo-1', name: "Pizza Casolana del Xef (Demo)", prepTimeMinutes: 25, 
        ingredients: [{ name: 'Farina', quantity: 300, unit: 'g' }, { name: 'Mozzarella', quantity: 1, unit: 'un' }],
        steps: [], authorId: 'demo', dietaryTags: [], tags: [], createdAt: new Date(), updatedAt: new Date(), privacy: 'PUBLIC', servings: 2
    } as unknown as RecipeProps,
    { 
        id: 'demo-2', name: "Amanida Cèsar Ràpida (Demo)", prepTimeMinutes: 10, 
        ingredients: [{ name: 'Enciam', quantity: 1, unit: 'un' }, { name: 'Pollastre', quantity: 200, unit: 'g' }],
        steps: [], authorId: 'demo', dietaryTags: [], tags: [], createdAt: new Date(), updatedAt: new Date(), privacy: 'PUBLIC', servings: 1
    } as unknown as RecipeProps,
];

export function useDecisionTour(
    currentMode: 'FATE' | 'CHEF',
    setMode: (mode: 'FATE' | 'CHEF') => void,
    isMobileExpanded: boolean,
    expandMobile: (expanded: boolean) => void
) {
    const { t } = useLanguage();
    const { startTour, isActive, nextStep, currentStepIndex } = useOnboarding();
    
    const [demoMode, setDemoMode] = useState(false);
    const [isSimulatingLoading, setIsSimulatingLoading] = useState(false);

    // ✅ TRUC MESTRE: Guardem l'estat en un REF per accedir-hi sempre fresc
    const isActiveRef = useRef(isActive);
    
    // Mantenim el ref sincronitzat amb l'estat real
    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    const steps: TourStep[] = useMemo(() => [
        { targetId: 'tour-dec-header', title: t.onboarding.decision.step1_title, description: t.onboarding.decision.step1_desc },
        { targetId: 'tour-dec-mode', title: t.onboarding.decision.step2_title, description: t.onboarding.decision.step2_desc },
        { targetId: 'tour-dec-inputs', title: t.onboarding.decision.step3_title, description: t.onboarding.decision.step3_desc },
        { targetId: 'tour-dec-action', title: t.onboarding.decision.step4_title, description: t.onboarding.decision.step4_desc },
        { targetId: 'tour-dec-results', title: t.onboarding.decision.step5_title, description: t.onboarding.decision.step5_desc }
    ], [t]);

    // 1. Iniciar Tour (Amb force: true per testejar sense problemes de cache)
    useEffect(() => {
        startTour('decision-maker', steps, { force: true });
        console.log("🏁 [TOUR] Inicialitzat FORÇAT");
    }, [startTour, steps]);

    // 2. Control de Pas
    useEffect(() => {
        if (!isActive) return;

        if (currentStepIndex === 2) {
            if (currentMode !== 'CHEF') {
                setMode('CHEF');
            }
            if (!isMobileExpanded) {
                expandMobile(true);
            }
        }
    }, [isActive, currentStepIndex, currentMode, setMode, isMobileExpanded, expandMobile]);

    // 3. INTERCEPTOR (Ara usa el Ref)
    const interceptExecution = (originalAction: () => void) => {
        // ✅ ARA MIREM EL VALOR REAL, NO EL CACHEJAT
        const isReallyActive = isActiveRef.current;
        
        console.log("🖱️ [TOUR CHECK] isActiveRef diu:", isReallyActive);

        if (isReallyActive) {
            console.log("🛑 [TOUR] INTERCEPTANT! Iniciant simulació...");
            
            setIsSimulatingLoading(true);

            setTimeout(() => {
                console.log("✅ [TOUR] Fi del temps d'espera");
                setIsSimulatingLoading(false);
                setDemoMode(true);

                setTimeout(() => {
                    nextStep();
                }, 200);

            }, 2000); 

        } else {
            console.log("🚀 [REAL] Executant acció real");
            originalAction();
        }
    };

    const closeDemo = () => setDemoMode(false);

    return {
        steps,
        isActive,
        demoMode,
        isSimulatingLoading,
        dummyRecipes: DUMMY_RECIPES,
        interceptExecution,
        closeDemo
    };
}