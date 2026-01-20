// src/features/decision/components/DecisionHeader.tsx
'use client';

import { ChevronDown } from 'lucide-react';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { TourStep } from '@/components/onboarding/OnboardingContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
    mode: 'FATE' | 'CHEF';
    setMode: (m: 'FATE' | 'CHEF') => void;
    error: string | null;
    isMobileExpanded: boolean;
    setIsMobileExpanded: (v: boolean) => void;
    tourSteps: TourStep[];
}

export function DecisionHeader({ mode, setMode, error, isMobileExpanded, setIsMobileExpanded, tourSteps }: Props) {
    const { t } = useLanguage();
    const isFate = mode === 'FATE';

    return (
        <div id="tour-dec-header" className="h-14 shrink-0 bg-zinc-950/40 border-b border-white/5 flex items-center justify-between px-3 md:px-4 z-20">
            
            {/* ESQUERRA: Icona + Toggle Mòbil */}
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${error ? 'bg-red-900/50 text-red-200' : (isFate ? 'bg-emerald-600 text-white' : 'bg-purple-600 text-white')}`}>
                    <span className="text-lg">{error ? '⚠️' : '⚡'}</span>
                </div>
                <button
                    onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                    className="lg:hidden flex items-center gap-2 group text-left outline-none"
                >
                    <span className="font-black text-white text-xs uppercase tracking-wide">
                        {isMobileExpanded ? t.decision.mobile.fast_mode : t.decision.mobile.actions}
                    </span>
                    <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-300 ${isMobileExpanded ? 'rotate-180' : ''} group-active:scale-90`} />
                </button>
                <span className="hidden lg:block font-black text-white text-xs uppercase tracking-wide">
                    {t.decision.mobile.fast_mode}
                </span>
            </div>

            {/* DRETA: Selector + Tour */}
            <div className="flex items-center gap-2">
                
                {/* SELECTOR */}
                <div id="tour-dec-mode" className={`flex bg-black/40 p-1 rounded-lg border border-white/10 transition-opacity duration-300 ${!isMobileExpanded ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}>
                    <button onClick={() => setMode('FATE')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${isFate ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                        <span>🎲</span> {t.decision.selector.fate}
                    </button>
                    <button onClick={() => setMode('CHEF')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${!isFate ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                        <span>👨‍🍳</span> {t.decision.selector.chef}
                    </button>
                </div>

                {/* TOUR TRIGGER */}
                <div className={`${!isMobileExpanded ? 'opacity-0 pointer-events-none lg:opacity-100' : 'opacity-100'} transition-opacity`}>
                    <TourTrigger 
                        tourId="decision-maker" 
                        steps={tourSteps} 
                        className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                    />
                </div>
            </div>
        </div>
    );
}
