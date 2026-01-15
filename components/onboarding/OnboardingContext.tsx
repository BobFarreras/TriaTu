'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  requiredTab?: 'ingredients' | 'steps' | 'meta';
}

interface OnboardingContextType {
  isActive: boolean;
  currentStepIndex: number;
  steps: TourStep[];
  startTour: (tourId: string, steps: TourStep[], options?: { force?: boolean }) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  finishTour: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  
  // Guardem quin tour estem fent per poder marcar-lo com a vist
  const [currentTourId, setCurrentTourId] = useState<string>('');

  const startTour = useCallback((tourId: string, newSteps: TourStep[], options: { force?: boolean } = {}) => {
    // Generem una clau única per aquest tour (ex: triatu_tour_seen_profile-setup)
    const storageKey = `triatu_tour_seen_${tourId}`;
    const hasSeen = localStorage.getItem(storageKey);
    
    // Si no l'hem vist mai, o si forcem (per proves), l'arranquem
    if (!hasSeen || options.force) {
        setCurrentTourId(tourId);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsActive(true);
    }
  }, []);

  // ✅ Aquesta funció tanca el tour i GUANDA LA PREFERÈNCIA
  const finishTour = useCallback(() => {
    setIsActive(false);
    
    if (currentTourId) {
        // Guardem al navegador que aquest tour ja s'ha fet (o tancat)
        localStorage.setItem(`triatu_tour_seen_${currentTourId}`, 'true');
        console.log(`✅ [Onboarding] Tour '${currentTourId}' marcat com a vist.`);
    }
    
    // Resetegem per netejar
    setCurrentTourId('');
    setSteps([]);
    setCurrentStepIndex(0);
  }, [currentTourId]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
            return prev + 1;
        } else {
            finishTour(); // Si és l'últim pas, acabem i guardem
            return prev;
        }
    });
  }, [steps.length, finishTour]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  // ✅ QUAN FEM CLICK A LA 'X'
  const skipTour = useCallback(() => {
    // Cridem a finishTour(), així que TAMBÉ ES GUARDA al localStorage
    finishTour();
  }, [finishTour]);

  return (
    <OnboardingContext.Provider value={{
      isActive,
      currentStepIndex,
      steps,
      startTour,
      nextStep,
      prevStep,
      skipTour,
      finishTour
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}