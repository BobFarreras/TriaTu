'use server';

import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { revalidatePath } from 'next/cache';
import { debug, error as logError } from '@/lib/logger';
import { z } from 'zod';

const AddItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string(),
  emoji: z.string().optional(),
  productId: z.string().optional().nullable(),
  productImage: z.string().optional().nullable(),
  estimatedCost: z.number().optional().nullable()
});
// ✅ Schema per validació massiva
const BatchItemSchema = z.object({
  items: z.array(AddItemSchema)
});
// 1. ADD ITEM
export async function addToShoppingListAction(
    name: string, 
    quantity: number, 
    unit: string, 
    emoji?: string, 
    productId?: string,
    productImage?: string,
    estimatedCost?: number
) {
  try {
    debug('[ACTION] addToShoppingList start');

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const validation = AddItemSchema.safeParse({ 
        name, quantity, unit, emoji, productId, productImage, estimatedCost 
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
        validation.data.estimatedCost || undefined
    );

    revalidatePath('/shopping-list');
    return { success: true };

  } catch (error) {
    logError('addToShoppingList failed', error);
    return { success: false, error: "No s'ha pogut afegir a la llista." };
  }
}

// 2. TOGGLE ITEM
export async function toggleShoppingItemAction(itemId: string, isChecked: boolean) {
  try {
    const supabase = await createClient();
    const repo = container.getShoppingListRepo(supabase); 
    await repo.toggleCheck(itemId, isChecked);

    revalidatePath('/shopping-list');
    return { success: true };
  } catch (error) {
    logError('toggleShoppingItem failed', error);
    return { success: false, error: "Error actualitzant" };
  }
}

// 3. COMPLETE SESSION
export async function completeShoppingSessionAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const useCase = container.getCompleteShoppingSession(supabase);
    const result = await useCase.execute(user.id);

    revalidatePath('/shopping-list');
    revalidatePath('/inventory');
    return { success: true, count: result.added };
  } catch (error) {
    logError("Error completing shopping session:", error);
    return { success: false, error: "Error finalitzant la compra" };
  }
}
export async function addBatchToShoppingListAction(items: z.infer<typeof AddItemSchema>[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Validar dades
    const validation = BatchItemSchema.safeParse({ items });
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
        item.estimatedCost || undefined
      )
    ));

    revalidatePath('/shopping-list');
    return { success: true };

  } catch (error) {
    logError("Error adding batch:", error);
    return { success: false, error: "Error guardant productes" };
  }
}
