// src/features/decision/ui/components/DecisionResults.tsx
'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RecipeGrid } from '@/features/recipes/ui/RecipeGrid';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { TourStep } from '@/components/onboarding/OnboardingContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
    title: string;
    recipes: RecipeProps[];
    userId: string;
    onBack: () => void;
    tourSteps: TourStep[];
}

export function DecisionResults({ title, recipes, userId, onBack, tourSteps }: Props) {
    const { t } = useLanguage();

  return (
        // ✅ AQUEST ID ÉS CRUCIAL
        <div id="tour-dec-results" className="h-full w-full flex flex-col animate-in fade-in zoom-in-95 duration-300 bg-zinc-900/90 rounded-4xl overflow-hidden border border-zinc-800 relative">
            
            <div className="absolute top-2 right-12 z-50">
                <TourTrigger tourId="decision-maker" steps={tourSteps} />
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-white/5 shrink-0">
                <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                    {title}
                </h2>
                <Button onClick={onBack} variant="secondary" className="text-[10px] h-6 px-2">
                    <ArrowLeft className="w-3 h-3 mr-1" /> {t.decision.results.back}
                </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 min-h-0">
                <RecipeGrid recipes={recipes} userId={userId} onCancel={onBack} />
            </div>
        </div>
    );
}