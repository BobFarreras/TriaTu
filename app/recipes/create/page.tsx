import { createClient } from '@/adapters/supabase/server';
import { SupabaseInventoryRepository } from '@/adapters/supabase/SupabaseInventoryRepository';
import { RecipeEditor } from '@/components/recipes/editor/RecipeEditor';
import { BackButton } from '@/components/ui/BackButton';
import { InventoryItemUI } from '@/components/recipes/editor/types';

// Ja no necessitem params ni getDictionary aquí
export default async function CreateRecipePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const inventoryRepo = new SupabaseInventoryRepository();
  const inventoryEntities = user ? await inventoryRepo.findByUser(user.id) : [];

  const plainInventory: InventoryItemUI[] = inventoryEntities.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      emoji: item.emoji || null 
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
      <div className="container mx-auto px-4 py-6">
        
        <header className="flex items-center justify-between mb-8">
            {/* Nota: BackButton podria necessitar traducció, 
                però normalment 'Cancel·lar' o una icona és suficient */}
            <BackButton href="/recipes" label="Cancel·lar" className="bg-slate-900/50 backdrop-blur-md" />
            
            <div className="text-right">
                <span className="text-2xl">👨‍🍳</span>
            </div>
        </header>

        {/* ✅ Ara no es queixarà de 'labels' perquè no és obligatori */}
        <RecipeEditor userInventory={plainInventory} />
      </div>
    </main>
  );
}