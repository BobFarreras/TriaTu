'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/adapters/supabase/browser';

export function useRealtimeRoom(roomId: string) {
  const router = useRouter();
  
  // Instanciem el client fora o dins, però l'adapter browser ja sol ser singleton.
  const supabase = createClient();

  useEffect(() => {
    if (!roomId) return;

    // Definim el canal únic per aquesta sala
    const channelName = `room:${roomId}`;
    console.log(`🔌 [REALTIME] Intentant connectar a: ${channelName}`);

    const channel = supabase
      .channel(channelName)

      // 1. CONFIGURACIÓ SALA (UPDATE)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'decision_rooms', 
          filter: `id=eq.${roomId}` 
        },
        (payload) => {
          console.log('🔄 [REALTIME] Sala actualitzada:', payload);
          router.refresh();
        }
      )

      // 2. PARTICIPANTS (INSERT/DELETE)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'room_participants', 
          filter: `room_id=eq.${roomId}` 
        },
        () => {
           console.log('👥 [REALTIME] Participants canviats');
           router.refresh();
        }
      )

      // 3. CANDIDATS (INSERT/DELETE)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'room_candidates', 
          filter: `room_id=eq.${roomId}` 
        },
        () => {
          console.log('🍽️ [REALTIME] Candidats canviats');
          router.refresh();
        }
      )

      // 4. HISTORIAL / DECISIONS (INSERT/DELETE)
      .on(
        'postgres_changes',
        { 
          event: '*', // Important: * agafa INSERT i DELETE (quan neteges historial)
          schema: 'public', 
          table: 'group_decisions', 
          filter: `room_id=eq.${roomId}` 
        },
        () => {
          console.log('📜 [REALTIME] Historial canviat');
          router.refresh();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log(`✅ [REALTIME] Connectat a la sala ${roomId}`);
        } else if (status === 'CHANNEL_ERROR') {
            console.error(`❌ [REALTIME] Error connectant a la sala ${roomId}. Revisa els logs de Supabase.`);
        } else if (status === 'TIMED_OUT') {
            console.error(`⌛ [REALTIME] Temps d'espera esgotat.`);
        }
      });

    // Neteja en desmuntar
    return () => {
      console.log(`🔌 [REALTIME] Desconnectant de: ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, [roomId, router, supabase]); // Dependències correctes
}