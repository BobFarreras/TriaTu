// src/components/scanner/ScannedListEditor.tsx
'use client';

import { useState } from 'react';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { addItemAction } from '@/app/actions/inventory';
import { enrichWithPreset, getEmojiForName } from '@/lib/presetMatcher';
import { ScannedItemCard } from './ScannedItemCard'; // ✅ Importem la Card nova

interface ScannedListEditorProps {
  initialItems: ScannedItem[];
  onFinish: () => void;
  onCancel: () => void;
}

export function ScannedListEditor({ initialItems, onFinish, onCancel }: ScannedListEditorProps) {
  // 1. Inicialitzem estat (enriquint amb presets)
  const [items, setItems] = useState<ScannedItem[]>(() => 
    initialItems.map(enrichWithPreset)
  );
  const [isSaving, setIsSaving] = useState(false);

  // 2. Lògica d'eliminació
  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // 3. Lògica d'actualització (Tipus segurs)
  const updateItem = (index: number, field: keyof ScannedItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => {
        if (i !== index) return item;

        if (field === 'quantity') return { ...item, quantity: Number(value) };
        if (field === 'unit') return { ...item, unit: value as 'ut' | 'kg' | 'l' | 'g' };
        if (field === 'location') return { ...item, location: value as StorageLocation };
        
        // Per camps de text
        return { ...item, [field]: String(value) };
    }));
  };

  // 4. Guardar a Base de Dades
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const promises = items.map(item => {
        const formData = new FormData();
        const emoji = getEmojiForName(String(item.name));
        
        // Lògica per no duplicar emojis si l'usuari ja n'ha posat
        const finalName = String(item.name).includes(emoji) 
            ? item.name 
            : `${emoji} ${item.name}`;
        
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

  // VISTA BUIDA
  if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400 bg-slate-950">
            <p className="mb-4">No queden items.</p>
            <button onClick={onCancel} className="text-purple-400 hover:text-purple-300 underline">
                Tornar
            </button>
        </div>
      );
  }

  return (
    <div className="bg-slate-950 flex flex-col h-full border-l border-slate-800 shadow-2xl relative">
      
      {/* HEADER FIXAT A DALT */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
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

      {/* LLISTA SCROLLABLE 
         ✅ CLAU: 'pb-32' o 'pb-40' fa espai extra al final perquè el footer no tapi l'últim item.
      */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-32 scrollbar-thin scrollbar-thumb-slate-700">
        {items.map((item, idx) => (
            <ScannedItemCard 
                key={idx}
                item={item}
                onUpdate={(field, val) => updateItem(idx, field, val)}
                onRemove={() => removeItem(idx)}
            />
        ))}
      </div>

      {/* FOOTER FIXAT A BAIX */}
      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 pt-10">
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