// src/components/inventory/InventoryStats.tsx
'use client'; 

import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { isItemExpiringSoon } from '@/lib/inventoryUtils';
import { DashboardFilter } from './InventoryManager'; 
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface InventoryStatsProps {
  items: InventoryItemProps[];
  activeFilter: DashboardFilter;
  onFilterChange: (filter: DashboardFilter) => void;
}

export function InventoryStats({ items, activeFilter, onFilterChange }: InventoryStatsProps) {
  const { t } = useLanguage();

  const stats = {
    [StorageLocation.FRIDGE]: items.filter(i => i.location === StorageLocation.FRIDGE).length,
    [StorageLocation.FREEZER]: items.filter(i => i.location === StorageLocation.FREEZER).length,
    [StorageLocation.PANTRY]: items.filter(i => i.location === StorageLocation.PANTRY).length,
  };

  const expiringCount = items.filter(i => isItemExpiringSoon(i, 3)).length;

  const handleCardClick = (filterType: DashboardFilter) => {
    if (activeFilter === filterType) {
      onFilterChange(null);
    } else {
      onFilterChange(filterType);
    }
  };

  const isExpiringActive = activeFilter === 'EXPIRING';

  return (
    // ✅ ID PER AL GRUP DE FILTRES (Pas 2 del tour)
    <div id="tour-inv-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
      
      <MiniStatCard 
        icon="❄️" 
        label={t.inventory.form.location.fridge} 
        count={stats.FRIDGE} 
        color="bg-cyan-500/10 border-cyan-500/20 text-cyan-200"
        activeColor="bg-cyan-500/20 border-cyan-500 ring-1 ring-cyan-400/50"
        isActive={activeFilter === StorageLocation.FRIDGE}
        onClick={() => handleCardClick(StorageLocation.FRIDGE)}
      />

      <MiniStatCard 
        icon="🚪" 
        label={t.inventory.form.location.pantry} 
        count={stats.PANTRY} 
        color="bg-orange-500/10 border-orange-500/20 text-orange-200"
        activeColor="bg-orange-500/20 border-orange-500 ring-1 ring-orange-400/50"
        isActive={activeFilter === StorageLocation.PANTRY}
        onClick={() => handleCardClick(StorageLocation.PANTRY)}
      />

      <MiniStatCard 
        icon="🧊" 
        label={t.inventory.form.location.freezer}
        count={stats.FREEZER} 
        color="bg-indigo-500/10 border-indigo-500/20 text-indigo-200"
        activeColor="bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-400/50"
        isActive={activeFilter === StorageLocation.FREEZER}
        onClick={() => handleCardClick(StorageLocation.FREEZER)}
      />

      {/* ✅ ID ESPECÍFIC PER A L'ALERTA DE CADUCITAT (Pas 3 del tour) */}
      <button 
        id="tour-inv-expiring"
        onClick={() => handleCardClick('EXPIRING')}
        className={`
          relative overflow-hidden rounded-xl border flex flex-row items-center justify-between px-4 py-2 transition-all select-none
          ${isExpiringActive 
             ? 'bg-red-900/30 border-red-500 ring-1 ring-red-500/50 z-10' 
             : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-red-500/30'
          }
        `}
      >
        <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isExpiringActive ? 'text-red-200' : 'text-slate-400'}`}>
               {t.inventory.list.status.expiring}
            </span>
        </div>
        <span className={`text-xl font-black ${expiringCount > 0 ? 'text-red-400' : 'text-slate-600'}`}>
          {expiringCount}
        </span>
      </button>

    </div>
  );
}


interface MiniStatCardProps {
  icon: string;
  label: string;
  count: number;
  color: string;
  activeColor: string;
  isActive: boolean;
  onClick: () => void;
}

function MiniStatCard({ icon, label, count, color, activeColor, isActive, onClick }: MiniStatCardProps) {
  return (
    <button 
      onClick={onClick}
      className={`
        rounded-xl border flex flex-row items-center justify-between px-4 py-2 transition-all
        ${isActive ? activeColor : `${color} hover:bg-opacity-100 border-opacity-50`}
      `}
    >
      <div className="flex items-center gap-2">
         <span className="text-xl filter drop-shadow-sm">{icon}</span>
         <span className={`text-[10px] font-bold uppercase tracking-widest opacity-80`}>
            {label}
         </span>
      </div>
      <span className="text-xl font-black text-white">{count}</span>
    </button>
  );
}