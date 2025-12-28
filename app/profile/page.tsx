// =================== FILE: app/profile/page.tsx ===================
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { SupabasePreferenceRepository } from '@/adapters/supabase/SupabasePreferenceRepository';
import { ProfileContent } from '@/features/profile/ui/ProfileContent';

// Definim una interfície local per a les dades que esperem de la base de dades
// Això evita l'ús de 'any' i satisfà el linter
interface ProfileDTO {
  foodPreferences?: string[];
  exclusions?: string[];
  socialTolerance?: number;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const repo = new SupabasePreferenceRepository();
  const rawProfile = await repo.findByUserId(user.id);

  // Fem un casting segur cap a la nostra interfície (ProfileDTO) en lloc de 'any'
  // Utilitzem 'unknown' com a pas intermedi per evitar conflictes de tipus
  const profile = rawProfile as unknown as ProfileDTO | null;

  const initialData = {
    foodPreferences: profile?.foodPreferences || [],
    exclusions: profile?.exclusions || [], // Ara TypeScript sap que 'exclusions' existeix (opcional)
    socialTolerance: profile?.socialTolerance || 5
  };

  const username = user.email?.split('@')[0] || 'Player 1';

  return <ProfileContent initialData={initialData} username={username} />;
}