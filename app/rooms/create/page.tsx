import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { CreateRoomForm } from '@/features/rooms/ui/CreateRoomForm';

export default async function CreateRoomPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-black">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Nova Sala</h1>
        {/* Passem l'ID real */}
        <CreateRoomForm userId={user.id} />
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            ← Tornar a l'inici
          </Link>
        </div>
      </div>
    </div>
  );
}