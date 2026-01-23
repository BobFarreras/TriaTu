// =================== FILE: app/rooms/create/page.tsx ===================
import { redirect } from 'next/navigation';
import { CreateRoomContent } from '@/features/rooms/components/CreateRoomContent';
import { getCurrentUser } from '@/lib/auth/session';

export default async function CreateRoomPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <CreateRoomContent userId={user.id} />;
}
