'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useDecision } from '@/context/DecisionContext';
import { RecipeGrid } from '@/features/recipes/ui/RecipeGrid';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { FateView } from './views/FateView';
import { ChefView } from './views/ChefView';
import { LoadingOverlay } from '@/components/decision/LoadingOverlay';

// ✅ Definim el tipus d'entrada per evitar errors de TypeScript
interface DecisionInput {
    dishName?: string;
}

export function IndividualDecisionForm({ userId }: { userId: string }) {
    const { t } = useLanguage();
    
    // ✅ Fem servir el Context Global (Persistència)
    const logic = useDecision();
    
    const isFate = logic.mode === 'FATE';
    const [isMobileExpanded, setIsMobileExpanded] = useState(true);

    // ✅ Lògica corregida per fer funcionar el botó del Xef
    const handleExecute = (input?: DecisionInput) => {
        let dishName = input?.dishName || '';

        // CAS 1: Mode DESTÍ (Daus) -> Si no hi ha nom, posem "Sorpresa"
        if (isFate && !dishName) {
            dishName = "Recepta Sorpresa del Xef";
        }

        // CAS 2: Mode XEF (Sliders) -> Si no hi ha nom, generem frase amb sliders
        // AQUEST ÉS EL FIX QUE FA QUE EL BOTÓ FUNCIONI
        if (!isFate && !dishName) {
            const energyLevel = logic.energy > 80 ? "Alta" : logic.energy < 30 ? "Baixa" : "Mitjana";
            dishName = `Recepta adequada per nivell d'energia ${energyLevel} i temps disponible ${logic.time} minuts`;
        }

        // Si després de tot això encara és buit, sortim (seguretat)
        if (!dishName) return;

        // Cridem al context global
        logic.generateMenu(userId, dishName);
    };

    // --- VISTA 1: RESULTATS ---
    if (logic.hasActiveResult) {
        return (
            <div className="h-full w-full flex flex-col animate-in fade-in zoom-in-95 duration-300 bg-zinc-900/90 rounded-4xl overflow-hidden border border-zinc-800">
                <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-white/5 shrink-0">
                    <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                        {isFate ? t.decision.results.fate : t.decision.results.chef}
                    </h2>
                    <Button onClick={logic.reset} variant="secondary" className="text-[10px] h-6 px-2">
                        <ArrowLeft className="w-3 h-3 mr-1" /> {t.decision.results.back}
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 min-h-0">
                    <RecipeGrid recipes={logic.recipes} userId={userId} onCancel={logic.reset} />
                </div>
            </div>
        );
    }

    // --- VISTA 2: FORMULARI ---
    return (
        <div className={`
        w-full flex flex-col bg-zinc-900/80 backdrop-blur-xl rounded-4xl border-2 border-zinc-800 shadow-2xl overflow-hidden relative transition-all duration-500 ease-in-out
        ${isMobileExpanded ? 'h-145' : 'h-14'} 
        lg:h-full lg:transition-none
    `}>
            {/* Loading Overlay Global */}
            <LoadingOverlay
                isVisible={logic.isPending}
                mode={logic.mode}
            />

            {/* Glow de fons */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] blur-[80px] rounded-full pointer-events-none transition-colors duration-500
            ${logic.error ? 'bg-red-500/20 opacity-40' : (isFate ? 'bg-emerald-500/20' : 'bg-purple-500/20')} 
            opacity-20`}
            />

            {/* HEADER */}
            <div className="h-14 shrink-0 bg-zinc-950/40 border-b border-white/5 flex items-center justify-between px-3 md:px-4 z-20">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${logic.error ? 'bg-red-900/50 text-red-200' : (isFate ? 'bg-emerald-600 text-white' : 'bg-purple-600 text-white')}`}>
                        <span className="text-lg">{logic.error ? '⚠️' : '⚡'}</span>
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

                <div className={`flex bg-black/40 p-1 rounded-lg border border-white/10 transition-opacity duration-300 ${!isMobileExpanded ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}>
                    <button onClick={() => logic.setMode('FATE')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${isFate ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                        <span>🎲</span> {t.decision.selector.fate}
                    </button>
                    <button onClick={() => logic.setMode('CHEF')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${!isFate ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                        <span>👨‍🍳</span> {t.decision.selector.chef}
                    </button>
                </div>
            </div>

            {/* COS */}
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
                        <FateView onDecide={handleExecute} isPending={logic.isPending} />
                    ) : (
                        // ✅ AQUÍ ÉS ON S'HAVIA TRENCAT, ARA ESTÀ BÉ
                        <ChefView
                            onSuggest={() => handleExecute()}
                            isPending={logic.isPending}
                            energy={logic.energy}       // Ve del context global
                            time={logic.time}           // Ve del context global
                            setEnergy={logic.setEnergy} // Ve del context global
                            setTime={logic.setTime}     // Ve del context global
                        />
                    )}
                </div>
            </div>
        </div>
    );
}