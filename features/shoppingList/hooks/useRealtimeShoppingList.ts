'use client';

import { useEffect, useRef, useMemo } from 'react';
import { createClient } from '@/adapters/supabase/browser';
import { ShoppingScope } from './useShoppingListData';

export function useRealtimeShoppingList(
  scope: ShoppingScope,
  userId: string,
  onRefresh: () => void
) {
  const supabase = useMemo(() => createClient(), []);
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    const filterString = scope === 'PERSONAL'
      ? `and=(room_id.is.null,user_id.eq.${userId})`
      : `room_id=eq.${scope}`;

    console.log(`🔌 [REALTIME] ShoppingList connectant... (${scope})`);
    console.log(`🔎 [REALTIME] Filter: ${filterString}`);

    const itemsChannel = supabase
      .channel(`shopping-list-items-${scope}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_list_items',
          filter: filterString
        },
        () => {
          console.log('✅ [REALTIME] Event shopping_list_items');
          if (onRefreshRef.current) onRefreshRef.current();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ [REALTIME] Items subscrit (${scope})`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ [REALTIME] Items error');
        }
      });

    const sessionsChannel = supabase
      .channel(`shopping-list-sessions-${scope}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_sessions',
          filter: filterString
        },
        () => {
          console.log('✅ [REALTIME] Event shopping_sessions');
          if (onRefreshRef.current) onRefreshRef.current();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ [REALTIME] Sessions subscrit (${scope})`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ [REALTIME] Sessions error');
        }
      });

    return () => {
      console.log(`🔌 [REALTIME] Tancant shopping list (${scope})`);
      supabase.removeChannel(itemsChannel);
      supabase.removeChannel(sessionsChannel);
    };
  }, [scope, userId]);
}
