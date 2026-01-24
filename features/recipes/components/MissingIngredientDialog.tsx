'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { addToShoppingListAction } from '@/app/actions/shopping-list-actions';
import { quickAddInventoryAction } from '@/app/actions/inventory'; // Aquesta és la que farem servir
import { getMyInventoryRoomsAction, getMyShoppingRoomsAction } from '@/app/actions/room-actions';
import { ScopeSelector } from '@/components/ScopeSelector';
import { toast } from 'sonner';

// ✅ INTERFÍCIE ACTUALITZADA (Ingredient Ric)
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  emoji?: string;
  // Nous camps opcionals
  image?: string;
  linkedProductImage?: string;
  linkedProductId?: string; // ID de producte de Bonpreu
  estimatedCost?: number;
}

interface Props {
  isOpen: boolean;
  ingredient: Ingredient | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function MissingIngredientDialog({ isOpen, ingredient, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState<'list' | 'inventory' | null>(null);
  const [inventoryRooms, setInventoryRooms] = useState<{ id: string; name: string }[]>([]);
  const [shoppingRooms, setShoppingRooms] = useState<{ id: string; name: string }[]>([]);
  const [inventoryScope, setInventoryScope] = useState<string>('PERSONAL');
  const [shoppingScope, setShoppingScope] = useState<string>('PERSONAL');

  useEffect(() => {
    if (!isOpen) return;
    getMyInventoryRoomsAction()
      .then((rooms) => {
        setInventoryRooms(rooms);
        if (rooms.length > 0 && inventoryScope === 'PERSONAL') {
          setInventoryScope(rooms[0].id);
        }
      })
      .catch(() => {});

    getMyShoppingRoomsAction()
      .then((rooms) => {
        setShoppingRooms(rooms);
        if (rooms.length > 0 && shoppingScope === 'PERSONAL') {
          setShoppingScope(rooms[0].id);
        }
      })
      .catch(() => {});
  }, [isOpen, inventoryScope, shoppingScope]);

  if (!isOpen || !ingredient) return null;

  // Lògica per mostrar imatge o emoji
  const imageUrl = ingredient.image || ingredient.linkedProductImage;
  const hasImage = !!imageUrl;

  const handleAddToList = async () => {
    setLoading('list');
    const roomId = shoppingScope === 'PERSONAL' ? undefined : shoppingScope;

    // ✅ Passem totes les dades rellevants
    const result = await addToShoppingListAction(
      ingredient.name,
      ingredient.quantity,
      ingredient.unit,
      ingredient.emoji,
      ingredient.linkedProductId,   // ✅ ID
      ingredient.linkedProductImage,// ✅ Imatge (IMPORTANT!)
      ingredient.estimatedCost,     // ✅ Preu
      roomId
    );

    if (result.success) {
      toast.success(`📝 Afegit a la llista: ${ingredient.name}`);
      onClose();
    } else {
      toast.error("Error afegint a la llista");
    }
    setLoading(null);
  };

  const handleAddToInventory = async () => {
    setLoading('inventory');
    const roomId = inventoryScope === 'PERSONAL' ? undefined : inventoryScope;

    // ✅ CRIDEM A L'ACCIÓ RÀPIDA AMB DADES RIQUES
    const result = await quickAddInventoryAction(
      ingredient.name,
      ingredient.quantity,
      ingredient.unit,
      ingredient.emoji,
      ingredient.linkedProductId, // ✅ Passem l'ID del producte si existeix
      roomId
    );

    if (result.success) {
      toast.success(`📦 Afegit al rebost: ${ingredient.name}`);
      onClose();
      onSuccess();
    } else {
      toast.error(result.error || "Error afegint a l'inventari");
    }
    setLoading(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* CAPÇALERA AMB IMATGE O EMOJI */}
            <div className="bg-gradient-to-r from-purple-900/40 to-slate-900 p-6 text-center border-b border-slate-800">
              <div className="mb-3 flex justify-center">
                {hasImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imageUrl} alt={ingredient.name} className="w-16 h-16 object-contain bg-white rounded-xl p-1 shadow-lg" />
                ) : (
                  <div className="text-4xl">{ingredient.emoji || '⚠️'}</div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">Et falta ingredient!</h2>
              <p className="text-slate-400 text-sm mt-1">{ingredient.name}</p>
            </div>

            {/* BOTONS D'ACCIÓ */}
            <div className="p-6 space-y-3">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Què vols fer?</p>

              <button
                onClick={handleAddToList}
                disabled={loading !== null}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-slate-900 p-2 rounded-lg group-hover:scale-110 transition-transform">📝</span>
                  <div className="text-left">
                    <div className="font-bold text-slate-200">Afegir a la Llista</div>
                    <div className="text-xs text-slate-400">
                      {shoppingScope === 'PERSONAL' ? 'Personal' : 'Compartida'}
                    </div>
                  </div>
                </div>
                {loading === 'list' && <span className="animate-spin">⏳</span>}
              </button>
              {shoppingRooms.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="uppercase text-[10px] font-bold tracking-wider">Llista</span>
                  <ScopeSelector
                    scope={shoppingScope}
                    setScope={setShoppingScope}
                    rooms={shoppingRooms}
                    personalLabel="Compra Personal"
                    className="flex-1"
                  />
                </div>
              )}

              <button
                onClick={handleAddToInventory}
                disabled={loading !== null}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-slate-900 p-2 rounded-lg group-hover:scale-110 transition-transform">📦</span>
                  <div className="text-left">
                    <div className="font-bold text-slate-200">Ja en tinc (Afegir stock)</div>
                    <div className="text-xs text-slate-400">
                      {inventoryScope === 'PERSONAL' ? 'Personal' : 'Compartit'}
                    </div>
                  </div>
                </div>
                {loading === 'inventory' && <span className="animate-spin">⏳</span>}
              </button>
              {inventoryRooms.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="uppercase text-[10px] font-bold tracking-wider">Inventari</span>
                  <ScopeSelector
                    scope={inventoryScope}
                    setScope={setInventoryScope}
                    rooms={inventoryRooms}
                    personalLabel="Inventari Personal"
                    className="flex-1"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
              <button onClick={onClose} className="text-sm text-slate-500 hover:text-white transition-colors">
                Cancel·lar operació
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
