'use client';

import { useState } from 'react';
import { FunDatePicker } from './FunDatePicker';

interface SmartDatePickerProps {
  onDateSelect: (dateIso: string) => void;
  selectedDate: string;
}

export function SmartDatePicker({ onDateSelect, selectedDate }: SmartDatePickerProps) {
  const [showManual, setShowManual] = useState(false);

  // Helper per calcular dates futures
  const getFutureDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  // LES NOVES OPCIONS
  const options = [
    { 
      label: '♾️ No caduca', 
      val: '', // Valor buit = Null a la Base de Dades
      color: 'border-teal-500/50 bg-teal-900/10 text-teal-200 hover:bg-teal-900/30' 
    },
    { 
      label: '🌤️ 3 Dies', 
      val: getFutureDate(3), 
      color: 'border-orange-500/50 bg-orange-900/10 text-orange-200 hover:bg-orange-900/30' 
    },
    { 
      label: '📅 1 Setm', 
      val: getFutureDate(7), 
      color: 'border-blue-500/50 bg-blue-900/10 text-blue-200 hover:bg-blue-900/30' 
    },
  ];

  const handleManualToggle = () => {
    // Si obrim el manual i no hi ha data (o és infinita), posem avui per defecte per començar a rodar
    if (!showManual && !selectedDate) {
        onDateSelect(new Date().toISOString().split('T')[0]);
    }
    setShowManual(!showManual);
  };

  const handleOptionClick = (val: string) => {
    onDateSelect(val);
    setShowManual(false); // Amaguem el manual si triem una opció ràpida
  };

  return (
    <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          ⏳ Quan caduca?
      </label>
      
      {/* 1. BOTONS RÀPIDS */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {options.map((opt, idx) => {
          const isSelected = selectedDate === opt.val;
          
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleOptionClick(opt.val)}
              className={`
                py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all relative overflow-hidden shadow-sm flex flex-col items-center justify-center gap-1
                ${isSelected 
                  ? 'border-white bg-slate-200 text-slate-900 scale-105 z-10 shadow-lg ring-2 ring-white/50' 
                  : `${opt.color} hover:scale-105 hover:border-slate-400`
                }
              `}
            >
              {opt.label}
              {/* Indicador visual extra si està seleccionat */}
              {isSelected && <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />}
            </button>
          );
        })}
      </div>
      
      {/* 2. BOTÓ TOGGLE MANUAL */}
      {/* Només el mostrem si no hem triat "No caduca", o si volem donar l'opció sempre */}
      <button 
        type="button" 
        onClick={handleManualToggle}
        className={`
            w-full py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2
            ${showManual 
                ? 'bg-purple-900/20 border-purple-500 text-purple-300' 
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-500'
            }
        `}
      >
        <span>{showManual ? '❌ Tancar Calendari' : '🛠️ Triar Data Manualment'}</span>
      </button>

      {/* 3. SELECTOR MANUAL (Es desplega) */}
      <div className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${showManual ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}
      `}>
         <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800">
             <FunDatePicker date={selectedDate} onChange={onDateSelect} />
         </div>
         
         <div className="text-center mt-3 p-2 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <span className="text-xs text-purple-200 uppercase font-bold tracking-widest">
                Data seleccionada:
            </span>
            <div className="text-xl font-mono font-bold text-white mt-1">
                {selectedDate || 'No seleccionada'}
            </div>
         </div>
      </div>
    </div>
  );
}