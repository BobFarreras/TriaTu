// ARXIU: src/features/shoppingList/components/BulkAddShoppingItemForm.tsx
'use client';

import { useState } from 'react';
import { ProductExplorer } from '@/features/inventory/products/ProductExplorer';
import { CartDock } from '@/features/inventory/products/CartDock'; 
import { ProductResult } from '@/app/actions/inventory';
import { addBatchToShoppingListAction } from '@/app/actions/shopping-list-actions';

interface Props {
  onClose: () => void;
  activeRoomId?: string;
}

interface CartItem {
  product: ProductResult;
  quantity: number;
}

export function BulkAddShoppingItemForm({ onClose, activeRoomId }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Mapeig per saber quants en tenim seleccionats al explorador
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
        // Mapegem el carret al format que espera l'acció de la llista de la compra
        const itemsPayload = cart.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            unit: 'ut', // Per defecte unitats, o podria venir del producte
            emoji: item.product.emoji,
            productId: item.product.id,
            productImage: item.product.image,
            estimatedCost: item.product.price // ✅ Important: Passem el preu!
        }));

        const result = await addBatchToShoppingListAction(itemsPayload, activeRoomId);

        if (result.success) {
           onClose();
        } else {
           alert("Error guardant: " + result.error);
        }
     } catch(e) { 
        console.error(e); 
     } finally { 
        setIsSaving(false); 
     }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 animate-in fade-in slide-in-from-bottom-10 duration-200">
     

       {/* EXPLORADOR */}
       <div className="flex-1 overflow-hidden relative">
         <ProductExplorer 
            onSelect={handleSelect} 
            quantities={quantitiesMap} 
            onClose={onClose} 

         />
      </div>

      {/* DOCK DEL CARRET */}
      <CartDock 
        items={cart} 
        onRemove={handleRemove}
        onSave={handleSaveAll}
        isSaving={isSaving}
     
      />
    </div>
  );
}

