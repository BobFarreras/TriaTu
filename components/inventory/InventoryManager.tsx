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
  
  // ✅ FIX: Estat per rastrejar canvis en les props (Pattern: Derived State from Props)
  const [prevItems, setPrevItems] = useState(items);

  // --- ESTAT: SCANNER ---
  const [showCamera, setShowCamera] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(true);

  // --- CONFIGURACIÓ TOUR ---
  const { startTour } = useOnboarding();

  const onboardingSteps: TourStep[] = useMemo(() => [
    { 
      targetId: 'tour-inv-header', 
      title: t.onboarding.inventory.step1_title, 
      description: t.onboarding.inventory.step1_desc 
    },
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
    const timer = setTimeout(() => {
        startTour('inventory', onboardingSteps);
    }, 500);
    return () => clearTimeout(timer);
  }, [startTour, onboardingSteps]);

  // ---------------------------------------------------------
  // ✅ FIX: SINCRONITZACIÓ D'ESTAT DURANT EL RENDER
  // ---------------------------------------------------------
  // En lloc d'un useEffect, verifiquem si els items han canviat respecte
  // al render anterior. Si és així, ajustem la selecció immediatament.
  if (items !== prevItems) {
    setPrevItems(items); // Actualitzem la referència per al futur

    // Només si tenim selecció activa, comprovem la integritat
    if (selectedIds.size > 0) {
        const currentItemIds = new Set(items.map(i => i.id));
        
        // Filtrem els IDs que ja no existeixen (perquè s'han eliminat)
        const validSelectionArray = Array.from(selectedIds).filter(id => currentItemIds.has(id));

        // Si hi ha discrepància, actualitzem l'estat ARA MATEIX
        if (validSelectionArray.length !== selectedIds.size) {
            const newSet = new Set(validSelectionArray);
            setSelectedIds(newSet);
            
            // Si hem buidat la llista, sortim del mode selecció
            if (newSet.size === 0) {
                setIsSelectionMode(false);
            }
            // ⚠️ Nota arquitectònica: Quan crides setState dins del render,
            // React interromp el render actual i en comença un de nou immediatament.
            // Això és més eficient i net que un useEffect per a sincronització de dades.
        }
    }
  }

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
      <div id="tour-inv-header" className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md pt-4 pb-2">
        <InventoryHeader
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

          // Props per al Tour
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