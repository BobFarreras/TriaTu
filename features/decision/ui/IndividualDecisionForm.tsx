'use client';

import { useIndividualDecision } from '../logic/useIndividualDecision';
import { RecipeGrid } from '@/features/recipes/ui/RecipeGrid';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { FateView } from './views/FateView';
import { ChefView } from './views/ChefView';

export function IndividualDecisionForm({ userId }: { userId: string }) {
  const logic = useIndividualDecision(userId);
  const isFate = logic.mode === 'FATE';

  // --- VISTA 1: RESULTATS ---
  if (logic.showResults) {
    return (
      <div className="h-full w-full flex flex-col animate-in fade-in zoom-in-95 duration-300 bg-zinc-900/90 rounded-[2rem] overflow-hidden border border-zinc-800">
          <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-white/5 shrink-0">
             <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                {isFate ? '🎲 Resultat' : '👨‍🍳 Propostes'}
             </h2>
             <Button onClick={logic.reset} variant="secondary" className="text-[10px] h-6 px-2">
                <ArrowLeft className="w-3 h-3 mr-1"/> Tornar
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
    <div className="w-full h-full flex flex-col bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] border-2 border-zinc-800 shadow-2xl overflow-hidden relative transition-all">
        
        {/* Glow de fons (Canvia a Vermell si hi ha error) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] blur-[80px] rounded-full pointer-events-none transition-colors duration-500
            ${logic.error ? 'bg-red-500/20 opacity-40' : (isFate ? 'bg-emerald-500/20' : 'bg-purple-500/20')} 
            opacity-20`} 
        />

        {/* 1. HEADER INTEGRAT */}
        <div className="h-14 shrink-0 bg-zinc-950/40 border-b border-white/5 flex items-center justify-between px-3 md:px-4 z-20">
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${logic.error ? 'bg-red-900/50 text-red-200' : (isFate ? 'bg-emerald-600 text-white' : 'bg-purple-600 text-white')}`}>
                    <span className="text-lg">{logic.error ? '⚠️' : '⚡'}</span>
                </div>
                <span className="hidden sm:block font-black text-white text-xs uppercase tracking-wide">Mode Ràpid</span>
            </div>

            {/* SELECTOR (Desactivat si hi ha error visualment, o el deixem actiu per canviar) */}
            <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                <button
                    onClick={() => logic.setMode('FATE')}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all
                        ${isFate ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    <span>🎲</span> DESTÍ
                </button>
                <button
                    onClick={() => logic.setMode('CHEF')}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all
                        ${!isFate ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    <span>👨‍🍳</span> XEF
                </button>
            </div>
        </div>

        {/* 2. COS PRINCIPAL */}
        <div className="flex-1 flex flex-col p-4 md:p-6 z-10 min-h-0">
            
            {/* ZONA CENTRAL: CONDICIONAL (EMOJI vs ERROR) */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 text-center">
                
                {logic.error ? (
                    // --- ESTAT D'ERROR (Substitueix l'Emoji) ---
                    <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                        <div className="text-6xl md:text-7xl mb-3 filter drop-shadow-2xl animate-shake select-none">
                            🚫
                        </div>
                        <h3 className="text-lg font-black text-red-400 leading-tight mb-2">
                            Ups! Alguna cosa ha fallat
                        </h3>
                        <div className="bg-red-950/50 border border-red-500/20 p-3 rounded-xl max-w-[260px]">
                             <p className="text-xs text-red-200 font-medium leading-relaxed">
                                {logic.error}
                             </p>
                        </div>
                    </div>
                ) : (
                    // --- ESTAT NORMAL (Emoji + Text) ---
                    <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                        <div className="text-6xl md:text-7xl mb-3 filter drop-shadow-2xl key={logic.mode} select-none">
                            {isFate ? (
                                <span className="animate-bounce inline-block">🎲</span>
                            ) : (
                                <span className="animate-pulse inline-block">👨‍🍳</span>
                            )}
                        </div>
                        <h3 className="text-lg font-black text-white leading-tight mb-1">
                            {isFate ? "Avui cuina la sort" : "Menú Intel·ligent"}
                        </h3>
                        <p className="text-[11px] text-slate-400 max-w-55 leading-tight">
                            {isFate 
                                ? "Deixa la ment en blanc. Triarem per tu." 
                                : "Analitzem el teu inventari per suggerir plats."}
                        </p>
                    </div>
                )}
            </div>

            {/* ZONA INFERIOR: Controls */}
            <div className="shrink-0 w-full mt-2">
                {isFate ? (
                    <FateView onDecide={logic.executeAction} isPending={logic.isPending} />
                ) : (
                    <ChefView 
                        onSuggest={logic.executeAction} 
                        isPending={logic.isPending}
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