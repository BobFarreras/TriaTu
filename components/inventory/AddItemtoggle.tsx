'use client';

import { useState } from 'react';
import { AddItemForm } from './AddItemForm';
// ✅ 1. Importem el hook
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function AddItemToggle() {
  const [isOpen, setIsOpen] = useState(false);
  
  // ✅ 2. Obtenim les traduccions
  const { t } = useLanguage();
  const labels = t.inventory.add_item;

  return (
    <div className="mb-10">
      {/* BOTÓ D'ACCIÓ PRINCIPAL */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-white py-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-purple-600 group-hover:bg-purple-500 flex items-center justify-center text-3xl shadow-lg shadow-purple-900/50 transition-transform group-hover:scale-110">
            ➕
          </div>
          {/* ✅ Text traduït */}
          <span className="font-bold text-lg tracking-wide">{labels.main_btn}</span>
        </button>
      )}

      {/* CONTENIDOR DESPLEGABLE */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isOpen ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        {/* Nota: He augmentat max-h-500 a max-h-[800px] per si el formulari creix */}
        
        <div className="flex justify-end mb-2">
            <button 
                onClick={() => setIsOpen(false)}
                className="text-sm text-slate-500 hover:text-red-400 flex items-center gap-1 px-4 py-2"
            >
                {/* ✅ Text traduït */}
                ❌ {labels.close_btn}
            </button>
        </div>
        
        {/* Renderitzem el formulari real */}
        <AddItemForm />
      </div>
    </div>
  );
}