'use client';

import { useEffect, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';
import { RecipeProps } from '@/core/domain/entities/Recipe';

// ✅ DADES REALS DE LA TEVA BD (Copiat del teu JSON)
const DUMMY_RECIPES: RecipeProps[] = [
    {
        id: "1090b513-97e9-4ea5-93ab-b8de7bb43c32", // ID REAL
        name: "Arròs Fregit \"Wok de l'Aprofitament\"",
        prepTimeMinutes: 25,
        ingredients: [
            { name: "Arròs cuit", unit: "g", quantity: 200 },
            { name: "Ous", unit: "ut", quantity: 2 },
            { name: "Ceba", unit: "ut", quantity: 0.5 },
            { name: "Salsa de soja", unit: "cullerades", quantity: 2 }
        ],
        // Posem un resum dels passos per no omplir massa codi, però ja val
        steps: ["Pica verdures.", "Salta al wok.", "Afegeix arròs i ou.", "Serveix."],
        tags: ["ràpid", "asiàtic", "aprofitament"],
        dietaryTags: ["vegetarian"],
        authorId: 'demo-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        privacy: 'PUBLIC',
        servings: 2,
        likesCount: 0
    } as unknown as RecipeProps,
    
    {
        id: "f5d2abe7-95b3-42fd-96fc-7db1d33bbd63", // ID REAL
        name: "Truita de Patata i Pebrot",
        prepTimeMinutes: 30,
        ingredients: [
            { name: "Patata", unit: "ut", quantity: 2 },
            { name: "Ous", unit: "ut", quantity: 4 },
            { name: "Pebrot vermell", unit: "ut", quantity: 0.5 }
        ],
        steps: ["Fregir patates.", "Batre ous.", "Quallar truita."],
        tags: ["clàssic", "ràpid", "vegetarià"],
        dietaryTags: ["vegetarià"],
        authorId: 'demo-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        privacy: 'PUBLIC',
        servings: 2,
        likesCount: 0
    } as unknown as RecipeProps
];

export function useDecisionTour(
    mode: 'FATE' | 'CHEF',
    setMode: (mode: 'FATE' | 'CHEF') => void,
    expandMobile: (expanded: boolean) => void
) {
    const { t } = useLanguage();
    const { isActive, currentStepIndex, nextStep, currentTourId } = useOnboarding();
    const isDecisionTourActive = isActive && currentTourId === 'decision-maker';

    const steps: TourStep[] = useMemo(() => {
        const baseSteps: TourStep[] = [
            { targetId: 'tour-dec-header', title: t.onboarding.decision.step1_title, description: t.onboarding.decision.step1_desc },
            { targetId: 'tour-dec-mode', title: t.onboarding.decision.step2_title, description: t.onboarding.decision.step2_desc }
        ];

        if (mode === 'CHEF') {
            baseSteps.push({ targetId: 'tour-dec-inputs', title: t.onboarding.decision.step3_title, description: t.onboarding.decision.step3_desc });
        }

        baseSteps.push(
            { targetId: 'tour-dec-action', title: t.onboarding.decision.step4_title, description: t.onboarding.decision.step4_desc },
            { targetId: 'tour-dec-results', title: t.onboarding.decision.step5_title, description: t.onboarding.decision.step5_desc }
        );

        return baseSteps;
    }, [t, mode]);

    // 1. Control UI
    useEffect(() => {
        if (!isDecisionTourActive) return;

        const shouldExpand = currentStepIndex >= 1;

        if (shouldExpand) {
            setMode(mode);
            expandMobile(true);
        }
    }, [isDecisionTourActive, currentStepIndex, setMode, expandMobile, mode]);

    return {
        steps,
        isActive: isDecisionTourActive,
        currentStepIndex,
        nextStep,
        dummyRecipes: DUMMY_RECIPES
    };
}
