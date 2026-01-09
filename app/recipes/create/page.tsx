// app/recipes/new/page.tsx
import { createClient } from '@/adapters/supabase/server';
import { SupabaseInventoryRepository } from '@/adapters/supabase/SupabaseInventoryRepository';
import { RecipeEditor } from '@/components/recipes/editor/RecipeEditor';
import { InventoryItemUI } from '@/components/recipes/editor/types';
// ✅ Imports nous
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
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
    // ❌ ABANS: emoji: item.emoji || null  (Error: null no és assignable a undefined)
    // ✅ ARA: Convertim qualsevol valor falsy (null, "", undefined) a undefined
    emoji: item.emoji || undefined
  }));

  return (
    // 1. Envoltem amb el Provider
    <OnboardingProvider>

      {/* 2. Afegim l'Overlay visual (estarà ocult fins que s'activi) */}
      <OnboardingOverlay />

      {/* 3. L'Editor de sempre */}
      <div className="h-[calc(100vh-(--spacing(16)))] lg:h-screen">
        <RecipeEditor userInventory={plainInventory} />
      </div>

    </OnboardingProvider>
  );
}