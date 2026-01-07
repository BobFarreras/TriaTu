// src/lib/security/decision-limit.ts
import { SupabaseClient } from '@supabase/supabase-js';

const DAILY_LIMIT = 10; // Posem 20 en total (Manuals + Màgiques)

export async function checkRoomDailyLimit(supabase: SupabaseClient, roomId: string): Promise<{ allowed: boolean; error?: string }> {
  
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Comptem TOTES les decisions (manuals i màgiques)
  const { count, error } = await supabase
    .from('group_decisions')
    .select('*', { count: 'exact', head: true }) // Molt ràpid
    .eq('room_id', roomId)
    .gte('created_at', oneDayAgo);

  if (error) {
    console.error("Rate Limit Check Error:", error);
    // En cas d'error tècnic, deixem passar (fail-open) per no bloquejar usuaris
    return { allowed: true }; 
  }

  if (count !== null && count >= DAILY_LIMIT) {
    return { 
      allowed: false, 
      error: `🛑 Límit diari assolit! La sala ha fet ${count}/${DAILY_LIMIT} decisions avui. Descanseu una mica!` 
    };
  }

  return { allowed: true };
}