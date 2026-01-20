// src/features/rooms/hooks/useRoomTour.ts
'use client';

import { useMemo, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';

export function useRoomTour() {
    const { t } = useLanguage();
    // ✅ Exportem tot el que necessitem per la lògica de simulació
    const { startTour, isActive, currentStepIndex, nextStep } = useOnboarding();

    const steps: TourStep[] = useMemo(() => [
        { 
            targetId: 'tour-room-header', 
            title: t.onboarding.room.step1_title, 
            description: t.onboarding.room.step1_desc 
        },
        { 
            targetId: 'tour-room-mode-switch', 
            title: t.onboarding.room.step_mode_title, 
            description: t.onboarding.room.step_mode_desc 
        },
        // Pas 2: Input (Aquí simularem escriure)
        { 
            targetId: 'tour-room-input', 
            title: t.onboarding.room.step_input_title, 
            description: t.onboarding.room.step_input_desc 
        },
        // Pas 3: Candidats (Aquí veurem el resultat d'afegir)
        { 
            targetId: 'tour-room-candidates', 
            title: t.onboarding.room.step_candidates_title, 
            description: t.onboarding.room.step_candidates_desc 
        },
        // Pas 4: Action (Aquí simularem el click final)
        { 
            targetId: 'tour-room-action', 
            title: t.onboarding.room.step_action_title, 
            description: t.onboarding.room.step_action_desc 
        },
        { 
            targetId: 'tour-room-history', 
            title: t.onboarding.room.step4_title, 
            description: t.onboarding.room.step4_desc 
        }
    ], [t]);

    // Inici automàtic (amb force: false per producció, true per dev)
    useEffect(() => {
        startTour('room-guide', steps);
    }, [startTour, steps]);

    return { steps, isActive, currentStepIndex, nextStep };
}