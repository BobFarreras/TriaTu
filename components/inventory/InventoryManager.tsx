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
   // Elevem l'estat perquè el Header pugui manipular la llista
   const [isSelectionMode, setIsSelectionMode] = useState(false);
   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

   // --- ESTAT: SCANNER ---
   const [showCamera, setShowCamera] = useState(false);
   const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
   const [capturedImage, setCapturedImage] = useState<string | null>(null);
   const [showImage, setShowImage] = useState(true);

   // --- CONFIGURACIÓ TOUR (Sense canvis) ---
   const { startTour } = useOnboarding();
   const onboardingSteps: TourStep[] = useMemo(() => [
      { targetId: 'tour-inv-header', title: t.onboarding.inventory.step1_title, description: t.onboarding.inventory.step1_desc },
      { targetId: 'tour-inv-stats', title: t.onboarding.inventory.step2_title, description: t.onboarding.inventory.step2_desc },
      { targetId: 'tour-inv-expiring', title: t.onboarding.inventory.step3_title, description: t.onboarding.inventory.step3_desc },
      { targetId: 'tour-inv-scan', title: t.onboarding.inventory.step4_title, description: t.onboarding.inventory.step4_desc },
      { targetId: 'tour-inv-add', title: t.onboarding.inventory.step5_title, description: t.onboarding.inventory.step5_desc },
      { targetId: 'tour-inv-list', title: t.onboarding.inventory.step6_title, description: t.onboarding.inventory.step6_desc }
   ], [t]);

   useEffect(() => {
      startTour('inventory', onboardingSteps);
   }, [startTour, onboardingSteps]);

   // --- LOGICA DE NEGOCI: FILTRATGE ---
   // Memoritzem per evitar recalcúl en cada render si no canvia res
   const filteredItems = useMemo(() => {
      return items.filter((item) => {
         if (filter === null) return true;
         if (filter === 'EXPIRING') return isItemExpiringSoon(item, 3);
         return item.location === filter;
      });
   }, [items, filter]);

   // --- LOGICA DE NEGOCI: SELECCIÓ ---

   // 1. Alternar mode selecció
   const handleToggleSelectionMode = () => {
      const newMode = !isSelectionMode;
      setIsSelectionMode(newMode);
      if (!newMode) {
         setSelectedIds(new Set()); // Netejar selecció en sortir
      }
   };

   // 2. Seleccionar TOT (Requisit Usuari)
   // Només selecciona els items visibles actualment (filtrats)
   // ✅ 3. LA FUNCIÓ QUE FALLA: SELECT ALL
   const handleSelectAll = useCallback(() => {
      console.log("🟢 CLICK: Select All");
      console.log("Items filtrats actuals:", filteredItems.length);

      if (filteredItems.length === 0) {
         console.warn("⚠️ ALERTA: No hi ha items visibles per seleccionar!");
         return;
      }

      const newSelection = new Set(selectedIds);
      const visibleIds = filteredItems.map(i => i.id);

      // Debug dels IDs (comprova que no siguin undefined)
      console.log("IDs visibles:", visibleIds.slice(0, 3), "...");

      // Comprovem estat actual
      const allVisibleAreSelected = visibleIds.every(id => newSelection.has(id));
      console.log("Estan tots seleccionats?", allVisibleAreSelected);

      if (allVisibleAreSelected) {
         console.log("Acció: Deseleccionar tot");
         visibleIds.forEach(id => newSelection.delete(id));
      } else {
         console.log("Acció: Seleccionar tot");
         visibleIds.forEach(id => newSelection.add(id));
      }

      console.log("Nova mida de selecció:", newSelection.size);
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
      <div className="min-h-screen bg-slate-950 pb-20">

         {/* TOUR TRIGGER */}
         <div className="absolute top-0 right-0 z-50">
            <TourTrigger tourId="inventory" steps={onboardingSteps} />
         </div>

         {/* 1. SUPER HEADER */}
         <div id="tour-inv-header">
            <InventoryHeader
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
               onSelectAll={handleSelectAll} // ✅ Passem la funció
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

         {/* LLISTA */}
         <div className="px-2">
            <InventoryList
               items={filteredItems}

               // ⚠️ ASSEGURA'T QUE PASSES AQUESTES PROPS
               externalSelectionMode={isSelectionMode}
               onSelectionModeChange={setIsSelectionMode}

               selectedIds={selectedIds}       // <--- CLAU PERQUÈ ES VEGI EL CHECK
               onToggleItem={(id) => {         // <--- CLAU PERQUÈ EL CLICK INDIVIDUAL FUNCIONI
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