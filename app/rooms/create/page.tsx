// =================== FILE: app/rooms/create/page.tsx ===================
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { CreateRoomContent } from '@/features/rooms/components/CreateRoomContent';

export default async function CreateRoomPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <CreateRoomContent userId={user.id} />;
}