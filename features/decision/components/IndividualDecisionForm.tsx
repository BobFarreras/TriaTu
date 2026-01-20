'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useDecision } from '@/context/DecisionContext';
import { FateView } from './views/FateView';
import { ChefView } from './views/ChefView';
import { LoadingOverlay } from '@/features/decision/components/LoadingOverlay';

import { DecisionHeader } from './DecisionHeader';
import { DecisionResults } from './DecisionResults';
import { useDecisionTour } from '../hooks/useDecisionTour';
import { useOnboarding } from '@/components/onboarding/OnboardingContext';

export function IndividualDecisionForm({ userId }: { userId: string }) {
    const { t } = useLanguage();
    const logic = useDecision();
    const isFate = logic.mode === 'FATE';
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    // 1. DADES DEL TOUR
    const { isActive: isTourActive, currentStepIndex, nextStep } = useOnboarding();
    const tourData = useDecisionTour(logic.setMode, setIsMobileExpanded);

    // 2. ESTATS LOCALS
    const [simLoading, setSimLoading] = useState(false);
    const [showFakeResults, setShowFakeResults] = useState(false);

    const isLoading = logic.isPending || simLoading;

    // LOG DE DEBUG (Opcional)
    useEffect(() => {
        // console.log("🔄 [RENDER] Estat:", { isTourActive, currentStepIndex });
    }, [isTourActive, currentStepIndex]);

    // 🚑 AUTO-SIMULACIÓ (CORREGIDA PER EVITAR ERROR DE REACT)
    useEffect(() => {
        // Si estem al tour + Pas Resultats (4) + No tenim resultats
        if (isTourActive && currentStepIndex === 4 && !showFakeResults && !logic.hasActiveResult) {
            console.log("🚑 [AUTO-FIX] Forçant simulació...");
            
            // ✅ FIX: Usem un setTimeout per evitar "setState synchronously within an effect"
            const timer = setTimeout(() => {
                setSimLoading(true);
                
                // Esperem 1.5s i mostrem resultats
                setTimeout(() => {
                    setSimLoading(false);
                    setShowFakeResults(true);
                }, 1500);
            }, 0); // El 0 és suficient per trencar el cicle síncron

            return () => clearTimeout(timer);
        }
    }, [isTourActive, currentStepIndex, showFakeResults, logic.hasActiveResult]);


    // 3. HANDLE EXECUTE (PER SI CLICA EL BOTÓ REAL)
    const handleExecute = (dishNameOverride?: string) => {
        console.log("🔥 [CLICK] Botó apretat!");

        // Si estem al pas del botó (3), simulem
        if (isTourActive && currentStepIndex === 3) {
            console.log("🤡 [LOGIC] Simulació per click...");
            setSimLoading(true);
            setTimeout(() => {
                setSimLoading(false);
                setShowFakeResults(true);
                // Avancem manualment al següent pas
                setTimeout(() => nextStep(), 200);
            }, 2000);
            return; 
        }

        // LÒGICA REAL
        console.log("🚀 [LOGIC] Lògica REAL.");
        let dishName = dishNameOverride || '';
        if (isFate && !dishName) dishName = "Recepta Sorpresa del Xef";
        
        if (!isFate && !dishName) {
            const energyLevel = logic.energy > 80 ? "Alta" : logic.energy < 30 ? "Baixa" : "Mitjana";
            dishName = `Recepta adequada per nivell d'energia ${energyLevel} i temps disponible ${logic.time} minuts`;
        }
        if (dishName) logic.generateMenu(userId, dishName);
    };

    const closeDemo = () => setShowFakeResults(false);

    // --- RENDERITZAT ---

    if (logic.hasActiveResult || showFakeResults) {
        return (
            <DecisionResults
                title={showFakeResults ? "RESULTATS DE PROVA 🧪" : (isFate ? t.decision.results.fate : t.decision.results.chef)}
                recipes={showFakeResults ? tourData.dummyRecipes : logic.recipes}
                userId={userId}
                onBack={showFakeResults ? closeDemo : logic.reset}
                tourSteps={tourData.steps}
            />
        );
    }

    return (
        <div className={`
            w-full flex flex-col bg-zinc-900/80 backdrop-blur-xl rounded-4xl border-2 border-zinc-800 shadow-2xl overflow-hidden relative transition-all duration-500 ease-in-out
            ${isMobileExpanded ? 'h-145' : 'h-14'} 
            lg:h-full lg:transition-none
        `}>
            
            <LoadingOverlay isVisible={isLoading} mode={logic.mode} />

            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] blur-[80px] rounded-full pointer-events-none transition-colors duration-500
                ${logic.error ? 'bg-red-500/20 opacity-40' : (isFate ? 'bg-emerald-500/20' : 'bg-purple-500/20')} 
                opacity-20`}
            />

            <DecisionHeader 
                mode={logic.mode}
                setMode={logic.setMode}
                error={logic.error}
                isMobileExpanded={isMobileExpanded}
                setIsMobileExpanded={setIsMobileExpanded}
                tourSteps={tourData.steps}
            />

            <div className={`flex-1 flex flex-col p-4 md:p-6 z-10 min-h-0 transition-opacity duration-300 ${!isMobileExpanded ? 'opacity-0 lg:opacity-100' : 'opacity-100'}`}>
                
                <div className="flex-1 flex flex-col items-center justify-center min-h-0 text-center">
                     <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                        <div className="text-6xl md:text-7xl mb-3 filter drop-shadow-2xl key={logic.mode} select-none">
                            {isFate ? <span className="animate-bounce inline-block">🎲</span> : <span className="animate-pulse inline-block">👨‍🍳</span>}
                        </div>
                        <h3 className="text-lg font-black text-white leading-tight mb-1">
                            {isFate ? t.decision.states.fate_title : t.decision.states.chef_title}
                        </h3>
                        <p className="text-[11px] text-slate-400 max-w-55 leading-tight">
                            {isFate ? t.decision.states.fate_desc : t.decision.states.chef_desc}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 w-full mt-2 relative z-40">
                    {isFate ? (
                        <FateView onDecide={() => handleExecute()} isPending={isLoading} />
                    ) : (
                        <ChefView
                            onSuggest={() => handleExecute()}
                            isPending={isLoading}
                            energy={logic.energy}
                            time={logic.time}
                            setEnergy={logic.setEnergy}
                            setTime={logic.setTime}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
