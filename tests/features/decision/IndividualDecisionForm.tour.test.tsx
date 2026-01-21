import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IndividualDecisionForm } from '@/features/decision/components/IndividualDecisionForm';

const setMode = vi.fn();
const setEnergy = vi.fn();
const setTime = vi.fn();
const generateMenu = vi.fn();
const reset = vi.fn();

vi.mock('@/lib/i18n/LanguageContext', () => ({
  useLanguage: () => ({
    t: {
      decision: {
        results: { fate: 'FATE', chef: 'CHEF' },
        states: {
          fate_title: 'Fate title',
          fate_desc: 'Fate desc',
          chef_title: 'Chef title',
          chef_desc: 'Chef desc'
        },
        mobile: { fast_mode: 'Fast', actions: 'Actions' },
        selector: { fate: 'Fate', chef: 'Chef' },
        actions: { surprise_me: 'Surprise', generate_menu: 'Generate' }
      },
      onboarding: {
        decision: {
          step1_title: 's1',
          step1_desc: 's1d',
          step2_title: 's2',
          step2_desc: 's2d',
          step3_title: 's3',
          step3_desc: 's3d',
          step4_title: 's4',
          step4_desc: 's4d',
          step5_title: 's5',
          step5_desc: 's5d'
        }
      }
    }
  })
}));

vi.mock('@/context/DecisionContext', () => ({
  useDecision: () => ({
    mode: 'FATE',
    setMode,
    energy: 50,
    time: 20,
    setEnergy,
    setTime,
    isPending: false,
    hasActiveResult: false,
    recipes: [],
    generateMenu,
    reset,
    error: null
  })
}));

const useOnboardingMock = vi.fn();

vi.mock('@/components/onboarding/OnboardingContext', () => ({
  useOnboarding: () => useOnboardingMock()
}));

vi.mock('@/features/decision/components/DecisionResults', () => ({
  DecisionResults: ({ title }: { title: string }) => <div>{title}</div>
}));

vi.mock('@/features/decision/components/DecisionHeader', () => ({
  DecisionHeader: () => <div>header</div>
}));

vi.mock('@/features/decision/components/views/FateView', () => ({
  FateView: () => <div>fate</div>
}));

vi.mock('@/features/decision/components/views/ChefView', () => ({
  ChefView: () => <div>chef</div>
}));

vi.mock('@/features/decision/components/LoadingOverlay', () => ({
  LoadingOverlay: () => null
}));

describe('IndividualDecisionForm onboarding isolation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useOnboardingMock.mockReturnValue({
      isActive: true,
      currentStepIndex: 3,
      steps: [],
      currentTourId: 'dashboard',
      startTour: vi.fn(),
      nextStep: vi.fn(),
      prevStep: vi.fn(),
      skipTour: vi.fn(),
      finishTour: vi.fn()
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('does not show tour results when a different tour is active', () => {
    render(<IndividualDecisionForm userId="user-1" />);
    vi.runAllTimers();
    expect(screen.queryByText(/RESULTATS DE PROVA/i)).toBeNull();
  });
});
