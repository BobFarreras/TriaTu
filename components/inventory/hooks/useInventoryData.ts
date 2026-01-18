'use client';

import { useState, useEffect, useCallback } from 'react';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { getInventoryAction } from '@/app/actions/inventory';
import { getMyInventoryRoomsAction } from '@/app/actions/room-actions';
import { toast } from 'sonner';

export type InventoryScope = 'PERSONAL' | string;

// ✅ DEFINICIÓ DE TIPUS PER AL DTO DEL SERVIDOR (Evitem 'any')
// És igual que el Props del domini, però les dates són strings
type ServerInventoryItem = Omit<InventoryItemProps, 'expiryDate' | 'addedAt'> & {
  expiryDate?: string | null;
  addedAt: string;
};

// ✅ HELPER TIPAT CORRECTAMENT
function mapServerToDomain(items: ServerInventoryItem[]): InventoryItemProps[] {
  return items.map(item => ({
    ...item,
    // Convertim strings ISO a objectes Date reals
    expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
    addedAt: new Date(item.addedAt),
    // Assegurem que roomId sigui string o undefined (mai null) per al frontend
    roomId: item.roomId || undefined
  }));
}

export function useInventoryData(initialItems: InventoryItemProps[]) {
  const [scope, setScope] = useState<InventoryScope>('PERSONAL');
  const [items, setItems] = useState<InventoryItemProps[]>(initialItems);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Carregar Sales disponibles
  useEffect(() => {
    getMyInventoryRoomsAction()
      .then(setRooms)
      .catch(err => {
        // ✅ CORRECCIÓ: Usem la variable d'error
        console.error("Error loading rooms", err);
      });
  }, []);

  // 2. Funció per refrescar dades
  const refreshInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const roomId = scope === 'PERSONAL' ? undefined : scope;
      const response = await getInventoryAction(roomId);

      if (response.success && response.data) {
        // TypeScript ara sap que response.data compleix ServerInventoryItem[]
        // gràcies a la inferència o podem fer un cast segur si l'acció no està tipada estrictament al retorn
        const domainItems = mapServerToDomain(response.data as unknown as ServerInventoryItem[]);
        setItems(domainItems);
      } else {
        toast.error("Error actualitzant inventari");
      }
    } catch (error) {
      // ✅ CORRECCIÓ: Usem la variable o la traiem del catch
      console.error("Error fetching inventory:", error);
      toast.error("Error de connexió");
    } finally {
      setIsLoading(false);
    }
  }, [scope]);

  // 3. Efecte: Quan canvia l'scope, refresquem
  useEffect(() => {
    if (scope === 'PERSONAL' && items === initialItems) return;
    refreshInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]); // Treiem dependencies innecessàries per evitar bucles

  return {
    scope,
    setScope,
    items,
    setItems,
    rooms,
    isLoading,
    refreshInventory
  };
}