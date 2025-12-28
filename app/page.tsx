import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/adapters/supabase/server';
import { IndividualDecisionForm } from '@/features/decision/ui/IndividualDecisionForm';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const name = user.email?.split('@')[0] || 'Jugador 1';

  return (
    <main className="min-h-screen p-6 md:p-12 flex flex-col items-center max-w-4xl mx-auto">
      
      {/* HEADER GAMIFICAT */}
      <header className="w-full flex justify-between items-center mb-12">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 pr-6 rounded-full border-b-4 border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-xl shadow-inner border-2 border-green-400">
            😎
          </div>
          <span className="font-bold text-gray-700 dark:text-gray-200">
            {name}
          </span>
        </div>

        <Link href="/profile" className="btn-3d bg-white dark:bg-slate-800 text-gray-700 dark:text-white px-4 py-2 rounded-2xl border-2 border-b-4 border-gray-300 dark:border-slate-600 font-bold hover:bg-gray-50 flex items-center gap-2">
          ⚙️ <span className="hidden sm:inline">Configuració</span>
        </Link>
      </header>

      {/* TÍTOL HERO AMB EMOJIS FLOTANTS */}
      <div className="text-center relative mb-16">
        <div className="absolute -left-12 top-0 text-6xl animate-[float_3s_ease-in-out_infinite]">🥦</div>
        <div className="absolute -right-12 bottom-0 text-6xl animate-[float_4s_ease-in-out_infinite_1s]">🍕</div>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-800 dark:text-white tracking-tight mb-2 drop-shadow-sm">
          Decision <br/>
          <span className="text-green-500 inline-block transform -rotate-2">Assistant</span>
        </h1>
        <p className="text-lg font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Nivell 1: La vida fàcil
        </p>
      </div>

      {/* BLOC PRINCIPAL: DECISIÓ INDIVIDUAL */}
      {/* Utilitzem un contenidor que sembla una "caixa de joc" */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] border-4 border-green-500 shadow-[0_10px_0_0_#46a302] p-8 mb-16 relative overflow-hidden transform hover:scale-[1.01] transition-transform">
        <div className="absolute top-0 left-0 w-full h-4 bg-green-400 opacity-20"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-center mb-6 flex items-center justify-center gap-2">
            <span>⚡</span> Decisió Ràpida
          </h2>
          {/* El formulari es renderitza aquí dins */}
          <IndividualDecisionForm userId={user.id} />
        </div>
      </div>

      {/* FOOTER: ZONA SOCIAL (BENTO GRID) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TARGETA 1: CREAR SALA */}
        <Link href="/rooms/create" className="btn-3d group relative overflow-hidden bg-blue-500 rounded-3xl p-6 border-b-8 border-blue-700 flex flex-col items-center text-center hover:bg-blue-400 transition-colors">
          <div className="absolute top-2 right-2 text-white/20 text-8xl font-black -rotate-12 group-hover:rotate-0 transition-transform">
            +
          </div>
          <span className="text-5xl mb-4 filter drop-shadow-md group-hover:scale-110 transition-transform">🛋️</span>
          <h3 className="text-2xl font-black text-white mb-1">Crear Sala</h3>
          <p className="text-blue-100 font-bold text-sm">Convida amics i decidiu junts</p>
        </Link>

        {/* TARGETA 2: UNIR-SE */}
        <Link href="/join" className="btn-3d group relative overflow-hidden bg-orange-500 rounded-3xl p-6 border-b-8 border-orange-700 flex flex-col items-center text-center hover:bg-orange-400 transition-colors">
          <div className="absolute -bottom-4 -left-4 text-white/20 text-8xl font-black rotate-12 group-hover:rotate-0 transition-transform">
            #
          </div>
          <span className="text-5xl mb-4 filter drop-shadow-md group-hover:scale-110 transition-transform">🎟️</span>
          <h3 className="text-2xl font-black text-white mb-1">Unir-se</h3>
          <p className="text-orange-100 font-bold text-sm">Tens un codi d'invitació?</p>
        </Link>

      </div>

    </main>
  );
}