// src/app/(dashboard)/inventory/InventoryManager.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { isItemExpiringSoon } from '@/lib/inventoryUtils';

// Components
import { BulkAddItemForm } from './actions/BulkAddItemForm';
import { InventoryList } from './dashboard/InventoryList';
import { InventoryHeader } from './dashboard/InventoryHeader';
import { CameraScanner } from '../scanner/CameraScanner';
import { ScannedListEditor } from '../scanner/ScannedListEditor';
import { AROverlay } from '../scanner/AROverlay';

// Onboarding
import { useOnboarding, TourStep } from '@/components/onboarding/OnboardingContext';
import { TourTrigger } from '@/components/onboarding/TourTrigger';

export type DashboardFilter = StorageLocation | 'EXPIRING' | null;

interface InventoryManagerProps {
  items: InventoryItemProps[];
}

export function InventoryManager({ items }: InventoryManagerProps) {
  const { t } = useLanguage();

  // --- ESTAT: FILTRES I VISUALITZACIÓ ---
  const [filter, setFilter] = useState<DashboardFilter>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // --- ESTAT: SELECCIÓ (LIFTED STATE) ---
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // --- ESTAT: SCANNER ---
  const [showCamera, setShowCamera] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(true);

  // --- CONFIGURACIÓ TOUR ---
  const { startTour } = useOnboarding();

  /* REFACTOR ONBOARDING:
     Hem ajustat els IDs per coincidir amb l'arquitectura actual.
     Els IDs 'tour-inv-scan' i 'tour-inv-add' s'han de passar al Header.
     Si 'tour-inv-stats' ja no existeix visualment com a target independent, 
     el podem treure o apuntar al Header general.
  */
  const onboardingSteps: TourStep[] = useMemo(() => [
    { 
      targetId: 'tour-inv-header', 
      title: t.onboarding.inventory.step1_title, 
      description: t.onboarding.inventory.step1_desc 
    },
    // Si els filtres estan dins del header, apuntem al header o a un ID específic si el Header l'exposa
    { 
      targetId: 'tour-inv-filters', 
      title: t.onboarding.inventory.step2_title, 
      description: t.onboarding.inventory.step2_desc 
    },
    { 
      targetId: 'tour-inv-scan', 
      title: t.onboarding.inventory.step4_title, 
      description: t.onboarding.inventory.step4_desc 
    },
    { 
      targetId: 'tour-inv-add', 
      title: t.onboarding.inventory.step5_title, 
      description: t.onboarding.inventory.step5_desc 
    },
    { 
      targetId: 'tour-inv-list', 
      title: t.onboarding.inventory.step6_title, 
      description: t.onboarding.inventory.step6_desc 
    }
  ], [t]);

  useEffect(() => {
    // Petit delay per assegurar que el DOM està muntat abans d'iniciar el tour
    const timer = setTimeout(() => {
        startTour('inventory', onboardingSteps);
    }, 500);
    return () => clearTimeout(timer);
  }, [startTour, onboardingSteps]);

  // --- LOGICA DE NEGOCI: FILTRATGE ---
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter === null) return true;
      if (filter === 'EXPIRING') return isItemExpiringSoon(item, 3);
      return item.location === filter;
    });
  }, [items, filter]);

  // --- LOGICA DE NEGOCI: SELECCIÓ ---
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
    
    if (allVisibleSelected) {
      visibleIds.forEach(id => newSelection.delete(id));
    } else {
      visibleIds.forEach(id => newSelection.add(id));
    }
    
    setSelectedIds(newSelection);
  }, [filteredItems, selectedIds]);

  // --- VISTA 1: EDITOR (MODE CÀMERA) ---
  if (scannedItems && capturedImage) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
        <div className={`relative rounded-3xl overflow-hidden border border-slate-800 bg-black shadow-2xl transition-all duration-500 ${showImage ? 'flex-[0_0_40%] opacity-100' : 'flex-[0_0_0%] opacity-0'}`}>
          <AROverlay imageSrc={capturedImage} items={scannedItems} onItemClick={console.log} />
        </div>
        <div className="flex-1 min-w-0 h-full relative">
          <ScannedListEditor
            initialItems={scannedItems}
            showImageToggle={true}
            isImageVisible={showImage}
            onToggleImage={() => setShowImage(!showImage)}
            onCancel={() => { setScannedItems(null); setCapturedImage(null); }}
            onFinish={() => { setScannedItems(null); setCapturedImage(null); window.location.reload(); }}
          />
        </div>
      </div>
    );
  }

  // --- VISTA 2: CÀMERA EN VIU ---
  if (showCamera) {
    return (
      <CameraScanner
        onItemsFound={(items, img) => { setShowCamera(false); setScannedItems(items); setCapturedImage(img); }}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  // --- VISTA 3: DASHBOARD PRINCIPAL ---
  return (
    <div className="min-h-screen bg-slate-950 pb-20 relative">

      {/* 1. SUPER HEADER */}
      {/* ID 'tour-inv-header' pel pas 1. 
          Passem IDs específics ('scanBtnId', 'addBtnId') perquè el Header els assigni internament als botons DOM reals.
          Això respecta l'encapsulació: el Header decideix on posar l'ID, el Manager només diu quin ID és.
      */}
      <div id="tour-inv-header" className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md pt-4 pb-2">
        <InventoryHeader

        // ✅ INJECTEM EL TOUR AQUÍ
           // El Header el col·locarà al seu lloc, però el Manager controla la configuració
           extraActions={
              <TourTrigger tourId="inventory" steps={onboardingSteps} />
           }
          items={items}
          activeFilter={filter}
          onFilterChange={(f) => { setFilter(f); setShowAddForm(false); }}
          
          // Accions
          onScan={() => setShowCamera(true)}
          onToggleAdd={() => setShowAddForm(!showAddForm)}
          isAddFormVisible={showAddForm}
          
          // Selecció
          isSelectionMode={isSelectionMode}
          onToggleSelectionMode={handleToggleSelectionMode}
          onSelectAll={handleSelectAll}

          // Props per al Tour (Assegura't que InventoryHeader les implementa)
          scanBtnId="tour-inv-scan"
          addBtnId="tour-inv-add"
          filterContainerId="tour-inv-filters"
        />
      </div>

      {/* 2. OVERLAY FORM */}
      <div
        className={`
          fixed inset-0 z-50 bg-slate-950 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${showAddForm ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'}
        `}
      >
        {showAddForm && (
          <BulkAddItemForm onClose={() => setShowAddForm(false)} />
        )}
      </div>

      {/* 3. LLISTA D'ITEMS */}
      {/* Embolcallem la llista amb l'ID que espera el tour */}
      <div id="tour-inv-list" className="px-2 mt-4">
        <InventoryList
          items={filteredItems}
          externalSelectionMode={isSelectionMode}
          onSelectionModeChange={setIsSelectionMode}
          selectedIds={selectedIds}
          onToggleItem={(id) => {
            const newSet = new Set(selectedIds);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            setSelectedIds(newSet);
          }}
        />
      </div>

    </div>
  );
}