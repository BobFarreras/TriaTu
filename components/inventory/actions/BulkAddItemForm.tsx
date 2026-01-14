'use client';

import { useState } from 'react';
import { ProductExplorer } from '@/components/inventory/products/ProductExplorer';
import { CartDock } from '@/components/inventory/products/CartDock'; // ✅ Importem el Dock
import { ProductResult, addBatchItemsAction } from '@/app/actions/inventory';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';

interface Props {
  onClose: () => void;
}

interface CartItem {
  product: ProductResult;
  quantity: number;
}

const detectLocation = (tags: string[] | undefined): StorageLocation => {
  if (!tags) return StorageLocation.PANTRY;
  const upperTags = tags.map(t => t.toUpperCase());
  if (upperTags.includes('CONGELAT')) return StorageLocation.FREEZER;
  if (upperTags.includes('REFRIGERAT')) return StorageLocation.FRIDGE;
  return StorageLocation.PANTRY;
};

export function BulkAddItemForm({ onClose }: Props) {
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const quantitiesMap = cart.reduce((acc, item) => {
    acc[item.product.id] = item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const handleSelect = (product: ProductResult) => {
    setCart(prev => {
        const existing = prev.find(p => p.product.id === product.id);
        if (existing) {
            return prev.map(p => p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
        }
        return [{ product, quantity: 1 }, ...prev];
    });
  };
  
  const handleRemove = (id: string) => setCart(prev => prev.filter(p => p.product.id !== id));

  const handleSaveAll = async () => {
     if (cart.length === 0) return;
     setIsSaving(true);
     try {
        const itemsPayload = cart.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            unit: 'ut', 
            location: detectLocation(item.product.tags), 
            emoji: item.product.emoji,
            productId: item.product.id
        }));
        const result = await addBatchItemsAction(itemsPayload);
        if (result.success) onClose();
        else alert("Error: " + result.error);
     } catch(e) { console.error(e); } finally { setIsSaving(false); }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950">
      
      {/* ❌ HEM ELIMINAT LA CAPÇALERA D'AQUÍ. 
         Ara està integrada dins del ProductExplorer.
      */}

      {/* COS PRINCIPAL */}
      <div className="flex-1 overflow-hidden relative">
         <ProductExplorer 
            onSelect={handleSelect} 
            quantities={quantitiesMap} 
            // ✅ Passem onClose perquè el posi al lloc del buscador
            onClose={onClose} 
         />
      </div>

      {/* DOCK */}
      <CartDock 
        items={cart} 
        onRemove={handleRemove}
        onSave={handleSaveAll}
        isSaving={isSaving}
      />

    </div>
  );
}