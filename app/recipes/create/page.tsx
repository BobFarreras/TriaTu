// app/recipes/new/page.tsx
import { createClient } from '@/adapters/supabase/server';
import { SupabaseInventoryRepository } from '@/adapters/supabase/SupabaseInventoryRepository';
import { RecipeEditor } from '@/components/recipes/editor/RecipeEditor';
import { InventoryItemUI } from '@/components/recipes/editor/types';

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
    // ✅ CANVI CLAU: h-dvh assegura que ocupa el 100% de la pantalla del mòbil sense scroll
    // i overflow-hidden evita que res surti fora.
    <main className="h-dvh w-full bg-slate-950 text-white overflow-hidden flex flex-col">
       <RecipeEditor userInventory={plainInventory} />
    </main>
  );
}