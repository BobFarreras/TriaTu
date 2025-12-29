'use client';

import { useState } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { InventoryStats } from './InventoryStats';
import { InventoryList } from './InventoryList';
import { AddItemForm } from './AddItemForm';
// ✅ IMPORT IMPRESCINDIBLE
import { isItemExpiringSoon } from '@/lib/inventoryUtils'; 

export type DashboardFilter = StorageLocation | 'EXPIRING' | null;

interface InventoryManagerProps {
  items: InventoryItemProps[];
}

export function InventoryManager({ items }: InventoryManagerProps) {
  const [filter, setFilter] = useState<DashboardFilter>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Lògica de filtratge CORREGIDA
  const filteredItems = items.filter((item) => {
    // 1. Si no hi ha filtre, ho mostrem tot
    if (filter === null) return true;
    
    // 2. Si el filtre és "EXPIRING", usem la lògica de dates
    if (filter === 'EXPIRING') {
        return isItemExpiringSoon(item, 3);
    }
    
    // 3. Si és un lloc físic (Nevera, etc.), filtrem per location
    return item.location === filter;
  });
  
  // Títol dinàmic
  let title = "📦 Tot l'Inventari";
  if (filter === 'EXPIRING') title = "⚠️ Caduca Aviat (o Caducat)";
  else if (filter) title = `📂 ${filter}`;

  return (
    <div className="space-y-6">
      
      {/* 1. MINI STATS */}
      <InventoryStats 
        items={items} 
        activeFilter={filter} 
        onFilterChange={(f) => {
             setFilter(f);
             setShowAddForm(false);
        }}
      />

      {/* 2. BARRA DE CONTROL */}
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

         <button
           onClick={() => setShowAddForm(!showAddForm)}
           className={`
             flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-lg
             ${showAddForm 
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105'
             }
           `}
         >
           {showAddForm ? (
             <>❌ Tancar</>
           ) : (
             <>➕ Afegir</>
           )}
         </button>
      </div>

      {/* 3. FORMULARI DESPLEGABLE */}
      <div className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${showAddForm ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
         <div className="pt-2 pb-6">
            <AddItemForm />
         </div>
      </div>

      {/* 4. LLISTA */}
      <InventoryList items={filteredItems} />
    </div>
  );
}