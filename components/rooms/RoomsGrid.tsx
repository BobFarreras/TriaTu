import Link from 'next/link';

export interface UserRoom {
  id: string;
  name: string;
  isHost: boolean;
}

export function RoomsGrid({ rooms }: { rooms: UserRoom[] }) {
  return (
    <div>
      {/* HEADER PETIT */}
      <div className="flex items-center justify-between px-1 mb-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              Sales Actives
          </h3>
          <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
              {rooms.length}
          </span>
      </div>

      {rooms.length === 0 ? (
        // EMPTY STATE
        <div className="py-12 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
            <span className="text-2xl opacity-50 grayscale mb-2 block">🕸️</span>
            <p className="text-xs text-gray-500">Cap sala activa encara.</p>
        </div>
      ) : (
        // GRID DE 2 COLUMNES
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rooms.map((room) => (
                <Link 
                    key={room.id} 
                    href={`/rooms/${room.id}`}
                    className="group relative flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-purple-500/50 hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md"
                >
                    {/* Icona Host/Guest */}
                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg shadow-inner ${room.isHost ? 'bg-purple-900/20 text-purple-400' : 'bg-blue-900/20 text-blue-400'}`}>
                        {room.isHost ? '👑' : '👋'}
                    </div>
                    
                    <div className="flex flex-col min-w-0 flex-1">
                        <p className="font-bold text-white text-sm truncate group-hover:text-purple-300 transition-colors">
                            {room.name}
                        </p>
                        <span className={`text-[9px] font-bold uppercase tracking-wider w-fit rounded ${room.isHost ? 'text-purple-400' : 'text-blue-400'}`}>
                            {room.isHost ? 'Admin' : 'Membre'}
                        </span>
                    </div>

                    <span className="text-gray-600 group-hover:text-purple-500 text-lg pr-1">→</span>
                </Link>
            ))}
        </div>
      )}
    </div>
  );
}