// =================== FILE: src/app/actions/inventory-actions.ts ===================
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { 
  InventoryItemSchema, 
  ConsumeItemSchema, 

} from '@/core/application/schemas/inputSchemas'; // ✅ Importem Schemas

// Helper segur per errors de Zod
function getZodError(error: z.ZodError<unknown>): string {
    return error.issues[0]?.message || "Dades invàlides";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// ------------------------------------------------------------------
// 1. ADD ITEM
// ------------------------------------------------------------------
export async function addItemAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 1. Validació Zod
    const rawData = {
        userId: user.id,
        name: formData.get('name'),
        quantity: Number(formData.get('quantity')),
        unit: formData.get('unit'),
        location: formData.get('location'),
        expiryDate: formData.get('expiryDate'), // Pot ser null/buit
        emoji: formData.get('emoji')
    };

    // Zod s'encarrega de convertir strings a dates si el schema és .datetime() i rep string ISO,
    // però si ve del formulari HTML date, a vegades cal un petit preprocessament.
    // Per simplificar, deixem que Zod validi l'estructura.
    const validation = InventoryItemSchema.safeParse(rawData);

    if (!validation.success) {
        return { success: false, error: getZodError(validation.error) };
    }

    const data = validation.data;

    // 2. Execució
    const addItemUseCase = container.getAddItem();

    await addItemUseCase.execute({
      userId: user.id,
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
      location: data.location as StorageLocation, // Casting segur després de validació
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      emoji: data.emoji || '📦',
      addedAt: new Date()
    });

    revalidatePath('/inventory');
    return { success: true };

  } catch (error: unknown) {
    console.error('Error in addItemAction:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 2. CONSUME ITEM
// ------------------------------------------------------------------
export async function consumeItemAction(itemId: string, amount: number) {
  try {
    const validation = ConsumeItemSchema.safeParse({ itemId, amount });
    
    if (!validation.success) {
        return { success: false, error: getZodError(validation.error) };
    }

    const consumeItemUseCase = container.getConsumeItem();
    await consumeItemUseCase.execute(validation.data.itemId, validation.data.amount);

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 3. UPDATE ITEM
// ------------------------------------------------------------------
export async function updateItemAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const rawData = {
        id: formData.get('id'), // Important validar que és UUID
        userId: user.id,
        name: formData.get('name'),
        quantity: Number(formData.get('quantity')),
        unit: formData.get('unit'),
        location: formData.get('location'),
        expiryDate: formData.get('expiryDate'),
        emoji: formData.get('emoji')
    };

    // Reutilitzem el mateix schema però assegurant que ID existeix
    const validation = InventoryItemSchema.extend({ id: z.string().uuid() }).safeParse(rawData);

    if (!validation.success) {
        return { success: false, error: getZodError(validation.error) };
    }
    
    const data = validation.data;

    // Assumim que tens un cas d'ús UpdateItem o un mètode update al repo
    // Si no el tens, avisa'm. De moment poso getUpdateItem com placeholder.
    const updateUseCase = container.getUpdateItem(); 

    await updateUseCase.execute({
      id: data.id,
      userId: user.id,
      name: data.name,
      emoji: data.emoji || '📦',
      quantity: data.quantity,
      unit: data.unit,
      location: data.location as StorageLocation,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      addedAt: new Date() 
    });

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 4. DELETE ITEM
// ------------------------------------------------------------------
export async function deleteItemAction(itemId: string) {
  try {
    // Validem només que sigui un UUID vàlid
    const validation = z.string().uuid().safeParse(itemId);
    if (!validation.success) return { success: false, error: "ID invàlid" };

    const deleteUseCase = container.getDeleteItem();
    await deleteUseCase.execute(itemId);
    
    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

