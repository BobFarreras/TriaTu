// ARXIU: src/app/shopping-list/page.tsx
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';

export default async function ShoppingListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // Injectem client i obtenim dades
  const getShoppingList = container.getGetShoppingList(supabase);
  const items = await getShoppingList.execute(user.id);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                📝 Llista de la Compra
            </h1>
            <BackButton href="/recipes" />
        </div>

        {items.length === 0 ? (
            <div className="text-center py-10 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                Tot net! No tens res pendent de comprar.
            </div>
        ) : (
            <div className="grid gap-2">
                {items.map((item) => (
                    <div key={item.props.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <input 
                                type="checkbox" 
                                checked={item.props.isChecked}
                                className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500"
                                readOnly // Per ara readonly, després farem l'acció de check
                            />
                            <span className={item.props.isChecked ? 'line-through text-slate-500' : 'font-medium'}>
                                {item.props.name}
                            </span>
                        </div>
                        <span className="text-sm font-bold bg-slate-800 px-2 py-1 rounded text-slate-300">
                            {item.props.quantity} {item.props.unit}
                        </span>
                    </div>
                ))}
            </div>
        )}
      </div>
    </main>
  );
}