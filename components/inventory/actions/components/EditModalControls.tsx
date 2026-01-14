'use client';

import { StorageLocation } from '@/core/domain/entities/StorageLocation';

interface FormData {
  quantity: number;
  unit: string;
  location: StorageLocation;
  expiryDate: string;
}

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onQuantityChange: (delta: number) => void;
}

export function EditModalControls({ formData, setFormData, onQuantityChange }: Props) {
  return (
    // ✅ CANVI: padding reduït (p-4) i flex per distribuir espai verticalment
    <div className="flex-1 flex flex-col gap-3 p-4 bg-slate-900 min-h-0 overflow-y-auto">
           
       {/* 1. SELECTOR D'UBICACIÓ (Més compacte: py-2) */}
       <div className="bg-slate-950 p-1 rounded-xl flex border border-slate-800 shrink-0">
          {[StorageLocation.PANTRY, StorageLocation.FRIDGE, StorageLocation.FREEZER].map((loc) => {
             const isActive = formData.location === loc;
             const config = {
                [StorageLocation.PANTRY]: { icon: '🚪', label: 'Rebost' },
                [StorageLocation.FRIDGE]: { icon: '❄️', label: 'Nevera' },
                [StorageLocation.FREEZER]: { icon: '🧊', label: 'Cong.' }, // Nom escurçat
             }[loc];
             
             return (
               <button
                 key={loc}
                 onClick={() => setFormData(p => ({...p, location: loc}))}
                 className={`
                   flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                   ${isActive 
                     ? 'bg-slate-800 text-white shadow-lg ring-1 ring-slate-700' 
                     : 'text-slate-500 hover:text-slate-300'
                   }
                 `}
               >
                 <span className="text-lg mb-0.5">{config.icon}</span>
                 <span>{config.label}</span>
               </button>
             );
          })}
       </div>

       {/* 2. GRID PRINCIPAL (Ocupa l'espai restant) */}
       <div className="flex-1 grid grid-rows-2 gap-3 min-h-0">
          
          {/* CONTROL QUANTITAT */}
          <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
             <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest mb-1">Estoc Actual</span>
             <div className="flex items-center gap-6 w-full justify-center">
                <button 
                  onClick={() => onQuantityChange(-1)}
                  className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-3xl transition-all active:scale-90 border border-slate-700 shadow-sm"
                >
                  -
                </button>
                <span className="text-4xl font-black text-white font-mono min-w-[2ch] text-center">
                  {formData.quantity}
                </span>
                <button 
                  onClick={() => onQuantityChange(1)}
                  className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-3xl transition-all active:scale-90 border border-slate-700 shadow-sm"
                >
                  +
                </button>
             </div>
          </div>

          {/* DATA CADUCITAT */}
          <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800 flex flex-col justify-center items-center">
             <label className="text-[9px] uppercase text-slate-500 font-bold tracking-widest mb-2">
               Caduca el dia...
             </label>
             <input 
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData(p => ({...p, expiryDate: e.target.value}))}
                className="w-full max-w-[200px] bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-center font-mono text-lg focus:border-emerald-500 outline-none"
             />
          </div>
       </div>

    </div>
  );
}