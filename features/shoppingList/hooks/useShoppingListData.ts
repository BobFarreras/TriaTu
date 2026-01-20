'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getMyShoppingRoomsAction } from '@/app/actions/room-actions';
import { getShoppingListDataAction } from '@/app/actions/shopping-list-actions';
import { ShoppingItemUI } from '@/features/shoppingList/components/ShoppingListItem';
import { HistorySession } from '@/features/shoppingList/components/ShoppingHistory';

export type ShoppingScope = 'PERSONAL' | string;

function normalizeHistory(sessions: HistorySession[]): HistorySession[] {
  return sessions.map((session) => ({
    ...session,
    createdAt: session.createdAt instanceof Date ? session.createdAt : new Date(session.createdAt)
  }));
}

export function useShoppingListData(
  initialItems: ShoppingItemUI[],
  initialHistory: HistorySession[],
  initialScope?: string
) {
  const [scope, setScope] = useState<ShoppingScope>(initialScope ?? 'PERSONAL');
  const [items, setItems] = useState<ShoppingItemUI[]>(initialItems);
  const [history, setHistory] = useState<HistorySession[]>(() => normalizeHistory(initialHistory));
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setItems(initialItems);
    setHistory(normalizeHistory(initialHistory));
  }, [initialItems, initialHistory]);

  useEffect(() => {
    getMyShoppingRoomsAction()
      .then(setRooms)
      .catch((error) => {
        console.error('Error loading shopping rooms', error);
      });
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const roomId = scope === 'PERSONAL' ? undefined : scope;
      const response = await getShoppingListDataAction(roomId);

      if (response.success && response.data) {
        setItems(response.data.items);
        setHistory(normalizeHistory(response.data.history));
      } else {
        toast.error("Error actualitzant la llista");
      }
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      toast.error('Error de connexio');
    } finally {
      setIsLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    if (scope === 'PERSONAL' && items === initialItems) return;
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  return {
    scope,
    setScope,
    items,
    setItems,
    history,
    setHistory,
    rooms,
    isLoading,
    refreshData,
  };
}
