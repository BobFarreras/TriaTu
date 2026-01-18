// ARXIU: src/app/shopping-list/page.tsx
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { ShoppingListManager } from '@/components/shopping/ShoppingListManager';

// ✅ 1. IMPORTAR TOTS DOS: Provider (Lògica) i Overlay (Visual)
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay'; // <--- AQUEST FALTAVA

// Imports de domini i mappers
import { ShoppingListItem } from '@/core/domain/entities/ShoppingListItem';
import { ShoppingSession } from '@/core/domain/entities/ShoppingSession';
import { ShoppingItemUI } from '@/components/shopping/ShoppingListItem';
import { HistorySession } from '@/components/shopping/ShoppingHistory';

export default async function ShoppingListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // Dependency Injection
  const getShoppingList = container.getGetShoppingList(supabase);
  const getHistory = container.getGetShoppingHistory(supabase);

  // Data Fetching
  const [items, history] = await Promise.all([
    getShoppingList.execute(user.id),
    getHistory.execute(user.id)
  ]);

  // Mapping
  const plainItems = mapItemsToViewModel(items);
  const plainHistory = mapHistoryToViewModel(history);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 pb-32">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="flex items-center justify-between mb-6">
          <BackButton/>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            📝 Compra Activa
          </h1>

        </div>

        {/* ✅ 2. ESTRUCTURA CORRECTA D'ONBOARDING */}
        <OnboardingProvider>
          {/* L'Overlay ha d'estar DINS del provider però AL COSTAT del contingut */}
          <OnboardingOverlay />

          <ShoppingListManager initialItems={plainItems} history={plainHistory} />
        </OnboardingProvider>

      </div>
    </main>
  );
}

// === PRESENTATION MAPPERS ===

function mapItemsToViewModel(items: ShoppingListItem[]): ShoppingItemUI[] {
  return items.map((i) => ({
    id: i.props.id,
    name: i.props.name,
    quantity: i.props.quantity,
    unit: i.props.unit,
    isChecked: i.props.isChecked,
    emoji: i.props.emoji,
    productId: i.props.productId ?? undefined,
    productImage: i.props.productImage ?? undefined,
    estimatedCost: i.props.estimatedCost ?? undefined
  }));
}

function mapHistoryToViewModel(history: ShoppingSession[]): HistorySession[] {
  return history.map((h) => ({
    id: h.props.id,
    createdAt: h.props.createdAt,
    totalCost: h.props.totalCost,
    itemCount: h.props.itemCount,
    itemsSnapshot: h.props.itemsSnapshot
  }));
}