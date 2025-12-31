import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserPreferencesSidebar } from '@/features/dashboard/ui/UserPreferencesSidebar';

// ✅ SOLUCIÓ ROBUSTA: Definim una classe real per al Mock
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// Mock de les dades
vi.mock('@/core/constants/profile-data', () => {
  return {
    FOOD_DATA: [
      {
        title: 'Test Category',
        items: [{ id: 'pizza', emoji: '🍕', label: 'Pizza' }]
      }
    ],
    EXCLUSION_DATA: [
      {
        title: 'Test Exclusion Category',
        items: [{ id: 'gluten', emoji: '🌾', label: 'Gluten' }]
      }
    ]
  };
});

describe('UserPreferencesSidebar', () => {

  beforeAll(() => {
    // ✅ Mètode clàssic i infalible
    vi.stubGlobal('ResizeObserver', class ResizeObserver {
      observe() { }
      unobserve() { }
      disconnect() { }
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
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

    // Emojis
    expect(screen.getByText('🍕')).toBeDefined();
    expect(screen.getByText('🌾')).toBeDefined();

    // ✅ FIX: Busca 'pizza' i 'gluten' en minúscula, tal com surt al HTML del log
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

    expect(screen.getByText('❓')).toBeDefined();
    expect(screen.getByTitle('unknown_id')).toBeDefined();
  });
});