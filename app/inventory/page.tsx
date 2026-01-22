// src/app/inventory/page.tsx

import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { InventoryManager } from '@/features/inventory/InventoryManager'; // Assegura't que la ruta és correcta
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
import { redirect } from 'next/navigation';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { getCurrentUser } from '@/lib/auth/session';

export default async function InventoryPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/auth/login');

  // 1. Càrrega inicial: Inventari PERSONAL
  const supabase = await createClient();
  const useCase = container.getGetUserInventory(supabase);
  const domainItems = (await useCase.execute(user.id)) as InventoryItem[];
  
  // Convertim a primitius per passar al Client Component
  const plainItems = domainItems.map(item => item.toPrimitives());

return (
    <OnboardingProvider>
      <OnboardingOverlay />

      {/* ✅ CORRECCIÓ: Treiem 'p-4 md:p-6' i posem 'p-0'. 
          Així el header sticky tocarà el sostre del navegador. */}
      <main className="min-h-screen bg-slate-950 text-slate-100 p-1"> 
        <div className="max-w-6xl mx-auto">
          <InventoryManager initialItems={plainItems} />
        </div>
      </main>

    </OnboardingProvider>
  );
}
