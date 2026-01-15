// app/recipes/new/page.tsx
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container'; // ✅ 1. Importem el container
import { RecipeEditor } from '@/components/recipes/editor/RecipeEditor';
import { InventoryItemUI } from '@/components/recipes/editor/types';
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
import { redirect } from 'next/navigation';

export default async function CreateRecipePage() {
  // 1. Creem el client de Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // ❌ ABANS (Això donaria error ara):
  // const inventoryRepo = new SupabaseInventoryRepository();

  // ✅ ARA (Correcte amb Injecció de Dependències):
  const getUserInventory = container.getGetUserInventory(supabase);
  const inventoryEntities = await getUserInventory.execute(user.id);

  const plainInventory: InventoryItemUI[] = inventoryEntities.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    // Convertim qualsevol valor falsy a undefined
    emoji: item.emoji || undefined
  }));

  return (
    <OnboardingProvider>
      <OnboardingOverlay />


      <div className="h-dvh overflow-hidden flex flex-col"> {/* 100dvh és millor per mòbils */}
        <RecipeEditor userInventory={plainInventory} />
      </div>

    </OnboardingProvider>
  );
}