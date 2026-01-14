'use client';

import { useState, useTransition } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { updateItemAction, deleteItemAction, consumeItemAction } from '@/app/actions/inventory';

// Sub-components
import { EditModalHeader } from './components/EditModalHeader';
import { EditModalControls } from './components/EditModalControls';
import { EditModalActions } from './components/EditModalActions';

interface Props {
  item: InventoryItemProps;
  onClose: () => void;
}

export function EditItemModal({ item, onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  // Estat del formulari
  const [formData, setFormData] = useState({
    quantity: item.quantity,
    unit: item.unit,
    location: item.location,
    expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
  });

  // --- LOGICA DE NEGOCI ---
  
  const handleQuantityChange = (delta: number) => {
    setFormData(prev => {
      const step = prev.unit === 'ut' ? 1 : 0.1;
      let newVal = Number(prev.quantity) + (delta * step);
      newVal = Math.max(0, parseFloat(newVal.toFixed(2)));
      return { ...prev, quantity: newVal };
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const validDate = formData.expiryDate ? new Date(formData.expiryDate) : undefined;
        const res = await updateItemAction({
          id: item.id,
          name: item.name, 
          emoji: item.emoji!,
          quantity: Number(formData.quantity),
          unit: formData.unit,
          location: formData.location, 
          expiryDate: validDate
        });
        if (res.success) onClose();
        else alert(`Error: ${res.error}`);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Eliminar definitivament?")) return;
    startTransition(async () => {
      const res = await deleteItemAction(item.id);
      if (res.success) onClose();
    });
  };

  const handleConsumeOne = () => {
    startTransition(async () => {
      await consumeItemAction(item.id, 1);
      if (formData.quantity <= 1) onClose();
      else handleQuantityChange(-1); 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" 
      />

      {/* Modal Container (Full Width Mobile / Card Desktop) */}
      <div className="relative w-full max-w-md bg-slate-900 border-t sm:border border-slate-700 sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-500 flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        
        {/* 1. Header (Imatge) */}
        <EditModalHeader item={item} onClose={onClose} />

        {/* 2. Controls (Scrollable) */}
        <EditModalControls 
           formData={formData} 
           setFormData={setFormData} 
           onQuantityChange={handleQuantityChange} 
        />

        {/* 3. Actions (Sticky Footer) */}
        <EditModalActions 
           onDelete={handleDelete} 
           onConsume={handleConsumeOne} 
           onSave={handleSave} 
           isSaving={isPending} 
        />

      </div>
    </div>
  );
}