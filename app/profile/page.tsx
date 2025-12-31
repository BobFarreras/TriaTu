import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { SupabasePreferenceRepository } from '@/adapters/supabase/SupabasePreferenceRepository';
import { ProfileContent } from '@/features/profile/ui/ProfileContent';

// ✅ 1. Ampliem la interfície local perquè TypeScript sàpiga que existeixen
interface ProfileDTO {
  username?: string;        // Nou
  avatarEmoji?: string;     // Nou
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

  // Casting segur
  const profile = rawProfile as unknown as ProfileDTO | null;

  // ✅ 2. Passem les dades reals de la BD al client
  // Si no hi ha dades a la BD, usem valors per defecte
  const initialData = {
    username: profile?.username || '', 
    avatarEmoji: profile?.avatarEmoji || '👨‍🍳',
    foodPreferences: profile?.foodPreferences || [],
    exclusions: profile?.exclusions || [],
    socialTolerance: profile?.socialTolerance || 5
  };

  return <ProfileContent initialData={initialData} />;
}