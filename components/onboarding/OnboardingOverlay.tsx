'use client'

import { useEffect, useState } from 'react';
import { useOnboarding } from './OnboardingContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';

interface CardStyle {
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  x?: number | string;
  y?: number | string;
  width?: string;
  maxWidth?: string;
  position: 'absolute' | 'fixed';
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
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });

      const element = document.getElementById(currentStep.targetId);
      if (element) {
        // En mòbil preferim 'center' per tenir-lo a la vista, 
        // la nostra nova lògica s'apartarà d'ell.
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            const rect = element.getBoundingClientRect();
            setTargetRect(rect);
        }, 150);
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

  // --- LÒGICA DE POSICIONAMENT INTEL·LIGENT (MOBILE & DESKTOP) 🧠 ---

  const isMobile = windowSize.w > 0 && windowSize.w < 768;
  
  // 1. ESTAT BASE (Fallback segur: Fixat a baix)
  let cardStyles: CardStyle = {
    position: 'fixed',
    top: 'auto',
    bottom: 24, 
    left: '50%',
    x: '-50%',
    y: 0,
    width: '90%',
    maxWidth: '400px'
  };

  if (targetRect && windowSize.h > 0) {
     
     // --- LÒGICA MÒBIL: HEMISFERI OPOSAT ---
     if (isMobile) {
        const elementCenterY = targetRect.top + (targetRect.height / 2);
        const screenCenterY = windowSize.h / 2;

        // Si l'element està a la meitat INFERIOR de la pantalla (> centre)
        if (elementCenterY > screenCenterY) {
            // Posem la targeta a DALT
            cardStyles = {
                position: 'fixed',
                top: 24,      // Marge superior
                bottom: 'auto',
                left: '50%',
                x: '-50%',
                y: 0,
                width: '90%',
                maxWidth: '400px'
            };
        } else {
            // Si l'element està a la meitat SUPERIOR (< centre)
            // Posem la targeta a BAIX (lògica per defecte, però explicita aquí)
            cardStyles = {
                position: 'fixed',
                top: 'auto',
                bottom: 24,   // Marge inferior
                left: '50%',
                x: '-50%',
                y: 0,
                width: '90%',
                maxWidth: '400px'
            };
        }
     } 
     
     // --- LÒGICA DESKTOP: SPOTLIGHT ADAPTATIU ---
     else {
        const spaceAbove = targetRect.top;
        const spaceBelow = windowSize.h - targetRect.bottom;
        const CARD_HEIGHT = 220; 

        // Si tenim espai a SOTA -> Absolute a sota
        if (spaceBelow > CARD_HEIGHT) {
            cardStyles = {
                position: 'absolute',
                top: targetRect.bottom + 20,
                bottom: 'auto',
                left: Math.max(20, Math.min(targetRect.left, windowSize.w - 380)),
                x: 0,
                y: 0,
                width: '380px',
                maxWidth: '380px'
            };
        } 
        // Si tenim espai a SOBRE -> Absolute a sobre
        else if (spaceAbove > CARD_HEIGHT) {
            cardStyles = {
                position: 'absolute',
                top: targetRect.top - 20,
                bottom: 'auto',
                left: Math.max(20, Math.min(targetRect.left, windowSize.w - 380)),
                x: 0,
                y: '-100%',
                width: '380px',
                maxWidth: '380px'
            };
        }
        // Si no hi cap enlloc (rar en desktop) -> Es queda fixed center o bottom (fallback)
     }
  }

  return (
    <div className="fixed inset-0 z-9999 overflow-hidden pointer-events-none">
      
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
            className="pointer-events-auto z-10000"
            
            style={{ 
                position: cardStyles.position, 
                width: cardStyles.width, 
                maxWidth: cardStyles.maxWidth,
                // Apliquem top/bottom dinàmicament
                top: cardStyles.top,
                bottom: cardStyles.bottom,
                left: cardStyles.left,
                right: cardStyles.right
            }}

            initial={{ opacity: 0, scale: 0.9, x: cardStyles.x, y: cardStyles.y }}
            animate={{ 
                opacity: 1,
                scale: 1,
                // Necessitem passar explícitament top/bottom a l'animate per suavitzar canvis
                top: cardStyles.top,
                bottom: cardStyles.bottom,
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