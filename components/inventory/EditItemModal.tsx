'use client';

import { useState, useTransition } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { updateItemAction, deleteItemAction } from '@/app/actions/inventory';


interface EditItemModalProps {
  item: InventoryItemProps;
  onClose: () => void;
}

export function EditItemModal({ item, onClose }: EditItemModalProps) {
  // useTransition es millor que useState per a accions de servidor (no bloqueja la UI)
  const [isPending, startTransition] = useTransition();

  // Valors inicials
  const [formData, setFormData] = useState({
    name: item.name,
    emoji: item.emoji || '📦',
    quantity: item.quantity,
    unit: item.unit,
    // Convertim la data a YYYY-MM-DD pel input type="date"
    expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : ''
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (delta: number) => {
    const step = formData.unit === 'ut' ? 1 : 0.1;
    const current = Number(formData.quantity);
    let newValue = current + (delta * step);
    // Arrodonim per evitar decimals estranys (ex: 0.300000004)
    newValue = Math.max(0, parseFloat(newValue.toFixed(2)));
    handleChange('quantity', newValue);
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        // ✅ 1. PREPARACIÓ DE DADES (Clean Code)
        // Convertim l'string de data a un objecte Date real o null
        const validDate = formData.expiryDate ? new Date(formData.expiryDate) : null;

        // ✅ 2. ENVIAMENT COM A OBJECTE (No FormData)
        // Això evita problemes de tipus amb números i dates
        const res = await updateItemAction({
            id: item.id,
            name: formData.name,
            emoji: formData.emoji,
            quantity: Number(formData.quantity), // Assegurem que és número
            unit: formData.unit,
            expiryDate: validDate // Ara sí que és un Date o null
        });

        if (res.success) {
            // Opcional: Feedback visual
            // toast.success("Guardat!"); 
            onClose();
        } else {
            console.error("❌ [CLIENT] Error:", res.error);
            alert(`Error: ${res.error}`);
        }
      } catch (err) {
        console.error("❌ [CLIENT] Error inesperat:", err);
        alert("Hi ha hagut un error inesperat.");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Segur que vols eliminar aquest producte?")) return;
    
    startTransition(async () => {
      const res = await deleteItemAction(item.id);
      if (res.success) onClose();
      else alert(res.error);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl relative zoom-in-95 animate-in duration-200">
        
        {/* HEADER */}
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

          {/* QUANTITAT I UNITAT */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Quantitat</label>
              <div className="flex items-center gap-2">
                <button onClick={() => handleQuantityChange(-1)} className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center text-xl font-bold active:scale-95 transition-all">-</button>
                <input 
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
                    className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl text-center text-white font-mono text-lg h-12 focus:border-purple-500 outline-none"
                />
                <button onClick={() => handleQuantityChange(1)} className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center text-xl font-bold active:scale-95 transition-all">+</button>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Unitat</label>
              <select value={formData.unit} onChange={(e) => handleChange('unit', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 h-12 text-white focus:border-purple-500 outline-none appearance-none cursor-pointer text-sm font-medium">
                <option value="ut">📦 Unitats</option>
                <option value="kg">⚖️ Kilos</option>
                <option value="l">💧 Litres</option>
                <option value="g">🤏 Grams</option>
                <option value="ml">💧 ml</option>
              </select>
            </div>
          </div>

          {/* UBICACIÓ I DATA */}
          <div className="grid grid-cols-2 gap-4">
            {/* Si no fas servir location al backend, pots treure aquest bloc o deixar-lo com a metadata */}
            {/* <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Ubicació</label>
              <select disabled className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 h-12 text-slate-500 opacity-50 outline-none appearance-none cursor-not-allowed text-sm">
                <option>🏠 Per defecte</option>
              </select>
            </div> */}
            
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Caducitat (Opcional)</label>
              <input 
                type="date" 
                value={formData.expiryDate} 
                onChange={(e) => handleChange('expiryDate', e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 h-12 text-white text-sm focus:border-purple-500 outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={handleDelete} disabled={isPending} className="px-4 py-3 rounded-xl bg-red-900/20 text-red-400 font-bold border border-red-900/50 hover:bg-red-900/40 transition-colors disabled:opacity-50">
            {isPending ? '...' : '🗑️'}
          </button>
          
          <button 
            onClick={handleSave} 
            disabled={isPending} 
            className="flex-1 py-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? '💾 Guardant...' : '💾 Guardar Canvis'}
          </button>
        </div>

      </div>
    </div>
  );
}