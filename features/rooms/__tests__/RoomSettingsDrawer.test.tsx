// features/rooms/components/__tests__/RoomSettingsDrawer.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RoomSettingsDrawer } from '../components/RoomSettingsDrawer'; // Assegura't que la ruta d'importació és correcta

describe('RoomSettingsDrawer', () => {
  // 1. Creem un mock complet de les traduccions necessàries per evitar errors de tipus
  const mockT = {
    room: {
      settings: 'Ajustos',
      enable_inventory: 'Inventari Intel·ligent',
      enable_shopping: 'Llista Compra',
      invite_cta: 'Invitar',
      delete_room: 'Eliminar Sala',
      features_title: 'Funcionalitats',
      actions_title: 'Accions',
      delete_confirm_msg: 'Segur?'
    }
  };

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    roomId: '123',
    roomName: 'Test Room',
    isHost: true,
    features: { inventory: false, shoppingList: false },
    // 2. IMPORTANT: El mock ha de retornar una Promesa, ja que el component espera Promise<void>
    onToggleFeature: vi.fn().mockResolvedValue(undefined),
    onCopyCode: vi.fn(),
    t: mockT // ✅ Ara passem 't' directament, satisfent la interfície
  };

  it('renders correctly when open', () => {
    render(<RoomSettingsDrawer {...defaultProps} />);
    expect(screen.getByText('Ajustos')).toBeDefined();
    expect(screen.getByText('Inventari Intel·ligent')).toBeDefined();
  });

  it('does not render when closed', () => {
    render(<RoomSettingsDrawer {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Ajustos')).toBeNull();
  });

  it('calls toggle handler when clicking a feature', () => {
    render(<RoomSettingsDrawer {...defaultProps} />);
    
    // Busquem l'input checkbox associat a l'inventari
    // Nota: Com que hem fet un component custom (label + input hidden), 
    // la millor manera és clicar l'etiqueta o l'input directament.
    const inventoryText = screen.getByText('Inventari Intel·ligent');
    // Pugem fins a trobar el label que conté l'input
    fireEvent.click(inventoryText); 
    
    // 3. Verifiquem la crida amb els paràmetres nous: (setting, value)
    // Com que estava false, al clicar hauria de ser true
    expect(defaultProps.onToggleFeature).toHaveBeenCalledWith('enableInventory', true);
  });

  it('hides delete button for non-hosts', () => {
    render(<RoomSettingsDrawer {...defaultProps} isHost={false} />);
    expect(screen.queryByText('Eliminar Sala')).toBeNull();
  });
});