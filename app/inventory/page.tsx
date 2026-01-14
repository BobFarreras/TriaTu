// src/app/inventory/page.tsx

import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { InventoryManager } from '@/components/inventory/InventoryManager';

import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
import { redirect } from 'next/navigation';

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirecció o missatge si no hi ha usuari
  if (!user) redirect('/auth/login');

  // ✅ FIX: Passem 'supabase' al contenidor per injectar la dependència
  const useCase = container.getGetUserInventory(supabase);
  
  const domainItems = await useCase.execute(user.id);
  const plainItems = domainItems.map(item => item.props);

  return (
    <OnboardingProvider>
      <OnboardingOverlay />

      <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <InventoryManager items={plainItems} />
        </div>
      </main>

    </OnboardingProvider>
  );
}