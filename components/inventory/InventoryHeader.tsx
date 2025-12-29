export function InventoryHeader({ totalItems }: { totalItems: number }) {
  return (
    // CANVIS:
    // 1. Eliminat 'flex-col' -> Ara és sempre 'flex-row' (fila).
    // 2. Canviat 'items-end' per 'items-center' -> Queda millor visualment quan estan en una sola línia.
    <header className="mb-6 flex flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6">
      
      <div>
        {/* Títol: Ajustem una mica la mida en mòbil si fos necessari, però 3xl sol cabre bé */}
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">
          Revost <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">Digital</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Control d'estoc i caducitats
        </p>
      </div>

      {/* Badge: Afegim 'shrink-0' perquè no s'aixafi si el mòbil és molt estret */}
      <div className="text-right shrink-0">
         <span className="text-xs font-mono text-slate-600 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 whitespace-nowrap">
           TOTAL: <span className="text-purple-400 font-bold">{totalItems}</span>
         </span>
      </div>
      
    </header>
  );
}