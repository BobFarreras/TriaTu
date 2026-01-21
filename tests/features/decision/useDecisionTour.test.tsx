import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useDecisionTour } from '@/features/decision/hooks/useDecisionTour';

const startTour = vi.fn();

vi.mock('@/lib/i18n/LanguageContext', () => ({
  useLanguage: () => ({
    t: {
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

vi.mock('@/components/onboarding/OnboardingContext', () => ({
  useOnboarding: () => ({
    startTour,
    isActive: false,
    currentStepIndex: 0,
    nextStep: vi.fn(),
    currentTourId: ''
  })
}));

function DecisionTourProbe({ mode }: { mode: 'FATE' | 'CHEF' }) {
  const data = useDecisionTour(mode, vi.fn(), vi.fn());
  return (
    <div data-testid="steps">
      {data.steps.map((step) => step.targetId).join('|')}
    </div>
  );
}

describe('useDecisionTour', () => {
  beforeEach(() => {
    startTour.mockClear();
  });

  it('does not auto-start the tour', () => {
    render(<DecisionTourProbe mode="FATE" />);
    expect(startTour).not.toHaveBeenCalled();
  });

  it('builds Fate steps without the inputs section', () => {
    render(<DecisionTourProbe mode="FATE" />);
    const ids = screen.getByTestId('steps').textContent?.split('|') ?? [];
    expect(ids).toContain('tour-dec-action');
    expect(ids).toContain('tour-dec-results');
    expect(ids).not.toContain('tour-dec-inputs');
  });

  it('builds Chef steps including the inputs section', () => {
    render(<DecisionTourProbe mode="CHEF" />);
    const ids = screen.getByTestId('steps').textContent?.split('|') ?? [];
    expect(ids).toContain('tour-dec-inputs');
    expect(ids.indexOf('tour-dec-inputs')).toBeLessThan(ids.indexOf('tour-dec-action'));
  });
});
