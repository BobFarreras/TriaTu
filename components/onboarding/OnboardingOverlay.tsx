'use client'

import { useEffect, useState } from 'react';
import { useOnboarding } from './OnboardingContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';

// Definim el tipus per evitar errors
interface CardStyle {
  top: number | string;
  left: number | string;
  x: number | string;
  y: number | string;
  width: string;
  maxWidth: string;
  position: 'absolute' | 'fixed'; // Canvi important: a vegades volem fixed
}

export function OnboardingOverlay() {
  const { isActive, steps, currentStepIndex, nextStep, prevStep, skipTour } = useOnboarding();
  const { t } = useLanguage();
  
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

  const currentStep = steps[currentStepIndex];

  // 1. Detectar posició i mida finestra
  useEffect(() => {
    if (!isActive || !currentStep) return;

    const updatePosition = () => {
      // Actualitzem mida finestra per càlculs
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });

      const element = document.getElementById(currentStep.targetId);
      if (element) {
        // Fem scroll suau fins l'element
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Esperem una mica a que acabi l'scroll per agafar la posició final
        setTimeout(() => {
            const rect = element.getBoundingClientRect();
            setTargetRect(rect);
        }, 100);
      } else {
        setTargetRect(null); 
      }
    };

    const timeout = setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, currentStepIndex, currentStep]);

  if (!isActive || !currentStep) return null;

  // --- LÒGICA DE POSICIONAMENT: "SEMPRE LLEGIBLE" 🧠 ---

  const isMobile = windowSize.w > 0 && windowSize.w < 768;
  
  // ESTAT BASE: CENTRAT AL MIG DE LA PANTALLA (Garanteix lectura)
  let cardStyles: CardStyle = {
    position: 'fixed', // Fixed fa que no depengui de l'scroll, sempre al mig visual
    top: '50%',
    left: '50%',
    x: '-50%',
    y: '-50%',
    width: '90%',
    maxWidth: '400px'
  };

  // NOMÉS en Desktop i si tenim lloc, intentem ser elegants i posar-ho al costat.
  // En mòbil, mantenim el "Fixed Center" perquè és el més segur.
  if (!isMobile && targetRect && windowSize.h > 0) {
     const spaceAbove = targetRect.top;
     const spaceBelow = windowSize.h - targetRect.bottom;
     const CARD_HEIGHT = 220; 

     // Si tenim espai a SOTA, ho posem a sota (relatiu a l'element)
     if (spaceBelow > CARD_HEIGHT) {
        cardStyles = {
            position: 'absolute', // Absolute per seguir l'element si es mou
            top: targetRect.bottom + 20,
            left: Math.max(20, Math.min(targetRect.left, windowSize.w - 380)),
            x: 0,
            y: 0,
            width: '380px',
            maxWidth: '380px'
        };
     } 
     // Si tenim espai a SOBRE, ho posem a sobre
     else if (spaceAbove > CARD_HEIGHT) {
        cardStyles = {
            position: 'absolute',
            top: targetRect.top - 20,
            left: Math.max(20, Math.min(targetRect.left, windowSize.w - 380)),
            x: 0,
            y: '-100%',
            width: '380px',
            maxWidth: '380px'
        };
     }
     // Si no hi ha espai ni a sobre ni a sota... es queda amb el valor per defecte (CENTRAT)
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
      
      {/* 1. FOCUS (SPOTLIGHT) */}
      <motion.div
        className="absolute rounded-xl pointer-events-none transition-all duration-500 ease-in-out box-content border-4 border-purple-500/50"
        initial={false}
        animate={{
          top: targetRect ? targetRect.top - 4 : '50%',
          left: targetRect ? targetRect.left - 4 : '50%',
          width: targetRect ? targetRect.width + 8 : 0,
          height: targetRect ? targetRect.height + 8 : 0,
          opacity: targetRect ? 1 : 0,
          boxShadow: `0 0 0 9999px rgba(2, 6, 23, 0.85)` 
        }}
      />

      {/* 2. LA TARGETA EXPLICATIVA */}
      <AnimatePresence mode='wait'>
        <motion.div
            key={currentStepIndex}
            className="pointer-events-auto z-10000" // Z-index extra alt
            
            // Apliquem l'estil (fixed o absolute segons el cas)
            style={{ 
                position: cardStyles.position as any, 
                width: cardStyles.width, 
                maxWidth: cardStyles.maxWidth 
            }}

            initial={{ opacity: 0, scale: 0.9, x: cardStyles.x, y: cardStyles.y }}
            animate={{ 
                opacity: 1,
                scale: 1,
                top: cardStyles.top,
                left: cardStyles.left,
                x: cardStyles.x,
                y: cardStyles.y
            }}
            exit={{ opacity: 0, scale: 0.95 }}
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
                <div className="mb-6 pr-6">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-purple-200">
                        <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg shadow-purple-500/30 shrink-0">
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
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentStepIndex ? 'bg-purple-500 scale-125' : 'bg-slate-700'}`} 
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
      </AnimatePresence>
    </div>
  );
}