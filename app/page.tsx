import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { IndividualDecisionForm } from '@/features/decision/ui/IndividualDecisionForm';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen p-8 md:p-24 bg-gray-50 dark:bg-black">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Decision Assistant
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          Hola, <span className="text-blue-600">{user.email?.split('@')[0]}</span>.
          <Link href="/profile" className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition-colors text-black">
            ⚙️ Editar Perfil
          </Link>
        </p>
      </div>

      <IndividualDecisionForm userId={user.id} />

      <div className="max-w-md mx-auto mt-12 grid grid-cols-2 gap-4">
        <Link
          href="/rooms/create"
          className="flex items-center justify-center px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
        >
          ➕ Crear Sala
        </Link>
        <Link
          href="/join"
          className="flex items-center justify-center px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
        >
          👋 Unir-se a Sala
        </Link>
      </div>
    </main>
  );
}