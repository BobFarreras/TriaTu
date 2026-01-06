'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useDecision } from '@/context/DecisionContext';
import { FateView } from './views/FateView';
import { ChefView } from './views/ChefView';
import { LoadingOverlay } from '@/components/decision/LoadingOverlay';

import { DecisionHeader } from './components/DecisionHeader';
import { DecisionResults } from './components/DecisionResults';
import { useDecisionTour } from './components/useDecisionTour';

export function IndividualDecisionForm({ userId }: { userId: string }) {
    const { t } = useLanguage();
    const logic = useDecision();
    const isFate = logic.mode === 'FATE';
    const [isMobileExpanded, setIsMobileExpanded] = useState(true);

    const tour = useDecisionTour(
        logic.mode,
        logic.setMode,
        isMobileExpanded,
        setIsMobileExpanded
    );

    const isLoading = logic.isPending || tour.isSimulatingLoading;

    // ✅ LOG 1: VERIFICAR SI ARRIBA EL CLIC
    const handleExecute = (dishNameOverride?: string) => {
        console.log("👆 [FORM] BOTÓ CLICAT! Iniciant lògica...");

        const realExecution = () => {
            console.log("🚀 [FORM] Execució REAL (sense tour)");
            let dishName = dishNameOverride || '';
            if (isFate && !dishName) dishName = "Recepta Sorpresa del Xef";

            if (!isFate && !dishName) {
                const energyLevel = logic.energy > 80 ? "Alta" : logic.energy < 30 ? "Baixa" : "Mitjana";
                dishName = `Recepta adequada per nivell d'energia ${energyLevel} i temps disponible ${logic.time} minuts`;
            }
            if (dishName) logic.generateMenu(userId, dishName);
        };

        // Passem el control al Hook del Tour
        tour.interceptExecution(realExecution);
    };

    // VISTA RESULTATS
    if (logic.hasActiveResult || tour.demoMode) {
        return (
            <DecisionResults
                title={tour.demoMode ? "RESULTATS DE PROVA 🧪" : (isFate ? t.decision.results.fate : t.decision.results.chef)}
                recipes={tour.demoMode ? tour.dummyRecipes : logic.recipes}
                userId={userId}
                onBack={tour.demoMode ? tour.closeDemo : logic.reset}
                tourSteps={tour.steps}
            />
        );
    }

    // VISTA FORMULARI
    return (
        <div className={`
            w-full flex flex-col bg-zinc-900/80 backdrop-blur-xl rounded-4xl border-2 border-zinc-800 shadow-2xl overflow-hidden relative transition-all duration-500 ease-in-out
            ${isMobileExpanded ? 'h-145' : 'h-14'} 
            lg:h-full lg:transition-none
        `}>

            {/* ✅ IMPORTANT: Això és el que fa que es vegi el loading */}
            <LoadingOverlay isVisible={isLoading} mode={logic.mode} />

            {/* Fons Glow */}
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
                tourSteps={tour.steps}
            />

            <div className={`flex-1 flex flex-col p-4 md:p-6 z-10 min-h-0 transition-opacity duration-300 ${!isMobileExpanded ? 'opacity-0 lg:opacity-100' : 'opacity-100'}`}>

                <div className="flex-1 flex flex-col items-center justify-center min-h-0 text-center">
                    
                    {logic.error ? (
                        <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                            <div className="text-6xl md:text-7xl mb-3 filter drop-shadow-2xl animate-shake select-none">🚫</div>
                            <h3 className="text-lg font-black text-red-400 leading-tight mb-2">{t.decision.states.error_title}</h3>
                            <div className="bg-red-950/50 border border-red-500/20 p-3 rounded-xl max-w-65">
                                <p className="text-xs text-red-200 font-medium leading-relaxed">{logic.error}</p>
                            </div>
                        </div>
                    ) : (
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
                    )}
                </div>

                <div className="shrink-0 w-full mt-2">
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