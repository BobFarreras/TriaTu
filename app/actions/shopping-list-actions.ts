'use server';

import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { revalidatePath } from 'next/cache';
import { debug } from '@/lib/logger';
import { logActionError } from '@/lib/observability/action-logger';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';

const AddItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string(),
  emoji: z.string().optional(),
  productId: z.string().optional().nullable(),
  productImage: z.string().optional().nullable(),
  estimatedCost: z.number().optional().nullable(),
  roomId: z.string().uuid().optional().nullable()
});
// ✅ Schema per validació massiva
const BatchItemSchema = z.object({
  items: z.array(AddItemSchema),
  roomId: z.string().uuid().optional().nullable()
});
const ToggleItemSchema = z.object({
  itemId: z.string().uuid(),
  isChecked: z.boolean()
});
const RoomIdSchema = z.string().uuid().optional().nullable();
// 1. ADD ITEM
export async function addToShoppingListAction(
    name: string, 
    quantity: number, 
    unit: string, 
    emoji?: string, 
    productId?: string,
    productImage?: string,
    estimatedCost?: number,
    roomId?: string | null
) {
  try {
    debug('[ACTION] addToShoppingList start');

    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = await createClient();
    const validation = AddItemSchema.safeParse({ 
        name, quantity, unit, emoji, productId, productImage, estimatedCost, roomId
    });
    
    if (!validation.success) {
        return { success: false, error: "Dades invàlides" };
    }

    const useCase = container.getAddToShoppingList(supabase);
    
    await useCase.execute(
        user.id, 
        validation.data.name, 
        validation.data.quantity, 
        validation.data.unit,
        validation.data.emoji,
        validation.data.productId || undefined,
        validation.data.productImage || undefined,
        validation.data.estimatedCost || undefined,
        validation.data.roomId || undefined
    );

    revalidatePath('/shopping-list');
    return { success: true };

  } catch (error) {
    logActionError('addToShoppingListAction', 'addToShoppingList failed', error);
    return { success: false, error: "No s'ha pogut afegir a la llista." };
  }
}

// 2. TOGGLE ITEM
export async function toggleShoppingItemAction(itemId: string, isChecked: boolean) {
  try {
    const validation = ToggleItemSchema.safeParse({ itemId, isChecked });
    if (!validation.success) return { success: false, error: "Dades invàlides" };

    const supabase = await createClient();
    const repo = container.getShoppingListRepo(supabase); 
    await repo.toggleCheck(validation.data.itemId, validation.data.isChecked);

    revalidatePath('/shopping-list');
    return { success: true };
  } catch (error) {
    logActionError('toggleShoppingItemAction', 'toggleShoppingItem failed', error);
    return { success: false, error: "Error actualitzant" };
  }
}

// 3. COMPLETE SESSION
export async function completeShoppingSessionAction(roomId?: string | null) {
  try {
    const validation = RoomIdSchema.safeParse(roomId);
    if (!validation.success) return { success: false, error: "Dades invàlides" };

    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const supabase = await createClient();
    const useCase = container.getCompleteShoppingSession(supabase);
    const result = (await useCase.execute(user.id, validation.data || undefined)) as { added: number };

    revalidatePath('/shopping-list');
    revalidatePath('/inventory');
    return { success: true, count: result.added };
  } catch (error) {
    logActionError('completeShoppingSessionAction', 'Error completing shopping session:', error);
    return { success: false, error: "Error finalitzant la compra" };
  }
}
export async function addBatchToShoppingListAction(items: z.infer<typeof AddItemSchema>[], roomId?: string | null) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const supabase = await createClient();
    // Validar dades
    const validation = BatchItemSchema.safeParse({ items, roomId });
    if (!validation.success) return { success: false, error: "Dades invàlides" };

    const useCase = container.getAddToShoppingList(supabase);

    // Executar en paral·lel (o podries fer un loop sequencial si vols garantir ordre)
    await Promise.all(items.map(item => 
      useCase.execute(
        user.id,
        item.name,
        item.quantity,
        item.unit,
        item.emoji,
        item.productId || undefined,
        item.productImage || undefined,
        item.estimatedCost || undefined,
        validation.data.roomId || undefined
      )
    ));

    revalidatePath('/shopping-list');
    return { success: true };

  } catch (error) {
    logActionError('addBatchToShoppingListAction', 'Error adding batch:', error);
    return { success: false, error: "Error guardant productes" };
  }
}

export async function getShoppingListDataAction(roomId?: string | null) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();
  const validation = RoomIdSchema.safeParse(roomId);
  if (!validation.success) return { success: false, error: "Dades invàlides" };

  try {
    const getShoppingList = container.getGetShoppingList(supabase);
    const getHistory = container.getGetShoppingHistory(supabase);

    const [items, history] = (await Promise.all([
      getShoppingList.execute(user.id, validation.data || undefined),
      getHistory.execute(user.id, validation.data || undefined),
    ])) as [
      import('@/core/domain/entities/ShoppingListItem').ShoppingListItem[],
      import('@/core/domain/entities/ShoppingSession').ShoppingSession[]
    ];

    return {
      success: true,
      data: {
        items: mapItemsToViewModel(items),
        history: mapHistoryToViewModel(history),
      },
    };
  } catch (error) {
    logActionError('getShoppingListDataAction', 'getShoppingListDataAction failed', error);
    return { success: false, error: "No s'ha pogut carregar la llista." };
  }
}

function mapItemsToViewModel(items: import('@/core/domain/entities/ShoppingListItem').ShoppingListItem[]) {
  return items.map((i) => ({
    id: i.props.id,
    name: i.props.name,
    quantity: i.props.quantity,
    unit: i.props.unit,
    isChecked: i.props.isChecked,
    emoji: i.props.emoji,
    productId: i.props.productId ?? undefined,
    productImage: i.props.productImage ?? undefined,
    estimatedCost: i.props.estimatedCost ?? undefined
  }));
}

function mapHistoryToViewModel(history: import('@/core/domain/entities/ShoppingSession').ShoppingSession[]) {
  return history.map((h) => ({
    id: h.props.id,
    createdAt: h.props.createdAt,
    totalCost: h.props.totalCost,
    itemCount: h.props.itemCount,
    itemsSnapshot: h.props.itemsSnapshot
  }));
}
