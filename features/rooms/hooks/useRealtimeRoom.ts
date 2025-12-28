'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/adapters/supabase/browser';

export function useRealtimeRoom(roomId: string) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!roomId) return;

    console.log(`🔌 [REALTIME] Connectant al canal room:${roomId}...`);

    const channel = supabase
      .channel(`room:${roomId}`)
      
      // 1. Canvis a la CONFIGURACIÓ DE LA SALA (Mode Ocult/Públic)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'decision_rooms', 
          filter: `id=eq.${roomId}` 
        },
        () => {
          console.log('🔄 [REALTIME] Mode de sala actualitzat');
          router.refresh();
        }
      )

      // 2. Canvis a PARTICIPANTS (Entrada/Sortida/Kick)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_participants', filter: `room_id=eq.${roomId}` },
        () => {
           console.log('👥 [REALTIME] Llista participants actualitzada');
           router.refresh();
        }
      )

      // 3. Canvis a CANDIDATS (Afegir i Esborrar Opcions)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_candidates', filter: `room_id=eq.${roomId}` },
        () => {
          console.log('🍽️ [REALTIME] Candidats actualitzats (Insert/Delete)');
          router.refresh();
        }
      )

      // 4. Canvis a HISTORIAL (Afegir decisió i ESBORRAR historial)
      .on(
        'postgres_changes',
        // ⚠️ CORRECCIÓ CRÍTICA: Canviem 'INSERT' per '*' perquè detecti també el DELETE
        { event: '*', schema: 'public', table: 'group_decisions', filter: `room_id=eq.${roomId}` }, 
        () => {
          console.log('📜 [REALTIME] Historial actualitzat (Nova decisió o Esborrat)');
          router.refresh();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log(`✅ [REALTIME] Subscrit correctament a la sala ${roomId}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, router, supabase]);
}