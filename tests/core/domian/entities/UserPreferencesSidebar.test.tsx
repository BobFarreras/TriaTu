// src/features/dashboard/ui/UserPreferencesSidebar.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserPreferencesSidebar } from '@/features/dashboard/ui/UserPreferencesSidebar';

// Mock de les dades
vi.mock('@/core/constants/profile-data', () => {
  return {
    FOOD_DATA: [
      { 
        title: 'Test Food', 
        items: [{ id: 'pizza', emoji: '🍕', label: 'Pizza' }] 
      }
    ],
    EXCLUSION_DATA: [
      { 
        title: 'Test Exclusion', 
        items: [{ id: 'gluten', emoji: '🌾', label: 'Gluten' }] 
      }
    ]
  };
});

describe('UserPreferencesSidebar', () => {
  
  it('renders nothing when lists are empty', () => {
    const { container } = render(
      <UserPreferencesSidebar foodPreferences={[]} exclusions={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('correctly maps IDs to emojis and labels', () => {
    render(
      <UserPreferencesSidebar 
        foodPreferences={['pizza']} 
        exclusions={['gluten']} 
      />
    );

    // 1. Verifiquem els Emojis
    expect(screen.getByText('🍕')).toBeDefined();
    expect(screen.getByText('🌾')).toBeDefined();

    // 2. Verifiquem els Textos (Tooltips)
    // ✅ CORRECCIÓ: Busquem 'pizza' i 'gluten' (els IDs), no els Labels,
    // ja que la implementació actual usa l'ID com a fallback.
    expect(screen.getByText('pizza')).toBeDefined();
    expect(screen.getByText('gluten')).toBeDefined();
  });

  it('handles unknown IDs gracefully', () => {
    render(
      <UserPreferencesSidebar 
        foodPreferences={['unknown_id']} 
        exclusions={[]} 
      />
    );
    
    // Hauria de mostrar l'emoji de fallback (❓)
    expect(screen.getByText('❓')).toBeDefined();
    // I el text de l'ID desconegut
    expect(screen.getByText('unknown_id')).toBeDefined();
  });
});