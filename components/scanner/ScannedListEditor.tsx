'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ScannedItem } from '@/core/domain/types/ScannedItem';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { addItemAction } from '@/app/actions/inventory'; // ⚠️ REVISA QUE SIGUI AQUESTA RUTA
import { enrichWithPreset } from '@/lib/presetMatcher';
import { ScannedItemCard } from './ScannedItemCard';

interface ScannedListEditorProps {
  initialItems: ScannedItem[];
  onFinish: () => void;
  onCancel: () => void;
  showImageToggle?: boolean;
  isImageVisible?: boolean;
  onToggleImage?: () => void;
}

export function ScannedListEditor({
  initialItems,
  onFinish,
  onCancel,
  showImageToggle = false,
  isImageVisible = true,
  onToggleImage
}: ScannedListEditorProps) {

  const { t } = useLanguage();
  const [items, setItems] = useState<ScannedItem[]>(() => initialItems.map(enrichWithPreset));
  const [isSaving, setIsSaving] = useState(false);

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ScannedItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== index) return item;
      if (field === 'quantity') return { ...item, quantity: Number(value) };

      // ✅ FIX: En lloc de 'as any', usem el tipus específic de la propietat unit
      if (field === 'unit') return { ...item, unit: value as ScannedItem['unit'] };

      if (field === 'location') return { ...item, location: value as StorageLocation };
      return { ...item, [field]: String(value) };
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    console.log("🚀 [CLIENT] Començant a guardar", items.length, "elements...");

    try {
      // Fem un map async per poder fer logs individuals
      const promises = items.map(async (item, index) => {
        const formData = new FormData();

        // LOG DE DADES ABANS DE POSAR AL FORMDATA
        console.log(`📦 [CLIENT] Item ${index}:`, item);

        formData.set('name', item.name);
        formData.set('emoji', item.emoji || '📦');
        formData.set('quantity', String(item.quantity || 1)); // Protecció contra NaN/Null
        formData.set('unit', item.unit || 'ut');
        formData.set('location', item.location || 'PANTRY');

        // Només enviem data si existeix (evita enviar string buida "")
        if (item.expiryDate) {
          formData.set('expiryDate', item.expiryDate);
        }

        console.log(`📨 [CLIENT] Enviant FormData per: ${item.name}`);

        const result = await addItemAction(formData);

        console.log(`📬 [CLIENT] Resposta per ${item.name}:`, result);

        if (!result.success) {
          console.error(`❌ [CLIENT] Error al guardar ${item.name}:`, result.error);
          throw new Error(`Error amb ${item.name}: ${result.error}`);
        }

        return result;
      });

      await Promise.all(promises);

      console.log("✅ [CLIENT] Tot guardat correctament!");
      onFinish();

    } catch (error) {
      console.error("💥 [CLIENT] Error fatal al bucle:", error);
      alert(t.inventory.scanner.error_save || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400 bg-slate-950 rounded-3xl border border-slate-800">
        <p className="mb-4">{t.inventory.scanner.no_items}</p>
        <button onClick={onCancel} className="text-purple-400 hover:text-purple-300 underline">
          {t.inventory.scanner.back}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 flex flex-col h-full w-full border-l border-slate-800 shadow-2xl relative rounded-l-none lg:rounded-l-3xl overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div>
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
            ✨ {items.length} {t.inventory.scanner.title_suffix}
          </h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t.inventory.scanner.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {showImageToggle && onToggleImage && (
            <button onClick={onToggleImage} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition-colors border border-slate-700 text-xs font-bold flex items-center gap-2">
              {isImageVisible ? '🙈' : `👁️ ${t.inventory.scanner.photo_btn}`}
            </button>
          )}
          <button onClick={onCancel} className="bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 p-2 rounded-full transition-colors w-9 h-9 flex items-center justify-center">✕</button>
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 pb-32 scrollbar-thin scrollbar-thumb-slate-700 w-full">
        {items.map((item, idx) => (
          <ScannedItemCard
            key={idx}
            item={item}
            onUpdate={(field, val) => updateItem(idx, field, val)}
            onRemove={() => removeItem(idx)}
          />
        ))}
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 w-full p-4 bg-linear-to-t from-slate-950 via-slate-950/95 to-transparent z-20 pt-10">
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl shadow-lg shadow-purple-900/20 transform active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
        >
          {isSaving ? (
            <span className="animate-pulse">{t.inventory.scanner.saving}</span>
          ) : (
            <>📥 {t.inventory.scanner.confirm_btn}</>
          )}
        </button>
      </div>
    </div>
  );
}