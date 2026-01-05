'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  requiredTab?: 'ingredients' | 'steps';
}

interface OnboardingContextType {
  isActive: boolean;
  currentStepIndex: number;
  steps: TourStep[];
  // ✅ MODIFICACIÓ: Ara demanem un ID de tour
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
  
  // ✅ NOU ESTAT: Per saber quin tour estem fent actualment
  const [currentTourId, setCurrentTourId] = useState<string>('');

  const startTour = useCallback((tourId: string, newSteps: TourStep[], options: { force?: boolean } = {}) => {
    // Generem una clau única per aquest tour
    const storageKey = `triatu_tour_seen_${tourId}`;
    const hasSeen = localStorage.getItem(storageKey);
    
    if (!hasSeen || options.force) {
        setCurrentTourId(tourId); // Guardem quin tour és
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsActive(true);
    }
  }, []);

  const finishTour = useCallback(() => {
    setIsActive(false);
    if (currentTourId) {
        // ✅ Guardem només EL TOUR ACTUAL com a vist
        localStorage.setItem(`triatu_tour_seen_${currentTourId}`, 'true');
    }
  }, [currentTourId]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
            return prev + 1;
        } else {
            finishTour();
            return prev;
        }
    });
  }, [steps.length, finishTour]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const skipTour = useCallback(() => {
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