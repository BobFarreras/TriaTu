'use client';

import { useState } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { updateItemAction, deleteItemAction } from '@/app/actions/inventory';

interface EditItemModalProps {
  item: InventoryItemProps;
  onClose: () => void;
}

export function EditItemModal({ item, onClose }: EditItemModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Valors inicials
  const [formData, setFormData] = useState({
    name: item.name,
    emoji: item.emoji || '📦',
    quantity: item.quantity,
    unit: item.unit,
    location: item.location,
    expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : ''
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ NOU: Helper per modificar quantitat amb botons +/-
  const handleQuantityChange = (delta: number) => {
    const step = formData.unit === 'ut' ? 1 : 0.1; // Si és unitat, salta 1. Si és pes, 0.1
    const current = Number(formData.quantity);
    let newValue = current + (delta * step);
    
    // Evitem negatius i errors de decimals (ex: 0.30000004)
    newValue = Math.max(0, parseFloat(newValue.toFixed(2)));
    
    handleChange('quantity', newValue);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = new FormData();
    payload.set('id', item.id);
    payload.set('name', formData.name);
    payload.set('emoji', formData.emoji);
    payload.set('quantity', String(formData.quantity));
    payload.set('unit', formData.unit);
    payload.set('location', formData.location);
    if (formData.expiryDate) payload.set('expiryDate', formData.expiryDate);

    const res = await updateItemAction(payload);
    setIsSaving(false);
    if (res.success) onClose();
    else alert(res.error);
  };

  const handleDelete = async () => {
    if (!confirm("Segur que vols eliminar aquest producte?")) return;
    setIsSaving(true);
    const res = await deleteItemAction(item.id);
    setIsSaving(false);
    if (res.success) onClose();
    else alert(res.error);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-white">Editar Producte</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white bg-slate-800/50 w-8 h-8 rounded-full flex items-center justify-center transition-colors">✕</button>
        </div>

        <div className="space-y-5">
          
          {/* NOM I EMOJI */}
          <div className="flex gap-3">
            <div className="w-16">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Emoji</label>
              <input 
                value={formData.emoji}
                onChange={(e) => handleChange('emoji', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-center text-2xl h-12 focus:border-purple-500 outline-none transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Nom</label>
              <input 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 h-12 text-white font-bold focus:border-purple-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* QUANTITAT I UNITAT (MODIFICAT) */}
          <div className="grid grid-cols-5 gap-3">
            {/* Control de Quantitat (Ocupa 3 columnes) */}
            <div className="col-span-3">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Quantitat</label>
              <div className="flex items-center gap-2">
                {/* Botó Menys */}
                <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center text-xl font-bold active:scale-95 transition-all"
                >
                    -
                </button>
                
                {/* Input Manual */}
                <input 
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl text-center text-white font-mono text-lg h-12 focus:border-purple-500 outline-none"
                />

                {/* Botó Més */}
                <button 
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center text-xl font-bold active:scale-95 transition-all"
                >
                    +
                </button>
              </div>
            </div>

            {/* Selector d'Unitat (Ocupa 2 columnes) */}
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Unitat</label>
              <select 
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 h-12 text-white focus:border-purple-500 outline-none appearance-none cursor-pointer text-sm font-medium"
              >
                <option value="ut">📦 Unitats</option>
                <option value="kg">⚖️ Kilos</option>
                <option value="l">💧 Litres</option>
                <option value="g">🤏 Grams</option>
              </select>
            </div>
          </div>

          {/* UBICACIÓ I DATA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Ubicació</label>
              <select 
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 h-12 text-white focus:border-purple-500 outline-none appearance-none cursor-pointer text-sm"
              >
                <option value="FRIDGE">❄️ Nevera</option>
                <option value="PANTRY">🥫 Rebost</option>
                <option value="FREEZER">🧊 Congelador</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Caducitat</label>
              <input 
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 h-12 text-white text-sm focus:border-purple-500 outline-none"
              />
            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex gap-3 mt-8">
          <button 
            onClick={handleDelete}
            disabled={isSaving}
            className="px-4 py-3 rounded-xl bg-red-900/20 text-red-400 font-bold border border-red-900/50 hover:bg-red-900/40 transition-colors"
            title="Eliminar producte"
          >
            🗑️
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
          >
            {isSaving ? 'Guardant...' : '💾 Guardar Canvis'}
          </button>
        </div>

      </div>
    </div>
  );
}