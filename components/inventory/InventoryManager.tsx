'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { isItemExpiringSoon } from '@/lib/inventoryUtils';

// Components Nous/Refactoritzats
import { BulkAddItemForm } from './actions/BulkAddItemForm';

import { InventoryList } from './dashboard/InventoryList';
import { InventoryHeader } from './dashboard/InventoryHeader';


// Scanner Components
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
   const [filter, setFilter] = useState<DashboardFilter>(null);
   const [showAddForm, setShowAddForm] = useState(false);
   // ✅ NOU ESTAT: Mode Selecció (controlat des de dalt)
   const [isSelectionMode, setIsSelectionMode] = useState(false);
   // ESTATS SCANNER
   const [showCamera, setShowCamera] = useState(false);
   const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
   const [capturedImage, setCapturedImage] = useState<string | null>(null);
   const [showImage, setShowImage] = useState(true);

   // CONFIGURACIÓ TOUR
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

   // LÒGICA FILTRES
   const filteredItems = items.filter((item) => {
      if (filter === null) return true;
      if (filter === 'EXPIRING') return isItemExpiringSoon(item, 3);
      return item.location === filter;
   });

   // TÍTOL DINÀMIC
   let title = t.inventory.dashboard.title_all;
   if (filter === 'EXPIRING') {
      title = t.inventory.dashboard.title_expiring;
   } else if (filter) {
      const locationsDict = t.inventory.form.location as Record<string, string>;
      const locName = locationsDict[filter.toLowerCase()] || filter;
      title = `${t.inventory.dashboard.filter_prefix} ${locName}`;
   }

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

         {/* 1. SUPER HEADER (Fusionat) */}
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
               onToggleSelectionMode={() => setIsSelectionMode(!isSelectionMode)}
            />
         </div>

         {/* ✅ FULL SCREEN OVERLAY: Això substitueix el div desplegable d'abans */}
         {/* Fem servir z-50 per tapar-ho tot, inclòs el header i la toolbar */}
         <div
            className={`
               fixed inset-0 z-50 bg-slate-950 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
               ${showAddForm ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'}
            `}
         >
            {/* Només muntem el component quan toca per rendiment */}
            {showAddForm && (
               <BulkAddItemForm onClose={() => setShowAddForm(false)} />
            )}
         </div>

         {/* 3. LLISTA (Rebem el mode selecció des del pare) */}
         <div className="px-2">
            <InventoryList
               items={filteredItems}
               // ✅ Passem el control al fill
               externalSelectionMode={isSelectionMode}
               onSelectionModeChange={setIsSelectionMode}
            />
         </div>

      </div>
   );
}