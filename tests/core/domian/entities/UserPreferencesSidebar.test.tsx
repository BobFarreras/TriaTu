import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserPreferencesSidebar } from '@/features/dashboard/ui/UserPreferencesSidebar';

// 1. ✅ MOCK DEL CONTEXT D'IDIOMA (Més complet per evitar errors de lectura)
vi.mock('@/lib/i18n/LanguageContext', () => ({
  useLanguage: () => ({
    t: {
      profile: {
        sidebar: {
          edit: 'Editar Perfil',
          likes: 'GUSTOS',
          alerts: 'ALERTA'
        },
        // Afegim objectes buits per si el component intenta fer t.profile.food[...]
        food: {},
        exclusions: {}
      },
      // Si el component busca a l'arrel t.food
      food: { items: {} }, 
      exclusions: { items: {} }
    }
  })
}));

// 2. ✅ MOCK DE DADES (Tot en minúscula per consistència amb el test)
vi.mock('@/core/constants/profile-data', () => {
  return {
    FOOD_DATA: [
      {
        title: 'Test Category',
        items: [{ id: 'pizza', emoji: '🍕', label: 'pizza' }] // label en minúscula
      }
    ],
    EXCLUSION_DATA: [
      {
        title: 'Test Exclusion Category',
        items: [{ id: 'gluten', emoji: '🌾', label: 'gluten' }] // label en minúscula
      }
    ]
  };
});

describe('UserPreferencesSidebar', () => {

  // 3. Mock del ResizeObserver
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', class ResizeObserver {
      observe() { }
      unobserve() { }
      disconnect() { }
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders the sidebar structure even when lists are empty', () => {
    const { container } = render(
      <UserPreferencesSidebar foodPreferences={[]} exclusions={[]} />
    );

    const aside = container.querySelector('aside');
    expect(aside).not.toBeNull();

    const profileLink = screen.getByTitle('Editar Perfil');
    expect(profileLink).toBeDefined();

    expect(screen.queryByText('🍕')).toBeNull();
    expect(screen.queryByText('🌾')).toBeNull();
  });

  it('correctly maps IDs to emojis and labels', () => {
    render(
      <UserPreferencesSidebar
        foodPreferences={['pizza']}
        exclusions={['gluten']}
      />
    );

    // Verifiquem els Emojis (Text visible)
    expect(screen.getByText('🍕')).toBeDefined();
    expect(screen.getByText('🌾')).toBeDefined();

    // Verifiquem els Titles (Tooltips) - Ara tot és 'pizza' i 'gluten'
    // Usem getByTitle perquè normalment aquests elements tenen un attribute title="..."
    expect(screen.getByTitle('pizza')).toBeDefined();
    expect(screen.getByTitle('gluten')).toBeDefined();
  });

  it('handles unknown IDs gracefully', () => {
    render(
      <UserPreferencesSidebar
        foodPreferences={['unknown_id']}
        exclusions={[]}
      />
    );

    // Fallback emoji
    expect(screen.getByText('❓')).toBeDefined();
    // Fallback title (l'ID)
    expect(screen.getByTitle('unknown_id')).toBeDefined();
  });
});