'use server';

import { revalidatePath } from 'next/cache';
import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user;
}

export async function addItemAction(formData: FormData) {
  try {
    const user = await getAuthenticatedUser();

    const name = formData.get('name') as string;
    const quantity = Number(formData.get('quantity'));
    const unit = formData.get('unit') as string;
    const location = formData.get('location') as StorageLocation;
    const expiryDateRaw = formData.get('expiryDate') as string;
    const emoji = formData.get('emoji') as string;

    if (!name || quantity <= 0) {
      throw new Error('Dades invàlides: El nom és obligatori.');
    }

    // ✅ CORRECCIÓ: Fem servir 'getAddItem' que és com es diu al teu container.ts
    const addItemUseCase = container.getAddItem();

    await addItemUseCase.execute({
      userId: user.id,
      name,
      quantity,
      unit,
      location,
      expiryDate: expiryDateRaw ? new Date(expiryDateRaw) : undefined,
      emoji: emoji || '📦',
      addedAt: new Date()
    });

    revalidatePath('/inventory');
    return { success: true };

  } catch (error: unknown) {
    console.error('Error in addItemAction:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// ... (consumeItemAction es queda igual)
export async function consumeItemAction(itemId: string, amount: number) {
  try {
    await getAuthenticatedUser();
    // ✅ També revisa que aquest es digui així al container
    const consumeItemUseCase = container.getConsumeItem();
    await consumeItemUseCase.execute(itemId, amount);

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
// ✅ ACCIÓ PER ACTUALITZAR UN PRODUCTE
export async function updateItemAction(formData: FormData) {
  try {
    const user = await getAuthenticatedUser();

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const emoji = formData.get('emoji') as string;
    const quantity = Number(formData.get('quantity'));
    const unit = formData.get('unit') as string;
    const location = formData.get('location') as StorageLocation;
    const expiryDateRaw = formData.get('expiryDate') as string;

    if (!id || !name || quantity < 0) {
      throw new Error('Dades invàlides per actualitzar.');
    }

    // Fem servir el mateix UseCase d'afegir o un de nou Update
    // Si tens un 'getUpdateItem' al container, fes-lo servir. 
    // Si no, podem reutilitzar lògica similar a Add però forçant l'ID existent.
    // Per fer-ho net, assumirem que tens un UseCase 'updateItem'.
    // Si no el tens, avisa'm i en creem un de ràpid.
    
    // OPCIÓ RÀPIDA (Reutilitzant AddToInventory si el teu repo fa 'upsert'):
    // Però el més correcte en DDD és tenir un cas d'ús específic.
    // Anem a suposar que crearem el cas d'ús UpdateItem ara mateix.
    const updateUseCase = container.getUpdateItem(); 

    await updateUseCase.execute({
      id,
      userId: user.id,
      name,
      emoji: emoji || '📦',
      quantity,
      unit,
      location,
      expiryDate: expiryDateRaw ? new Date(expiryDateRaw) : undefined,
      addedAt: new Date() // Això no s'hauria de tocar, però el DTO ho demana
    });

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ✅ ACCIÓ PER ELIMINAR
export async function deleteItemAction(itemId: string) {
  try {
    await getAuthenticatedUser();
    const deleteUseCase = container.getDeleteItem();
    await deleteUseCase.execute(itemId);
    
    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}