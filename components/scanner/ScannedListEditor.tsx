'use client';

import { useState } from 'react';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation'; // Assegura't de tenir aquest import
import { addItemAction } from '@/app/actions/inventory';
import { getEmojiForName, enrichWithPreset } from '@/lib/presetMatcher';

interface ScannedListEditorProps {
  initialItems: ScannedItem[];
  onFinish: () => void;
  onCancel: () => void;
}

export function ScannedListEditor({ initialItems, onFinish, onCancel }: ScannedListEditorProps) {
  const [items, setItems] = useState<ScannedItem[]>(() => 
    initialItems.map(enrichWithPreset)
  );
  const [isSaving, setIsSaving] = useState(false);

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // --- CORRECCIÓ DE TYPESCRIPT AQUÍ ---
  const updateItem = (index: number, field: keyof ScannedItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => {
        if (i !== index) return item;

        // Cas 1: Camps numèrics
        if (field === 'quantity') {
            return { ...item, quantity: Number(value) };
        }
        
        // Cas 2: Camps de text específics (Enums)
        if (field === 'unit') {
             // Forcem el tipatge perquè sabem que el <select> només té opcions vàlides
             return { ...item, unit: value as 'ut' | 'kg' | 'l' | 'g' };
        }

        if (field === 'location') {
             return { ...item, location: value as StorageLocation };
        }

        // Cas 3: Camps de text lliure (name, expiryDate)
        // Convertim a String explícitament per calmar TypeScript
        if (field === 'name') {
             return { ...item, name: String(value) };
        }
        
        if (field === 'expiryDate') {
             return { ...item, expiryDate: String(value) };
        }

        // Fallback segur per qualsevol altre camp (com confidence)
        return { ...item, [field]: value };
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const promises = items.map(item => {
        const formData = new FormData();
        const emoji = getEmojiForName(String(item.name));
        // Evitem duplicar l'emoji si la IA ja l'ha posat o si l'usuari l'ha escrit
        const finalName = String(item.name).includes(emoji) ? item.name : `${emoji} ${item.name}`;
        
        formData.set('name', finalName);
        formData.set('quantity', item.quantity.toString());
        formData.set('unit', item.unit);
        formData.set('location', item.location);
        if (item.expiryDate) formData.set('expiryDate', item.expiryDate);
        
        return addItemAction(formData);
      });

      await Promise.all(promises);
      onFinish();
    } catch (error) {
      console.error(error);
      alert('Error guardant els items.');
    } finally {
      setIsSaving(false);
    }
  };

  if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400">
            <p className="mb-4">No s'han detectat items.</p>
            <button onClick={onCancel} className="text-purple-400 hover:text-purple-300 underline">Tornar</button>
        </div>
      );
  }

  return (
    <div className="bg-slate-950 flex flex-col h-full border-l border-slate-800 shadow-2xl">
      
      {/* HEADER */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
        <div>
            <h2 className="text-lg font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
                ✨ {items.length} Productes
            </h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Revisa abans de guardar</p>
        </div>
        <button onClick={onCancel} className="bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 p-2 rounded-full transition-colors">
            ✕
        </button>
      </div>

      {/* LISTA SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
        {items.map((item, idx) => {
          const emoji = getEmojiForName(item.name);
          
          return (
            <div key={idx} className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 shadow-lg relative group animate-in slide-in-from-right-4 duration-300 fill-mode-backwards" style={{ animationDelay: `${idx * 100}ms` }}>
                
                {/* 1. CAPÇALERA ITEM: EMOJI + NOM */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {emoji}
                    </div>
                    <input 
                        value={item.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                        className="flex-1 bg-transparent text-white font-bold text-lg border-none p-0 focus:ring-0 placeholder-slate-600 min-w-0"
                    />
                    <button onClick={() => removeItem(idx)} className="text-slate-600 hover:text-red-500 transition-colors px-2">
                        🗑️
                    </button>
                </div>

                {/* 2. DADES: QUANTITAT + UNITAT + LLOC */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                     <div className="bg-slate-950 rounded-lg p-1 flex items-center border border-slate-800">
                        <input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                            className="w-full bg-transparent text-center text-white font-mono text-sm border-none focus:ring-0 p-0"
                        />
                     </div>
                     <select 
                        value={item.unit}
                        onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                        className="bg-slate-950 text-white text-xs rounded-lg border-slate-800 focus:ring-0 w-full"
                    >
                        <option value="ut">unitats</option>
                        <option value="kg">kg</option>
                        <option value="l">litres</option>
                        <option value="g">grams</option>
                    </select>
                    <select 
                        value={item.location}
                        onChange={(e) => updateItem(idx, 'location', e.target.value)}
                        className="bg-slate-950 text-white text-[10px] uppercase font-bold rounded-lg border-slate-800 focus:ring-0 w-full"
                    >
                        <option value="FRIDGE">Nevera</option>
                        <option value="PANTRY">Revost</option>
                        <option value="FREEZER">Congelador</option>
                    </select>
                </div>

                {/* 3. DATA CADUCITAT (INTEGRADA) */}
                <div className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-xl border border-slate-800/50">
                    <span className="text-lg">📅</span>
                    <input 
                        type="date"
                        value={item.expiryDate || ''}
                        onChange={(e) => updateItem(idx, 'expiryDate', e.target.value)}
                        className="bg-transparent text-slate-300 text-xs font-mono border-none focus:ring-0 w-full p-0"
                    />
                    {!item.expiryDate && <span className="text-[10px] text-orange-400 italic whitespace-nowrap">Estimar data?</span>}
                </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTION */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md sticky bottom-0 z-20">
        <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl shadow-lg shadow-purple-900/20 transform active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
        >
            {isSaving ? (
                <span className="animate-pulse">Guardant...</span>
            ) : (
                <>📥 Confirmar tot</>
            )}
        </button>
      </div>
    </div>
  );
}