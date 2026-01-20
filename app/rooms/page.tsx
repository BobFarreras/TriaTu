import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { RoomQuickActions } from '@/features/rooms/components/RoomQuickActions';
import { RoomsGrid, UserRoom } from '@/features/rooms/components/RoomsGrid';
import { SocialHeader } from '@/features/rooms/components/SocialHeader'; // ✅ Import nou

// Tipus per a la DB
interface RoomFromDB {
  id: string;
  name: string;
  host_user_id?: string;
  hostUserId?: string;
  admin_id?: string; 
  owner_id?: string;
  created_by?: string;
}

export default async function RoomsPage() {
  // 1. AUTH
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. DATA
  const getUserRooms = container.getUserRooms();
  const rawRooms = await getUserRooms.execute(user.id) as RoomFromDB[];

  // 3. TRANSFORM (Lògica de negoci)
  const myRooms: UserRoom[] = rawRooms.map((room) => {
    const bossId = room.host_user_id || room.hostUserId || room.owner_id || room.admin_id || room.created_by;
    return {
      id: room.id,
      name: room.name,
      isHost: bossId === user.id
    };
  });

  // 4. VIEW (Renderitzat net)
  return (
    <main className="min-h-dvh w-full p-4 md:p-6 flex flex-col relative bg-[#131f24] bg-gamified-pattern overflow-y-auto">
      
      {/* DECORACIÓ */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto pb-24">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
            <BackButton href='/'/>
            {/* Component Client per al títol traduït */}
            <SocialHeader /> 
        </div>

        {/* COMPONENT 1: ACCIONS */}
        <RoomQuickActions />

        {/* COMPONENT 2: LLISTA */}
        <RoomsGrid rooms={myRooms} />

      </div>
    </main>
  );
}
