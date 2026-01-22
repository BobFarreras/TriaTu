'use server';

import { createClient } from '@/adapters/supabase/server';
import { revalidatePath } from 'next/cache';

interface UpdateSettingsInput {
  roomId: string;
  setting: 'enableInventory' | 'enableShoppingList';
  value: boolean;
}

export async function updateRoomSettingsAction({ roomId, setting, value }: UpdateSettingsInput) {
  const supabase = await createClient();

  // 1. Mapeig segur: de Nom de Prop a Nom de Columna DB
  const columnMap: Record<string, 'enable_inventory' | 'enable_shopping_list'> = {
    enableInventory: 'enable_inventory',
    enableShoppingList: 'enable_shopping_list',
  };

  const dbColumn = columnMap[setting];
  if (!dbColumn) throw new Error('Invalid setting');

  // 2. Execució
  const { error } = await supabase
    .from('decision_rooms')
    .update({ [dbColumn]: value })
    .eq('id', roomId);

  if (error) {
    console.error('[UpdateSettings] Error:', error);
    return { success: false, error: error.message };
  }

  // 3. Revalidació: Forcem que Next.js recarregui les dades de la sala
  revalidatePath(`/rooms/${roomId}`);
  return { success: true };
}