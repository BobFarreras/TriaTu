import Link from 'next/link';

export function RoomsNavCard() {
  return (
    <Link 
      href="/rooms"
      className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl transition-all hover:scale-[1.02] hover:border-indigo-500/50 hover:shadow-indigo-900/20"
    >
      {/* Gradient de fons subtil */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl transition-all group-hover:bg-indigo-500/20" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="mb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-3xl shadow-inner mb-3 group-hover:scale-110 transition-transform">
            🗳️
          </div>
          <h3 className="text-xl font-black text-white leading-tight">
            Sales de <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Decisió</span>
          </h3>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-400 font-medium max-w-[80%]">
            Vota amb amics o família què menjar avui.
          </p>
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            ➜
          </div>
        </div>
      </div>
    </Link>
  );
}