
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { DashboardContent } from '@/features/dashboard/ui/DashboardContent';
import { container } from '@/services/container'; // ✅ Importem el contenidor

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const name = user.email?.split('@')[0] || 'Jugador 1';

  // ✅ 1. RECUPEREM LES SALES (Server Side)
  const getUserRooms = container.getUserRooms();
  const rooms = await getUserRooms.execute(user.id);

  // ✅ 2. Mapegem a DTO simple
  const roomsDTO = rooms.map(r => ({
    id: r.id,
    name: r.name,
    isHost: r.hostUserId === user.id
  }));

  // ✅ 3. Passem les sales al client
  return <DashboardContent userName={name} userId={user.id} userRooms={roomsDTO} />;
}