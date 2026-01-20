// src/app/(dashboard)/inventory/InventoryManager.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { isItemExpiringSoon } from '@/lib/inventoryUtils';

// ✅ Custom Hooks & Components (Refactorització)
import { useInventoryData } from './hooks/useInventoryData';

// Components existents
import { BulkAddItemForm } from './actions/BulkAddItemForm';
import { InventoryList } from './dashboard/InventoryList';
import { InventoryHeader } from './dashboard/InventoryHeader';
import { CameraScanner } from '@/components/scanner/CameraScanner';
import { ScannedListEditor } from '@/components/scanner/ScannedListEditor';
import { AROverlay } from '@/components/scanner/AROverlay';

// UI Utils
import { Loader2 } from 'lucide-react';
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';
import { useRealtimeInventory } from './hooks/useRealTimeInventroy';
export type DashboardFilter = StorageLocation | 'EXPIRING' | null;

interface InventoryManagerProps {
  initialItems: InventoryItemProps[];
}

export function InventoryManager({ initialItems }: InventoryManagerProps) {
  const { t } = useLanguage();

  // 1. Hook de Dades (Tota la lògica complexa està aquí)
  const {
    scope,
    setScope,
    items,
    rooms,
    isLoading,
    refreshInventory
  } = useInventoryData(initialItems);

  useRealtimeInventory(scope, refreshInventory);

  // 2. Estats locals de UI
  const [filter, setFilter] = useState<DashboardFilter>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Scanner State
  const [showCamera, setShowCamera] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(true);

  // ✅ 1. CREEM AQUESTA FUNCIÓ PER FORÇAR LA NETEJA
  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds(new Set()); // <--- AIXÒ ÉS EL QUE FALTAVA!
  }, []);

  // 3. Lògica de Filtratge
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter === null) return true;
      if (filter === 'EXPIRING') return isItemExpiringSoon(item, 3);
      return item.location === filter;
    });
  }, [items, filter]);

  // 4. Lògica de Selecció
  const handleToggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => {
      const newMode = !prev;
      if (!newMode) setSelectedIds(new Set());
      return newMode;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (filteredItems.length === 0) return;
    const visibleIds = filteredItems.map(i => i.id);
    const allVisibleSelected = visibleIds.every(id => selectedIds.has(id));
    const newSelection = new Set(selectedIds);

    if (allVisibleSelected) visibleIds.forEach(id => newSelection.delete(id));
    else visibleIds.forEach(id => newSelection.add(id));

    setSelectedIds(newSelection);
  }, [filteredItems, selectedIds]);

  // 5. Onboarding (Tour)
  // 5. Onboarding (Tour)
  const { startTour } = useOnboarding();

  const onboardingSteps: TourStep[] = useMemo(() => [
    { targetId: 'tour-inv-header', title: t.onboarding.inventory.step1_title, description: t.onboarding.inventory.step1_desc },
    { targetId: 'tour-inv-filters', title: t.onboarding.inventory.step2_title, description: t.onboarding.inventory.step2_desc },
    { targetId: 'tour-inv-scan', title: t.onboarding.inventory.step4_title, description: t.onboarding.inventory.step4_desc },
    { targetId: 'tour-inv-add', title: t.onboarding.inventory.step5_title, description: t.onboarding.inventory.step5_desc },
    { targetId: 'tour-inv-list', title: t.onboarding.inventory.step6_title, description: t.onboarding.inventory.step6_desc }
  ], [t]); // Dependències correctes

  // ✅ CORRECCIÓ: Aquest és l'efecte que faltava i que feia saltar l'error "unused"
  useEffect(() => {
    // Petit retard per assegurar que el DOM està llest
    const timer = setTimeout(() => {
      startTour('inventory', onboardingSteps);
    }, 500);
    return () => clearTimeout(timer);
  }, [startTour, onboardingSteps]);
  // --- RENDERS ALTERNATIUS (Scanner) ---
  if (scannedItems && capturedImage) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-black shadow-2xl flex-[0_0_40%]">
          <AROverlay imageSrc={capturedImage} items={scannedItems} onItemClick={console.log} />
        </div>
        <div className="flex-1 min-w-0 h-full relative">
          <ScannedListEditor
            initialItems={scannedItems}
            showImageToggle={true}
            isImageVisible={showImage}
            onToggleImage={() => setShowImage(!showImage)}
            onCancel={() => { setScannedItems(null); setCapturedImage(null); }}
            onFinish={() => { setScannedItems(null); setCapturedImage(null); refreshInventory(); }}
          />
        </div>
      </div>
    );
  }

  if (showCamera) {
    return (
      <CameraScanner
        onItemsFound={(it, img) => { setShowCamera(false); setScannedItems(it); setCapturedImage(img); }}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  // --- RENDER PRINCIPAL ---
  return (
    <div className="min-h-screen bg-slate-950 pb-20 relative">

      <div id="tour-inv-header" className="sticky top-2 z-40 bg-slate-950/80 backdrop-blur-md pb-2">
        <InventoryHeader
          extraActions={<TourTrigger tourId="inventory" steps={onboardingSteps} />}
          items={items}
          activeFilter={filter}
          onFilterChange={(f) => { setFilter(f); setShowAddForm(false); }}
          onScan={() => setShowCamera(true)}
          onToggleAdd={() => setShowAddForm(!showAddForm)}
          isAddFormVisible={showAddForm}
          isSelectionMode={isSelectionMode}
          onToggleSelectionMode={handleToggleSelectionMode}
          onSelectAll={handleSelectAll}
          scope={scope}
          setScope={setScope}
          rooms={rooms}

        />
      </div>

      {/* OVERLAY FORM (ADD) */}
      <div className={`
          fixed inset-0 z-50 bg-slate-950 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${showAddForm ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-[110%] opacity-0 pointer-events-none'}
      `}>
        {showAddForm && (
          <BulkAddItemForm
            onClose={() => { setShowAddForm(false); refreshInventory(); }}
            activeRoomId={scope === 'PERSONAL' ? undefined : scope}
          />
        )}
      </div>



      {/* LLISTA D'ITEMS */}
      <div id="tour-inv-list" className="px-2 mt-4 relative min-h-75">

        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-start justify-center pt-20 bg-slate-950/60 backdrop-blur-[1px]">
            <div className="bg-slate-900 border border-slate-700 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl">
              <Loader2 className="animate-spin text-emerald-400" size={20} />
              <span className="text-sm text-slate-200">Carregant inventari...</span>
            </div>
          </div>
        )}

        <InventoryList
          items={filteredItems}
          externalSelectionMode={isSelectionMode}
          onSelectionModeChange={setIsSelectionMode}
          selectedIds={selectedIds}
          onToggleItem={(id) => {
            const newSet = new Set(selectedIds);
            if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
            setSelectedIds(newSet);
          }}
          // ✅ 3. AFEGIM AIXÒ: Quan refresquem (després d'esborrar), també sortim
          onRefresh={() => {
            refreshInventory();
            exitSelectionMode(); // <--- Assegurem que es tanca el dialog
          }}
        />
      </div>
    </div>
  );
}
