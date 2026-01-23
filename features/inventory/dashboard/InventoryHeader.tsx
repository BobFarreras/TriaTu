// src/components/dashboard/InventoryHeader.tsx
'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { isItemExpiringSoon } from '@/lib/inventoryUtils';
import { BackButton } from '@/components/ui/BackButton';
import { FilterPill } from './components/FilterPill';
import { DashboardFilter } from '../InventoryManager';
import { ReactNode } from 'react';
import { InventoryContextSelector } from '../components/InventroyContextSelector';

interface Props {
  items: InventoryItemProps[];
  activeFilter: DashboardFilter;
  onFilterChange: (filter: DashboardFilter) => void;

  // Accions
  onScan: () => void;
  onToggleAdd: () => void; // ✅ RECUPEREM AIXÒ
  isAddFormVisible: boolean;

  // Selecció
  isSelectionMode: boolean;
  onToggleSelectionMode: () => void;
  onSelectAll: () => void;

  // IDs Tour
  scanBtnId?: string;
  addBtnId?: string;
  filterContainerId?: string;
  extraActions?: ReactNode;

  // Context Props
  scope: string;
  setScope: (val: string) => void;
  rooms: { id: string; name: string }[];
}

export function InventoryHeader({
  items,
  activeFilter,
  onFilterChange,
  onScan,
  onToggleAdd, // ✅ Recuperat
  isAddFormVisible,
  isSelectionMode,
  onToggleSelectionMode,
  onSelectAll,
  scanBtnId,
  addBtnId,
  filterContainerId,
  extraActions,
  scope, setScope, rooms,
}: Props) {
  const { t } = useLanguage();

  const stats = {
    TOTAL: items.length,
    [StorageLocation.FRIDGE]: items.filter(i => i.location === StorageLocation.FRIDGE).length,
    [StorageLocation.FREEZER]: items.filter(i => i.location === StorageLocation.FREEZER).length,
    [StorageLocation.PANTRY]: items.filter(i => i.location === StorageLocation.PANTRY).length,
    EXPIRING: items.filter(i => isItemExpiringSoon(i, 3)).length,
  };

  const handleFilterClick = (id: DashboardFilter) => {
    onFilterChange(activeFilter === id ? null : id);
  };

  return (
    <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 transition-all shadow-2xl">

      {/* ✅ CONTENIDOR PRINCIPAL (NAVEGACIÓ + ACCIONS)
          - Mòbil: column (un a sota l'altre)
          - PC (md): row (un al costat de l'altre) + justify-between
      */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-1 pb-1 md:pb-3 gap-3">

        {/* --- BLOC ESQUERRA: BACK + SELECTOR --- */}
        <div className="flex items-center gap-3">
          <BackButton className="h-9 w-9 bg-transparent border-0 hover:bg-slate-800 text-slate-400 p-0 shrink-0 right" />
          <InventoryContextSelector scope={scope} setScope={setScope} rooms={rooms} />
        </div>
        {/* --- BLOC DRETA: BARRA D'ACCIONS --- */}
        {/* - Mòbil: w-full (ocupa tot l'ample)
            - PC: w-auto (ocupa només el necessari)
        */}
        <div className="flex items-center gap-2 w-full md:w-auto p-2">

          {/* GRUP DE BOTONS QUADRATS (Tools) */}
          <div className="flex gap-2 shrink-0">
            {extraActions}

            {!isSelectionMode && (
              <button
                id={scanBtnId}
                onClick={onScan}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-purple-400 hover:text-white hover:border-slate-600 transition-all active:scale-95"
                title="Escanear"
              >
                <span className="text-xl">📷</span>
              </button>
            )}

            <button
              onClick={onToggleSelectionMode}
              className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${isSelectionMode
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
            >
              <span className="text-lg">{isSelectionMode ? '✓' : '✨'}</span>
            </button>

            {isSelectionMode && (
              <button
                onClick={onSelectAll}
                className="h-10 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-xs active:scale-95"
              >
                TOT
              </button>
            )}
          </div>

          {/* BOTÓ AFEGIR */}
          {/* ✅ CORRECCIÓ CLAU:
                - flex-1: En mòbil creix per omplir el forat.
                - md:flex-none: En PC no creix.
                - md:w-auto: En PC té l'ample del seu contingut.
                - md:px-6: En PC li donem aire als costats.
            */}
          {!isSelectionMode && (
            <button
              id={addBtnId}
              onClick={onToggleAdd}
              data-testid="inventory-add-button"
              className={`
                        flex-1 md:flex-none md:w-auto md:px-6 h-10 flex items-center justify-center gap-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 border whitespace-nowrap
                        ${isAddFormVisible
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-white text-slate-950 border-white hover:bg-slate-200'
                }
                    `}
            >
              {isAddFormVisible ? (
                <span>Tancar</span>
              ) : (
                <>
                  <span className="text-lg leading-none font-light">+</span>
                  <span>Afegir Producte</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* --- FILA 3: FILTRES (Scrollable) --- */}
      <div className="px-2 pb-2 overflow-x-auto no-scrollbar" id={filterContainerId}>
        <div className="grid grid-cols-5 gap-1.5 min-w-75">
          <FilterPill label="Tots" icon="🏠" count={stats.TOTAL} isActive={activeFilter === null} onClick={() => onFilterChange(null)} activeClass="bg-white text-slate-950" badgeActiveClass="bg-slate-900 text-white" />
          <FilterPill label={t.inventory.form.location.fridge} icon="❄️" count={stats[StorageLocation.FRIDGE]} isActive={activeFilter === StorageLocation.FRIDGE} onClick={() => handleFilterClick(StorageLocation.FRIDGE)} activeClass="bg-cyan-500 text-white" />
          <FilterPill label={t.inventory.form.location.pantry} icon="🚪" count={stats[StorageLocation.PANTRY]} isActive={activeFilter === StorageLocation.PANTRY} onClick={() => handleFilterClick(StorageLocation.PANTRY)} activeClass="bg-orange-500 text-white" />
          <FilterPill label={t.inventory.form.location.freezer} icon="🧊" count={stats[StorageLocation.FREEZER]} isActive={activeFilter === StorageLocation.FREEZER} onClick={() => handleFilterClick(StorageLocation.FREEZER)} activeClass="bg-indigo-500 text-white" />
          <FilterPill label="Caduca" icon="⚠️" count={stats.EXPIRING} isActive={activeFilter === 'EXPIRING'} onClick={() => handleFilterClick('EXPIRING')} activeClass="bg-red-500 text-white" />
        </div>
      </div>
    </div >
  );
}
