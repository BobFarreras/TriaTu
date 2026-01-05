'use client'

import { useEffect, useState } from 'react';
import { useOnboarding } from './OnboardingContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion} from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';

export function OnboardingOverlay() {
  // ✅ CORRECCIÓ: Traiem 'finishTour' perquè no l'usem directament (nextStep ja ho gestiona al final)
  const { isActive, steps, currentStepIndex, nextStep, prevStep, skipTour } = useOnboarding();
  const { t } = useLanguage();
  
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  
  // ✅ CORRECCIÓ: Traiem 'isCalculated' si no l'usem per a res crític visualment ara mateix

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (!isActive || !currentStep) return;

    const updatePosition = () => {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null); 
      }
    };

    const timeout = setTimeout(updatePosition, 300);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, currentStepIndex, currentStep]);

  if (!isActive || !currentStep) return null;

  // Lògica de posició centralitzada
  const isCentered = !targetRect;

  // Càlcul de posició de la targeta (Card)
  // Si tenim target, la posem a sota o a sobre. Si no, al mig.
  let cardTop: number | string = '50%';
  let cardLeft: number | string = '50%';
  let cardX: number | string = '-50%';
  let cardY: number | string = '-50%';

  if (targetRect) {
     const spaceBelow = window.innerHeight - targetRect.bottom;
     const showBelow = spaceBelow > 200; // Si hi ha espai a sota, millor a sota

     cardTop = showBelow ? targetRect.bottom + 20 : targetRect.top - 20;
     cardLeft = Math.max(20, Math.min(targetRect.left, window.innerWidth - 340));
     
     // Si tenim target, resetegem les transformacions percentuals i usem px
     cardX = 0;
     // Si la mostrem a sobre (showBelow false), hem de moure-la cap amunt (-100%)
     cardY = showBelow ? 0 : '-100%';
  }

  return (
    <div className="fixed inset-0 z-9999 overflow-hidden pointer-events-none">
      
      {/* 1. FOCUS (SPOTLIGHT) - EL FORAT DE LLUM */}
      <motion.div
        className="absolute rounded-xl pointer-events-none transition-all duration-500 ease-in-out box-content border-4 border-purple-500/50"
        initial={false}
        animate={{
          top: targetRect ? targetRect.top - 4 : '50%',
          left: targetRect ? targetRect.left - 4 : '50%',
          width: targetRect ? targetRect.width + 8 : 0,
          height: targetRect ? targetRect.height + 8 : 0,
          // Ombra gegant que fa de fons fosc
          boxShadow: `0 0 0 9999px rgba(2, 6, 23, 0.85)` 
        }}
      />

      {/* 2. LA TARGETA EXPLICATIVA (La "Vinyeta") */}
      <motion.div
        className="absolute pointer-events-auto w-[90%] max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        // ✅ CORRECCIÓ: Unifiquem totes les propietats d'animació aquí sense duplicats
        animate={{ 
          opacity: 1,
          top: cardTop,
          left: cardLeft,
          x: cardX,
          y: cardY
        }}
        transition={{ duration: 0.4, type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="bg-slate-900 border border-slate-700 text-white p-5 rounded-2xl shadow-2xl relative">
            
            {/* Botó tancar */}
            <button 
                onClick={skipTour} 
                className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
                title={t.onboarding.buttons.skip}
            >
                <X size={16} />
            </button>

            {/* Contingut */}
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <span className="bg-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg shadow-purple-500/30">
                        {currentStepIndex + 1}
                    </span>
                    {currentStep.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                    {currentStep.description}
                </p>
            </div>

            {/* Navegació */}
            <div className="flex justify-between items-center">
                <div className="flex gap-1.5">
                    {steps.map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentStepIndex ? 'bg-purple-500' : 'bg-slate-700'}`} 
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    {currentStepIndex > 0 && (
                        <button 
                            onClick={prevStep}
                            className="px-3 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            {t.onboarding.buttons.back}
                        </button>
                    )}

                    <button 
                        onClick={nextStep}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20 transition-all active:scale-95"
                    >
                        {currentStepIndex === steps.length - 1 ? (
                             <> {t.onboarding.buttons.finish} <Check size={16} /> </>
                        ) : (
                             <> {t.onboarding.buttons.next} <ChevronRight size={16} /> </>
                        )}
                    </button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}