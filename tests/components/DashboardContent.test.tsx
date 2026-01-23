import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { DashboardContent } from '@/features/dashboard/components/DashboardContent';

const startTour = vi.fn();

vi.mock('@/lib/i18n/LanguageContext', () => ({
  useLanguage: () => ({
    t: {
      onboarding: {
        dashboard: {
          step1_title: 's1',
          step1_desc: 's1d',
          step2_title: 's2',
          step2_desc: 's2d',
          step3_title: 's3',
          step3_desc: 's3d',
          step4_title: 's4',
          step4_desc: 's4d',
          step5_title: 's5',
          step5_desc: 's5d',
          step6_title: 's6',
          step6_desc: 's6d',
          step7_title: 's7',
          step7_desc: 's7d',
          step8_title: 's8',
          step8_desc: 's8d',
          step9_title: 's9',
          step9_desc: 's9d',
          step10_title: 's10',
          step10_desc: 's10d',
          step11_title: 's11',
          step11_desc: 's11d',
          step12_title: 's12',
          step12_desc: 's12d'
        }
      }
    }
  })
}));

vi.mock('@/components/onboarding/OnboardingContext', () => ({
  useOnboarding: () => ({
    startTour,
    currentTourId: ''
  })
}));

vi.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: () => true
}));

vi.mock('@/components/onboarding/TourTrigger', () => ({
  TourTrigger: () => <button type="button">tour</button>
}));

vi.mock('@/features/dashboard/components/DashboardHeader', () => ({
  DashboardHeader: () => <div>header</div>
}));

vi.mock('@/features/dashboard/components/NavigationPanel', () => ({
  NavigationPanel: () => <div>nav</div>
}));

vi.mock('@/features/dashboard/components/QuickActionsPanel', () => ({
  QuickActionsPanel: () => <div>quick</div>
}));

vi.mock('@/features/dashboard/components/UserPreferencesSidebar', () => ({
  UserPreferencesSidebar: () => <div>prefs</div>
}));

vi.mock('@/features/dashboard/components/MobileuserPreferences', () => ({
  MobileUserPreferences: () => <div>prefs-mobile</div>
}));

describe('DashboardContent onboarding steps', () => {
  beforeEach(() => {
    startTour.mockClear();
  });

  it('includes the shopping list step before profile', () => {
    render(
      <DashboardContent
        userName="Test"
        userId="user-1"
        userRooms={[]}
        profileData={{ foodPreferences: [], exclusions: [] }}
      />
    );

    expect(startTour).toHaveBeenCalledTimes(1);
    const steps = startTour.mock.calls[0][1] as { targetId: string }[];
    const ids = steps.map((step) => step.targetId);
    expect(ids).toContain('tour-dash-shopping');
    expect(ids.indexOf('tour-dash-shopping')).toBeLessThan(ids.indexOf('tour-dash-profile'));
  });
});
