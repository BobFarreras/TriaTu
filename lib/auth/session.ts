// src/lib/auth/session.ts
import { createClient } from '@/adapters/supabase/server'; // 👈 Importa la teva funció server-side
import { cache } from 'react';

/**
 * Retorna l'usuari autenticat actual o null.
 * Utilitza 'cache' per evitar múltiples crides a Supabase en una mateixa petició.
 */
export const getCurrentUser = cache(async () => {
  // Nota: El teu createClient és async perquè fa await cookies(), així que posem await aquí
  const supabase = await createClient(); 
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    // Pots mapejar més camps si els necessites
  };
});