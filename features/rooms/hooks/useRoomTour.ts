// src/features/rooms/hooks/useRoomTour.ts
'use client';

import { useMemo, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';

interface RoomTourOptions {
    includeSettingsStep?: boolean;
}

export function useRoomTour(options: RoomTourOptions = {}) {
    const { t } = useLanguage();
    // ✅ Exportem tot el que necessitem per la lògica de simulació
    const { startTour, isActive, currentStepIndex, nextStep } = useOnboarding();
    const isE2E = process.env.NEXT_PUBLIC_E2E === 'true';
    const includeSettingsStep = options.includeSettingsStep ?? false;

    const steps: TourStep[] = useMemo(() => {
        const baseSteps: TourStep[] = [
            { 
                targetId: 'tour-room-header', 
                title: t.onboarding.room.step1_title, 
                description: t.onboarding.room.step1_desc 
            }
        ];

        if (includeSettingsStep) {
            baseSteps.push({
                targetId: 'tour-room-settings',
                title: t.onboarding.room.step_settings_title,
                description: t.onboarding.room.step_settings_desc
            });
        }

        baseSteps.push(
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
        );

        return baseSteps;
    }, [includeSettingsStep, t]);

    // Inici automàtic (amb force: false per producció, true per dev)
    useEffect(() => {
        if (!isE2E) {
            startTour('room-guide', steps);
        }
    }, [startTour, steps, isE2E]);

    return { steps, isActive, currentStepIndex, nextStep };
}
