// src/features/decision/ui/components/DecisionResults.tsx
'use client';


import { RecipeGrid } from '@/features/recipes/ui/RecipeGrid';
import { RecipeProps } from '@/core/domain/entities/Recipe';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { TourStep } from '@/components/onboarding/OnboardingContext';


interface Props {
    title: string;
    recipes: RecipeProps[];
    userId: string;
    onBack: () => void;
    tourSteps: TourStep[];
}

export function DecisionResults({ title, recipes, userId, onBack, tourSteps }: Props) {


    return (
        // ✅ AQUEST ID ÉS CRUCIAL
        <div id="tour-dec-results" className="h-full w-full flex flex-col animate-in fade-in zoom-in-95 duration-300 bg-zinc-900/90 rounded-4xl overflow-hidden border border-zinc-800 relative">


            <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-white/5 shrink-0">
                <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                    {title}
                </h2>
                <TourTrigger tourId="decision-maker" steps={tourSteps} />
            </div>

            <div className="flex-1 overflow-y-auto p-2 min-h-0">
                <RecipeGrid recipes={recipes} userId={userId} onCancel={onBack} />
            </div>
        </div>
    );
}