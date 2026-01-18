'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/adapters/supabase/client';
import { InventoryScope } from './useInventoryData';

export function useRealtimeInventory(scope: InventoryScope, onRefresh: () => void) {
  
  // TRUC MESTRE: Guardem la funció en un Ref.
  // Això permet cridar l'última versió de 'onRefresh' sense haver de 
  // reiniciar la connexió WebSocket cada vegada que el component es pinta.
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    // 1. Calculem el filtre
    const filterString = scope === 'PERSONAL' 
      ? 'room_id=is.null' 
      : `room_id=eq.${scope}`;

    console.log(`🔌 [REALTIME] Iniciant connexió... (${scope})`);

    const channel = supabase
      .channel(`inventory-${scope}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'inventory_items', 
          filter: filterString 
        },
        (payload) => {
          console.log("🔔 [REALTIME] Event rebut:", payload.eventType);
          
          // Usem la referència, així no trenquem la connexió
          if (onRefreshRef.current) {
            onRefreshRef.current();
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ [REALTIME] Connectat correctament a ${scope}`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`❌ [REALTIME] Error de connexió. Potser t'han limitat temporalment.`);
        }
      });

    return () => {
      console.log(`🔌 [REALTIME] Tancant connexió de ${scope}`);
      supabase.removeChannel(channel);
    };
    
    // 🔥 CLAU DE L'ÈXIT: 
    // Només depenem de 'scope'. Si 'onRefresh' canvia, NO ens desconnectem.
  }, [scope]); 
}