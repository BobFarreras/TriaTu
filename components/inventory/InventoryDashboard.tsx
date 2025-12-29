'use client';

import { useState } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { InventoryStats } from './InventoryStats';
import { InventoryList } from './InventoryList';
import { isItemExpiringSoon } from '@/lib/inventoryUtils'; // <--- Importem la utilitat

// Definim un tipus pel filtre que inclogui l'opció especial
export type DashboardFilter = StorageLocation | 'EXPIRING' | null;

interface InventoryDashboardProps {
  items: InventoryItemProps[];
}

export function InventoryDashboard({ items }: InventoryDashboardProps) {
  // Canviem el tipus de l'estat
  const [filter, setFilter] = useState<DashboardFilter>(null);

  // Lògica de filtratge ampliada
  const filteredItems = items.filter((item) => {
    if (filter === null) return true; // Veure tot
    
    if (filter === 'EXPIRING') {
      // Filtrem usant la lògica de domini (3 dies de marge)
      return isItemExpiringSoon(item, 3);
    }
    
    // Si és un lloc físic (Nevera, Revost...)
    return item.location === filter;
  });

  return (
    <div className="space-y-8">
      <InventoryStats 
        items={items} 
        activeFilter={filter} 
        onFilterChange={setFilter} 
      />

      <div className="flex items-center gap-4 px-2">
        <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
           {filter === 'EXPIRING' ? (
             <>⚠️ <span className="text-red-400">Caduca Aviat</span></>
           ) : filter ? (
             <>Filtrant: <span className="text-white">{filter}</span></>
           ) : (
             <>📦 Tot l'Inventari</>
           )}
        </h2>
        <div className="h-px bg-slate-800 flex-1"></div>
        
        {filter && (
          <button 
            onClick={() => setFilter(null)}
            className="text-xs text-purple-400 hover:text-purple-300 font-bold uppercase"
          >
            Veure tot
          </button>
        )}
      </div>

      <InventoryList items={filteredItems} />
    </div>
  );
}