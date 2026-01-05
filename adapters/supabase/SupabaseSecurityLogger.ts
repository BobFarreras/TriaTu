import { createClient } from '@/adapters/supabase/server';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export class SupabaseSecurityLogger {
  
  /**
   * Registra un esdeveniment de seguretat.
   * No llença error si falla el log per no aturar l'aplicació.
   */
  async log(
    level: LogLevel,
    eventType: string,
    userId: string | null,
    // ✅ CORRECCIÓ: Usem 'unknown' en lloc de 'any'.
    // Això permet passar qualsevol objecte JSON però satisfà el linter.
    details: Record<string, unknown> = {}
  ) {
    try {
      // 1. Log a consola del servidor (per Vercel logs)
      const icon = level === 'ERROR' || level === 'CRITICAL' ? '🚨' : level === 'WARN' ? '⚠️' : '📝';
      console.log(`${icon} [SECURITY] [${eventType}] User:${userId || 'anon'}`, details);

      // 2. Log a Base de Dades (Persistència)
      const supabase = await createClient();
      
      // Intentem guardar-ho de forma asíncrona.
      await supabase.from('security_logs').insert({
        level,
        event_type: eventType,
        user_id: userId,
        details: JSON.stringify(details)
      });

    } catch (error) {
      // Si falla el logger, no volem que peti l'app, però ho mostrem a consola
      console.error('❌ Failed to write security log:', error);
    }
  }
}