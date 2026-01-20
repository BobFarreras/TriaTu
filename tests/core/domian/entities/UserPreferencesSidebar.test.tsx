// tests/core/domain/entities/UserPreferencesSidebar.test.tsx
// NOTA: Moveu aquest fitxer a tests/features/dashboard/ui/UserPreferencesSidebar.test.tsx
// ja que és un test de component UI, no de domini pur.

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserPreferencesSidebar } from '@/features/dashboard/components/UserPreferencesSidebar';

// Mocks globals
vi.mock('@/lib/i18n/LanguageContext', () => ({
  useLanguage: () => ({
    t: {
      profile: { sidebar: { edit: 'Editar', likes: 'GUSTOS', alerts: 'ALERTES' } },
      food: {}, exclusions: {}
    }
  })
}));

vi.mock('@/core/constants/profile-data', () => ({
  FOOD_DATA: [{
    title: 'Test',
    items: [{ id: 'pizza', emoji: '🍕', label: 'Pizza' }]
  }],
  EXCLUSION_DATA: [{
    title: 'Test',
    items: [{ id: 'gluten', emoji: '🌾', label: 'Gluten' }]
  }]
}));

describe('UserPreferencesSidebar UI', () => {
  // Mock ResizeObserver per evitar errors de JSDOM amb el scroll logic
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });

  afterAll(() => vi.unstubAllGlobals());

  it('renderitza correctament els emojis basats en els IDs', () => {
    render(
      <UserPreferencesSidebar
        foodPreferences={['pizza']}
        exclusions={['gluten']}
      />
    );

    // Busquem pel text visible (emoji)
    expect(screen.getByText('🍕')).toBeDefined();
    expect(screen.getByText('🌾')).toBeDefined();
    
    // Validem que NO apareixen els fallbacks
    expect(screen.queryByText('❓')).toBeNull();
  });

  it('mostra fallback per a IDs desconeguts', () => {
    render(
      <UserPreferencesSidebar
        foodPreferences={['unknown-id']}
        exclusions={[]}
      />
    );
    expect(screen.getByText('❓')).toBeDefined();
  });
});
