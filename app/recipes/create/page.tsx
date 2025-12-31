import { createClient } from '@/adapters/supabase/server';
import { SupabaseInventoryRepository } from '@/adapters/supabase/SupabaseInventoryRepository';
import { RecipeEditor } from '@/components/recipes/editor/RecipeEditor';
import { BackButton } from '@/components/ui/BackButton';

export default async function CreateRecipePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Recuperem l'inventari per la "Pantry Section"
  const inventoryRepo = new SupabaseInventoryRepository();
  const inventoryEntities = user ? await inventoryRepo.findByUser(user.id) : [];

  // Serialitzem
  const plainInventory = inventoryEntities.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      emoji: item.emoji
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      <div className="container mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
            <BackButton href="/recipes" label="Sortir sense guardar" />
            <div className="text-right hidden sm:block">
                <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Estudi de Cuina
                </h1>
                <p className="text-xs text-slate-500">Mode Creatiu</p>
            </div>
        </header>

        {/* El nou Editor Tot-en-U */}
        <RecipeEditor userInventory={plainInventory} />
      </div>
    </main>
  );
}