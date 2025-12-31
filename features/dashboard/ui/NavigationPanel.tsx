import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Trophy } from 'lucide-react';
export function NavigationPanel() {
  const { t } = useLanguage();

  // flex-1: Fa que totes s'estirin igual per omplir l'alçada disponible.
  // min-h-[...]: Evita que es facin massa petites en mòbils.
  const cardBaseClass = "group relative flex-1 min-h-[60px] w-full rounded-2xl border-b-[6px] active:border-b-0 active:translate-y-1.5 active:mt-1.5 transition-all overflow-hidden shadow-xl flex items-center px-4 md:px-6 justify-between";

  return (
    // ✅ CLAU: h-full assegura que el contenidor ocupi tota l'alçada de la columna
    <div className="flex flex-col gap-3 h-full animate-in slide-in-from-right-4 duration-700 delay-100 pb-1">

      {/* 1. CREAR SALA */}
      <Link href="/rooms/create" className={`${cardBaseClass} bg-blue-600 hover:bg-blue-500 border-blue-800 shadow-blue-900/20`}>
        <div className="z-10 flex flex-col justify-center">
          <span className="text-[9px] font-black text-blue-200 bg-blue-800/30 px-2 py-0.5 rounded w-fit mb-0.5">MULTIPLAYER</span>
          <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.create_room}</h3>
        </div>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🛋️</span>
      </Link>

      {/* 2. UNIR-SE */}
      <Link href="/join" className={`${cardBaseClass} bg-orange-500 hover:bg-orange-400 border-orange-700 shadow-orange-900/20`}>
        <div className="z-10 flex flex-col justify-center">
          <span className="text-[9px] font-black text-orange-100 bg-orange-700/30 px-2 py-0.5 rounded w-fit mb-0.5">GUEST</span>
          <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">{t.dashboard.join_room}</h3>
        </div>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">🎫</span>
      </Link>

      {/* --- NOUS BOTONS DE COMUNITAT --- */}

      {/* 3. COMUNITAT DE RECEPTES */}
      <Link href="/recipes" className={`${cardBaseClass} bg-pink-600 hover:bg-pink-500 border-pink-800 shadow-pink-900/20`}>
        <div className="z-10 flex flex-col justify-center">
          <span className="text-[9px] font-black text-pink-100 bg-pink-800/40 px-2 py-0.5 rounded w-fit mb-0.5 tracking-wider uppercase">Social</span>
          <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">Comunitat Receptes</h3>
        </div>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">🍲</span>
      </Link>

      {/* 4. RÀNQUING (LEADERBOARD) */}
      <Link href="/ranking" className={`${cardBaseClass} bg-amber-500 hover:bg-amber-400 border-amber-700 shadow-amber-900/20`}>
        <div className="z-10 flex flex-col justify-center">
          <span className="text-[9px] font-black text-amber-100 bg-amber-700/40 px-2 py-0.5 rounded w-fit mb-0.5 tracking-wider uppercase">Top Xefs</span>
          <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">Rànquing Usuaris</h3>
        </div>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">🏆</span>
      </Link>

      {/* -------------------------------- */}

      {/* 5. LES MEVES SALES */}
      <Link href="/rooms" className={`${cardBaseClass} bg-indigo-600 hover:bg-indigo-500 border-indigo-800 shadow-indigo-900/20`}>
        <div className="z-10 flex flex-col justify-center">
          <span className="text-[9px] font-black text-indigo-100 bg-indigo-800/40 px-2 py-0.5 rounded w-fit mb-0.5 tracking-wider uppercase">Actius</span>
          <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">Les Meves Sales</h3>
        </div>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">🏘️</span>
      </Link>

      {/* 6. INVENTARI */}
      <Link href="/inventory" className={`${cardBaseClass} bg-emerald-600 hover:bg-emerald-500 border-emerald-800 shadow-emerald-900/20`}>
        <div className="z-10 flex flex-col justify-center">
          <span className="text-[9px] font-black text-emerald-100 bg-emerald-800/40 px-2 py-0.5 rounded w-fit mb-0.5 tracking-wider uppercase">Rebost</span>
          <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">El meu Inventari</h3>
        </div>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:translate-x-1 transition-transform duration-300">📦</span>
      </Link>

      {/* 7. PERFIL */}
      <Link href="/profile" className={`${cardBaseClass} bg-zinc-700 hover:bg-zinc-600 border-zinc-900 shadow-black/20`}>
        <div className="z-10 flex flex-col justify-center">
          <span className="text-[9px] font-black text-zinc-300 bg-zinc-900/40 px-2 py-0.5 rounded w-fit mb-0.5 tracking-wider uppercase">Configuració</span>
          <h3 className="text-lg md:text-xl font-black text-white leading-none tracking-tight">El meu Perfil</h3>
        </div>
        <span className="text-3xl md:text-5xl filter drop-shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">⚙️</span>
      </Link>


    </div>
  );
}