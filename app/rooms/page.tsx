import { container } from '@/services/container';
import { BackButton } from '@/components/ui/BackButton';
import { CreateRoomCard } from '@/components/rooms/CreateRoomCard'; // Assumeixo que ja tens aquest component o similar
import { JoinRoomCard } from '@/components/rooms/JoinRoomCard';     // Assumeixo que ja tens aquest component o similar
import { RoomList } from '@/components/rooms/RoomList';
import { createClient } from '@/adapters/supabase/server';
import { redirect } from 'next/navigation';

export default async function RoomsPage() {
  // 1. Auth Check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Fetch de les sales de l'usuari
  const getUserRooms = container.getUserRooms();
  const myRooms = await getUserRooms.execute(user.id);

  return (
    <main className="min-h-screen bg-slate-950 pb-24 p-4 md:p-8">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <BackButton href="/dashboard" />
          <h1 className="text-2xl font-black text-white">
            Espai de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Decisió</span>
          </h1>
        </div>

        {/* ACCIONS PRINCIPALS (Crear / Unir-se) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {/* Aquí pots reutilitzar els components que tenies al dashboard o fer-ne de nous simples */}
            <div className="bg-slate-900/50 p-1 rounded-3xl border border-slate-800">
               {/* Si encara no tens components separats, pots posar-hi el codi directament o importar-los */}
               <CreateRoomCard userId={user.id} />
            </div>
            <div className="bg-slate-900/50 p-1 rounded-3xl border border-slate-800">
               <JoinRoomCard userId={user.id} />
            </div>
        </div>

        {/* LLISTA DE SALES ACTIVES */}
        <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>📂</span> Les teves sales
            </h2>
            
            <RoomList rooms={myRooms} currentUserId={user.id} />
        </div>

      </div>
    </main>
  );
}