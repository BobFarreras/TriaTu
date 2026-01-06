// src/app/inventory/page.tsx

import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { InventoryManager } from '@/components/inventory/InventoryManager';

// ✅ 1. Importem el Provider i l'Overlay
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div className="p-10 text-white">Inicia sessió si us plau.</div>;

  // 1. Dades
  const useCase = container.getGetUserInventory();
  const domainItems = await useCase.execute(user.id);
  const plainItems = domainItems.map(item => item.props);

  return (
    // ✅ 2. Envoltem TOTA la pàgina amb el Provider
    <OnboardingProvider>
      
      {/* ✅ 3. Afegim l'Overlay perquè es vegin les caixes del tour */}
      <OnboardingOverlay />

      <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* El Header s'ha mogut DINS de InventoryManager per gestionar la seva visibilitat */}
          <InventoryManager items={plainItems} />
        </div>
      </main>

    </OnboardingProvider>
  );
}