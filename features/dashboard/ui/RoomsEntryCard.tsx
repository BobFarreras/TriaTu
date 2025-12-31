import Link from 'next/link';

export function RoomsEntryCard() {
  return (
    <Link 
      href="/rooms" 
      className="group relative w-full h-28 bg-indigo-600 hover:bg-indigo-500 rounded-3xl border-b-[6px] border-indigo-800 active:border-b-0 active:translate-y-1.5 active:mt-1.5 transition-all overflow-hidden shadow-xl shadow-indigo-900/20 flex items-center px-6 justify-between"
    >
        {/* Text i Etiqueta */}
        <div className="z-10 flex flex-col">
            <span className="text-[10px] font-black text-indigo-200 bg-indigo-800/40 px-2 py-0.5 rounded w-fit mb-2 tracking-wider">
                SOCIAL HUB
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white leading-none tracking-tight">
                Les Meves Sales
            </h3>
            <p className="text-indigo-200 text-xs mt-1 font-medium opacity-80">
                Gestiona, crea o uneix-te
            </p>
        </div>

        {/* Icona Gran amb efecte al hover */}
        <span className="text-5xl md:text-6xl filter drop-shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
            🛋️
        </span>
        
        {/* Decoració de fons subtil */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
    </Link>
  );
}