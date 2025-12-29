'use client';

import { useState } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { isItemExpiringSoon } from '@/lib/inventoryUtils';

// UI Components
import { InventoryStats } from './InventoryStats';
import { InventoryList } from './InventoryList';
import { AddItemForm } from './AddItemForm';
import { CameraScanner } from '../scanner/CameraScanner';
import { ScannedListEditor } from '../scanner/ScannedListEditor';
import { AROverlay } from '../scanner/AROverlay';

export type DashboardFilter = StorageLocation | 'EXPIRING' | null;

interface InventoryManagerProps {
  items: InventoryItemProps[];
}

export function InventoryManager({ items }: InventoryManagerProps) {
  const [filter, setFilter] = useState<DashboardFilter>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // ESTATS SCANNER
  const [showCamera, setShowCamera] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // NOU: Guardem la foto

  // Lògica Filtres
  const filteredItems = items.filter((item) => {
    if (filter === null) return true;
    if (filter === 'EXPIRING') return isItemExpiringSoon(item, 3);
    return item.location === filter;
  });
  
  let title = "📦 Tot l'Inventari";
  if (filter === 'EXPIRING') title = "⚠️ Caduca Aviat";
  else if (filter) title = `📂 ${filter}`;

  // --- VISTA 1: RESULTAT AR + EDITOR (Split Screen) ---
  if (scannedItems && capturedImage) {
      return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-100px)]">
              
              {/* ESQUERRA: REALITAT AUGMENTADA (Visible en Mobile també) */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-black shadow-2xl min-h-75 lg:min-h-0">
                 <AROverlay 
                    imageSrc={capturedImage} 
                    items={scannedItems} 
                    onItemClick={(idx) => {
                        console.log("Clicat item:", idx);
                        // Futur: Fer scroll automàtic a l'item de la dreta
                    }}
                 />
              </div>

              {/* DRETA: LLISTA LATERAL (EDITOR) */}
              <div className="overflow-y-auto pr-1">
                 <ScannedListEditor 
                    initialItems={scannedItems} 
                    
                    onCancel={() => {
                        setScannedItems(null);
                        setCapturedImage(null);
                    }}
                    onFinish={() => {
                        setScannedItems(null);
                        setCapturedImage(null);
                        window.location.reload();
                    }}
                 />
              </div>
          </div>
      );
  }

  // --- VISTA 2: CÀMERA EN VIVO ---
  if (showCamera) {
      return (
          <CameraScanner 
            onItemsFound={(items, img) => {
                setShowCamera(false);
                setScannedItems(items);
                setCapturedImage(img); // Guardem la foto per l'AR
            }} 
            onCancel={() => setShowCamera(false)} 
          />
      );
  }

  // --- VISTA 3: DASHBOARD PRINCIPAL ---
  return (
    <div className="space-y-6">
      <InventoryStats 
        items={items} 
        activeFilter={filter} 
        onFilterChange={(f) => { setFilter(f); setShowAddForm(false); }}
      />

      <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
         <div className="flex items-center gap-3 px-2">
            <h2 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
               {title}
            </h2>
            {filter && (
                <button onClick={() => setFilter(null)} className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 hover:text-white transition-colors">
                    ✕ Netejar
                </button>
            )}
         </div>

         <div className="flex gap-2">
            <button
               onClick={() => setShowCamera(true)}
               className="bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 shadow-sm hover:scale-105"
            >
               <span className="text-lg">📷</span> 
               <span className="hidden sm:inline">Escanejar IA</span>
            </button>

            <button
               onClick={() => setShowAddForm(!showAddForm)}
               className={`
                 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-lg
                 ${showAddForm 
                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700' 
                    : 'bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:scale-105'
                 }
               `}
            >
               {showAddForm ? '❌ Tancar' : '➕ Afegir'}
            </button>
         </div>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAddForm ? 'max-h-375 opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="pt-2 pb-6">
            <AddItemForm />
         </div>
      </div>

      <InventoryList items={filteredItems} />
    </div>
  );
}