'use client';

import { useState, useEffect } from 'react';
import { updateRoomSettingsAction } from './useRoomSettings';

interface FeaturesState {
  inventory: boolean;
  shoppingList: boolean;
}

export function useRoomFeatures(roomId: string, initialInventory: boolean, initialShopping: boolean) {
  // 1. Estat Optimista Local
  const [features, setFeatures] = useState<FeaturesState>({
    inventory: initialInventory,
    shoppingList: initialShopping
  });

  // 2. Sincronització si les props canvien (Realtime updates des de Supabase)
  useEffect(() => {
    setFeatures({
      inventory: initialInventory,
      shoppingList: initialShopping
    });
  }, [initialInventory, initialShopping]);

  // 3. Handler (Optimistic UI)
  const toggleFeature = async (setting: 'enableInventory' | 'enableShoppingList', newValue: boolean) => {
    // Mapeig de la clau d'estat local
    const stateKey = setting === 'enableInventory' ? 'inventory' : 'shoppingList';
    
    // A) Actualització Visual Immediata
    setFeatures(prev => ({ ...prev, [stateKey]: newValue }));

    try {
      // B) Crida al Servidor
      const res = await updateRoomSettingsAction({ 
        roomId, 
        setting, 
        value: newValue 
      });

      if (!res.success) {
        throw new Error(res.error || 'Error del servidor');
      }
    } catch (err) {
      console.error("Error toggling feature:", err);
      // C) Rollback en cas d'error (Tornem al valor anterior)
      setFeatures(prev => ({ ...prev, [stateKey]: !newValue }));
      alert('⚠️ No s\'han pogut guardar els canvis. Revisa la connexió.');
    }
  };

  return { features, toggleFeature };
}