'use client';

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { createClient } from '@/adapters/supabase/browser';
import { ShoppingScope } from './useShoppingListData';

export function useRealtimeShoppingList(
  scope: ShoppingScope,
  userId: string,
  onRefresh: () => void
) {
  const supabase = useMemo(() => createClient(), []);
  const onRefreshRef = useRef(onRefresh);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const notifyRefresh = useCallback(() => {
    const channel = channelRef.current;
    if (!channel) return;
    channel.send({
      type: 'broadcast',
      event: 'shopping-refresh',
      payload: { scope }
    });
  }, [scope]);

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
      .on(
        'broadcast',
        { event: 'shopping-refresh' },
        (payload) => {
          if (payload?.payload?.scope && payload.payload.scope !== scope) return;
          console.log('📣 [REALTIME] Broadcast refresh');
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

    channelRef.current = itemsChannel;

    return () => {
      console.log(`🔌 [REALTIME] Tancant shopping list (${scope})`);
      supabase.removeChannel(itemsChannel);
      supabase.removeChannel(sessionsChannel);
      channelRef.current = null;
    };
  }, [scope, userId, supabase]);

  return { notifyRefresh };
}
