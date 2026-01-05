// src/components/onboarding/OnboardingContext.tsx
'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'; // ✅ Importem useCallback

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
  startTour: (steps: TourStep[], options?: { force?: boolean }) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  finishTour: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = 'triatu_recipe_editor_tour_seen';

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);

  // ✅ CORRECCIÓ CLAU: 'useCallback' evita que la funció es regeneri a cada render
  // Això trenca el bucle infinit del useEffect al RecipeEditor
  const startTour = useCallback((newSteps: TourStep[], options: { force?: boolean } = {}) => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    
    if (!hasSeen || options.force) {
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsActive(true);
    }
  }, []);

  const finishTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const nextStep = useCallback(() => {
    // Usem el callback de l'estat per tenir sempre el valor més recent
    setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
            return prev + 1;
        } else {
            finishTour(); // Si és l'últim, acabem
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