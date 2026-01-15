// src/components/dashboard/InventoryList.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { InventoryItemCard } from './InventoryItemCard';
import { deleteBatchItemsAction } from '@/app/actions/inventory';

interface Props {
  items: InventoryItemProps[];
  
  // ✅ PROPS DE CONTROL (State Hoisting)
  // Ara el pare (InventoryManager) controla l'estat
  externalSelectionMode: boolean; 
  onSelectionModeChange: (isActive: boolean) => void;
  selectedIds: Set<string>;            // <--- Afegit per arreglar l'error TS
  onToggleItem: (id: string) => void;  // <--- Afegit per arreglar l'error TS
}

export function InventoryList({ 
  items, 
  externalSelectionMode, 
  selectedIds, 
  onToggleItem,
  onSelectionModeChange // <--- Assegura't que tens totes les props aquí
}: Props) {
  
  // 👇 AFEGEIX AQUEST LOG DE DEBUG
  console.log("📍 RENDER LIST:", { 
     totalItems: items.length, 
     mode: externalSelectionMode, 
     selectedCount: selectedIds?.size ?? "UNDEFINED" // Si surt undefined, aquí està l'error
  });
  const { t } = useLanguage();
  
  // Només mantenim l'estat local per a l'acció d'esborrar (UI loading state)
  const [isDeleting, setIsDeleting] = useState(false);

  // L'acció de toggle ja no modifica un estat local, sinó que avisa al pare
  const handleToggleSelect = (id: string) => {
    onToggleItem(id);
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Segur que vols eliminar ${selectedIds.size} productes?`)) return;
    
    setIsDeleting(true);
    try {
      const idsArray = Array.from(selectedIds);
      await deleteBatchItemsAction(idsArray);
      
      // En acabar, sortim del mode selecció.
      // El pare (InventoryManager) detectarà el canvi i netejarà el Set automàticament.
      onSelectionModeChange(false);
      
    } catch (e) {
      console.error(e);
      alert("Error eliminant items");
    } finally {
      setIsDeleting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 mt-8">
        <p className="text-4xl mb-2 grayscale opacity-50">{t.inventory.list.empty_title}</p>
        <p className="text-slate-500 text-sm">{t.inventory.list.empty_text}</p>
      </div>
    );
  }

  return (
    <div className="relative">
       
       {/* GRID */}
       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4 pb-24 pt-2">
          {items.map((item) => (
             <InventoryItemCard 
                key={item.id} 
                item={item} 
                // Usem la prop externa directament
                isSelectionMode={externalSelectionMode}
                // Comprovem si està al Set que ve del pare
                isSelected={selectedIds.has(item.id)}
                // Deleguem l'acció
                onToggleSelect={handleToggleSelect}
             />
          ))}
       </div>

       {/* BARRA ELIMINAR FLOTANT (Només si hi ha seleccionats) */}
       {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 w-[90%] max-w-md">
           <div className="bg-red-950/90 backdrop-blur-md border border-red-500/30 text-red-200 p-3 rounded-2xl shadow-2xl flex items-center justify-between pl-5 pr-2">
              <span className="font-bold text-sm">
                 {selectedIds.size} items seleccionats
              </span>
              
              <button 
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                {isDeleting ? '...' : (
                  <>
                    <span>🗑️</span>
                    <span>Eliminar</span>
                  </>
                )}
              </button>
           </div>
        </div>
      )}
    </div>
  );
}