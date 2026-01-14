// ARXIU: src/app/shopping-list/page.tsx
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { ShoppingListManager } from '@/components/shopping/ShoppingListManager'; // Component Client

export default async function ShoppingListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const getShoppingList = container.getGetShoppingList(supabase);
  const items = await getShoppingList.execute(user.id);

  // Serialitzem per passar a Client Component
  const plainItems = items.map(i => ({
      id: i.props.id,
      name: i.props.name,
      quantity: i.props.quantity,
      unit: i.props.unit,
      isChecked: i.props.isChecked
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 pb-32">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                📝 Compra Activa
            </h1>
            <BackButton href="/" />
        </div>

        {/* Deleguem la lògica d'interacció a un Client Component */}
        <ShoppingListManager initialItems={plainItems} />

      </div>
    </main>
  );
}