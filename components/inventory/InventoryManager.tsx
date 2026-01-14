// src/components/inventory/InventoryManager.tsx
'use client';

import { useState, useEffect, useMemo } from 'react'; // ✅ useMemo & useEffect
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { isItemExpiringSoon } from '@/lib/inventoryUtils';
import { BulkAddItemForm } from './BulkAddItemForm'; // ✅ Importem el nou component
// UI Components
import { InventoryStats } from './InventoryStats';
import { InventoryList } from './InventoryList';

import { CameraScanner } from '../scanner/CameraScanner';
import { ScannedListEditor } from '../scanner/ScannedListEditor';
import { AROverlay } from '../scanner/AROverlay';
import { InventoryHeader } from './InventoryHeader';

// ✅ ONBOARDING IMPORTS
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

   // ESTATS SCANNER
   const [showCamera, setShowCamera] = useState(false);
   const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
   const [capturedImage, setCapturedImage] = useState<string | null>(null);
   const [showImage, setShowImage] = useState(true);

   // ✅ CONFIGURACIÓ DEL TOUR
   const { startTour } = useOnboarding();

   const onboardingSteps: TourStep[] = useMemo(() => [
      {
         targetId: 'tour-inv-header',
         title: t.onboarding.inventory.step1_title,
         description: t.onboarding.inventory.step1_desc
      },
      {
         targetId: 'tour-inv-stats',
         title: t.onboarding.inventory.step2_title,
         description: t.onboarding.inventory.step2_desc
      },
      {
         targetId: 'tour-inv-expiring',
         title: t.onboarding.inventory.step3_title,
         description: t.onboarding.inventory.step3_desc
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

   // Iniciar tour automàticament (amb ID 'inventory')
   useEffect(() => {
      startTour('inventory', onboardingSteps);
   }, [startTour, onboardingSteps]);


   // Lògica Filtres
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
         <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] transition-all duration-500 ease-in-out">
          
            <div className={`relative rounded-3xl overflow-hidden border border-slate-800 bg-black shadow-2xl transition-all duration-500 ${showImage ? 'flex-[0_0_40%] min-h-64 opacity-100' : 'flex-[0_0_0%] min-h-0 border-0 opacity-0 overflow-hidden'}`}>
               <div className="absolute inset-0 w-full h-full">
                  <AROverlay
                     imageSrc={capturedImage}
                     items={scannedItems}
                     onItemClick={(idx) => console.log("Clicat item:", idx)}
                  />
               </div>
            </div>
            <div className="flex-1 min-w-0 h-full relative">
               <ScannedListEditor
                  initialItems={scannedItems}
                  showImageToggle={true}
                  isImageVisible={showImage}
                  onToggleImage={() => setShowImage(!showImage)}
                  onCancel={() => { setScannedItems(null); setCapturedImage(null); setShowImage(true); }}
                  onFinish={() => { setScannedItems(null); setCapturedImage(null); window.location.reload(); }}
               />
            </div>
         </div>
      );
   }

   // --- VISTA 2: CÀMERA EN VIVO ---
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
      <div className="space-y-6 relative">

         {/* ✅ BOTÓ TOUR TRIGGER */}
         <div className="absolute top-0 right-0 z-10">
            <TourTrigger tourId="inventory" steps={onboardingSteps} />
         </div>

         {/* Header amb ID */}
         <div id="tour-inv-header">
            <InventoryHeader totalItems={items.length} />
         </div>

         {/* Stats (Els IDs estan dins del component InventoryStats) */}
         <InventoryStats
            items={items}
            activeFilter={filter}
            onFilterChange={(f) => { setFilter(f); setShowAddForm(false); }}
         />

         {/* Toolbar */}
         <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 px-2">
               <h2 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  {title}
               </h2>
               {filter && (
                  <button onClick={() => setFilter(null)} className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 hover:text-white transition-colors">
                     {t.inventory.dashboard.clear_filter}
                  </button>
               )}
            </div>

            <div className="flex gap-2">
               {/* ✅ ID SCAN BUTTON */}
               <button
                  id="tour-inv-scan"
                  onClick={() => setShowCamera(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 shadow-sm hover:scale-105"
               >
                  <span className="text-lg">📷</span>
                  <span className="hidden sm:inline">{t.inventory.dashboard.scan_btn}</span>
               </button>

               {/* ✅ ID ADD BUTTON */}
               <button
                  id="tour-inv-add"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-lg
                  ${showAddForm
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                        : 'bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:scale-105'
                     }
               `}
               >
                  {showAddForm ? `❌ ${t.inventory.dashboard.close_btn}` : `➕ ${t.inventory.dashboard.add_btn}`}
               </button>
            </div>
         </div>
         <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAddForm ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'}`}>

         </div>
         {/* ZONA DESPLEGABLE DEL FORMULARI */}
         <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAddForm ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pt-2 pb-6 px-1">
               {/* ✅ AQUI ESTÀ EL CANVI PRINCIPAL */}
               {showAddForm && (
                  <BulkAddItemForm onClose={() => setShowAddForm(false)} />
               )}
            </div>
         </div>

         {/* ✅ ID LLISTA */}
         <div id="tour-inv-list">
            <InventoryList items={filteredItems} />
         </div>
      </div>
   );
}