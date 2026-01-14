'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { InventoryItemCard } from './InventoryItemCard';
import { deleteBatchItemsAction } from '@/app/actions/inventory';

interface Props {
  items: InventoryItemProps[];
  // ✅ Noves props per controlar-ho des del Header
  externalSelectionMode?: boolean; 
  onSelectionModeChange?: (isActive: boolean) => void;
}

export function InventoryList({ items, externalSelectionMode, onSelectionModeChange }: Props) {
  const { t } = useLanguage();
  
  // Useu l'estat intern O l'extern (prioritat a l'extern)
  const isSelectionMode = externalSelectionMode; 
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // Quan canvia el mode des de fora, netegem la selecció
  useEffect(() => {
     if (!externalSelectionMode) setSelectedIds(new Set());
  }, [externalSelectionMode]);

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Segur que vols eliminar ${selectedIds.size} productes?`)) return;
    
    setIsDeleting(true);
    try {
      const idsArray = Array.from(selectedIds);
      await deleteBatchItemsAction(idsArray);
      
      // Reset després d'esborrar (avisant al pare si cal)
      if (onSelectionModeChange) onSelectionModeChange(false);
      setSelectedIds(new Set());
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
       {/* Ja no cal Toolbar aquí, perquè està al Header general! */}
       
       {/* GRID */}
       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4 pb-24 pt-2">
          {items.map((item) => (
             <InventoryItemCard 
                key={item.id} 
                item={item} 
                isSelectionMode={!!isSelectionMode}
                isSelected={selectedIds.has(item.id)}
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