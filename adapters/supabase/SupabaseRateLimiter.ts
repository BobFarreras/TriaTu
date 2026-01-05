import { createClient } from '@/adapters/supabase/server';

export class SupabaseRateLimiter {
  /**
   * Comprova si l'usuari pot realitzar l'acció.
   * @param identifier ID únic (usuari + acció)
   * @param limit Nombre màxim de peticions permeses
   * @param windowSeconds Temps en segons de la finestra
   * @returns true si pot passar, false si està bloquejat
   */
  async check(identifier: string, limit: number, windowSeconds: number): Promise<boolean> {
    const supabase = await createClient();

    // Cridem la funció RPC que hem creat al SQL
    const { data, error } = await supabase.rpc('check_rate_limit', {
      _key: identifier,
      _limit: limit,
      _window_seconds: windowSeconds
    });

    if (error) {
      console.error('🔥 Error al RateLimiter:', error);
      // En cas d'error de DB, per seguretat (fail-closed) o disponibilitat (fail-open)?
      // Normalment millor fail-open (true) per no bloquejar usuaris si la taula falla,
      // però si és crític per diners, fail-closed (false).
      return true; 
    }

    return data as boolean;
  }
}