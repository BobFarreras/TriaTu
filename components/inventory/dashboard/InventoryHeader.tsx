// src/components/dashboard/InventoryHeader.tsx
'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { isItemExpiringSoon } from '@/lib/inventoryUtils';
import { BackButton } from '@/components/ui/BackButton';
import { FilterPill } from './components/FilterPill';
import { DashboardFilter } from '../InventoryManager';
import { ReactNode } from 'react'; // Necessitem importar ReactNode
interface Props {
  items: InventoryItemProps[];
  activeFilter: DashboardFilter;
  onFilterChange: (filter: DashboardFilter) => void;
  // Accions
  onScan: () => void;
  onToggleAdd: () => void;
  isAddFormVisible: boolean;
  // Selecció
  isSelectionMode: boolean;
  onToggleSelectionMode: () => void;
  onSelectAll: () => void;

  // ✅ NOUS CAMPS PER AL TOUR (Opcionals, no trenquen res visualment)
  scanBtnId?: string;
  addBtnId?: string;
  filterContainerId?: string;
  extraActions?: ReactNode;
}

export function InventoryHeader({
  items,
  activeFilter,
  onFilterChange,
  onScan,
  onToggleAdd,
  isAddFormVisible,
  isSelectionMode,
  onToggleSelectionMode,
  onSelectAll,
  // Desestructurem els IDs nous
  scanBtnId,
  addBtnId,
  filterContainerId,
  extraActions // Desestructurem
}: Props) {
  const { t } = useLanguage();

  // 1. Corregit l'error de tipus: Useu claus de l'objecte, no strings "hardcoded"
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
    <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 pb-2 transition-all shadow-2xl">

      {/* --- FILA 1: TÍTOL I ACCIONS --- */}
      <div className="flex items-center justify-between p-3">

        {/* ESQUERRA */}
        <div className="flex items-center gap-3">
          <BackButton href="/dashboard" className="h-9 w-9 bg-transparent border-0 hover:bg-slate-800" />
          {/* Opcional: Si vols mostrar el títol aquí */}
          {/* <h1 className="text-xl font-bold text-white">{titleText}</h1> */}
        </div>

        {/* DRETA: Botons Tipus Card */}
        <div className="flex items-center gap-2">

          {/* ✅ AQUI INSERTEM EL BOTÓ DEL TOUR (que ve del pare) */}
          {extraActions}

          {/* ✅ 0. BOTÓ SELECCIONAR TOT */}
          {isSelectionMode && (
            <button
              onClick={onSelectAll}
              className="h-10 px-3 flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95 animate-in fade-in slide-in-from-right-4 duration-300"
              title="Seleccionar tots els items filtrats"
            >
              <span className="text-xs font-bold whitespace-nowrap">TOT</span>
            </button>
          )}

          {/* 1. SELECTOR (Card Style) */}
          <button
            onClick={onToggleSelectionMode}
            className={`
                h-10 w-10 flex items-center justify-center rounded-xl border transition-all shadow-sm active:scale-95
                ${isSelectionMode
                ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
              }
              `}
            title={isSelectionMode ? "Sortir del mode selecció" : "Activar selecció múltiple"}
          >
            <span className="text-lg">{isSelectionMode ? '✓' : '✨'}</span>
          </button>

          {/* 2. ESCÀNER */}
          {!isSelectionMode && (
            <button
              id={scanBtnId} // ✅ ID AFEGIT PER AL TOUR
              onClick={onScan}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-purple-400 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all shadow-sm active:scale-95"
              title="Escanear"
            >
              <span className="text-lg">📷</span>
            </button>
          )}

          {/* 3. AFEGIR */}
          {!isSelectionMode && (
            <button
              id={addBtnId} // ✅ ID AFEGIT PER AL TOUR
              onClick={onToggleAdd}
              className={`
                    h-10 px-4 flex items-center gap-2 rounded-xl font-bold text-xs transition-all shadow-lg active:scale-95 border
                    ${isAddFormVisible
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-white text-slate-950 border-white hover:bg-slate-100'
                }
                `}
            >
              {isAddFormVisible ? (
                <span>Tancar</span>
              ) : (
                <>
                  <span className="text-lg leading-none">+</span>
                  <span>Afegir</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* --- FILA 2: GRID DE FILTRES --- */}
      <div className="px-2 pb-1" id={filterContainerId}> {/* ✅ ID AFEGIT PER AL TOUR */}
        <div className="grid grid-cols-5 gap-1.5">

          <FilterPill
            label="Tots"
            icon="🏠"
            count={stats.TOTAL}
            activeClass="bg-white text-slate-950 border-white"
            badgeActiveClass="bg-slate-900 text-white"
            isActive={activeFilter === null}
            onClick={() => onFilterChange(null)}
          />

          {/* SOLUCIÓ ERRORS TS: Useu StorageLocation.XXX explícitament */}
          <FilterPill
            label={t.inventory.form.location.fridge}
            icon="❄️"
            count={stats[StorageLocation.FRIDGE]}
            activeClass="bg-cyan-500 text-white border-cyan-400"
            isActive={activeFilter === StorageLocation.FRIDGE}
            onClick={() => handleFilterClick(StorageLocation.FRIDGE)}
          />
          <FilterPill
            label={t.inventory.form.location.pantry}
            icon="🚪"
            count={stats[StorageLocation.PANTRY]}
            activeClass="bg-orange-500 text-white border-orange-400"
            isActive={activeFilter === StorageLocation.PANTRY}
            onClick={() => handleFilterClick(StorageLocation.PANTRY)}
          />
          <FilterPill
            label={t.inventory.form.location.freezer}
            icon="🧊"
            count={stats[StorageLocation.FREEZER]}
            activeClass="bg-indigo-500 text-white border-indigo-400"
            isActive={activeFilter === StorageLocation.FREEZER}
            onClick={() => handleFilterClick(StorageLocation.FREEZER)}
          />
          <FilterPill
            label="Caduca"
            icon="⚠️"
            count={stats.EXPIRING}
            activeClass="bg-red-500 text-white border-red-400"
            isActive={activeFilter === 'EXPIRING'}
            onClick={() => handleFilterClick('EXPIRING')}
          />
        </div>
      </div>

    </div>
  );
}