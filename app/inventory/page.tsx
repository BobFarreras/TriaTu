import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { InventoryManager } from '@/components/inventory/InventoryManager'; // <--- Únic import UI

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div className="p-10 text-white">Inicia sessió si us plau.</div>;

  // 1. Dades
  const useCase = container.getGetUserInventory();
  const domainItems = await useCase.execute(user.id);
  const plainItems = domainItems.map(item => item.props);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SIMPLE */}
        <header className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">
              Revost <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">Digital</span>
            </h1>
            <p className="text-slate-500 text-sm">
              Control d'estoc i caducitats
            </p>
          </div>
          <div className="text-right">
             <span className="text-xs font-mono text-slate-600 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                TOTAL ITEMS: <span className="text-purple-400 font-bold">{plainItems.length}</span>
             </span>
          </div>
        </header>

        {/* TOT EL GESTOR (Stats + Filtres + Botó + Llista) */}
        <InventoryManager items={plainItems} />

      </div>
    </main>
  );
}