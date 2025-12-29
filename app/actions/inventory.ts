// src/app/actions/inventory.ts
'use server';

import { revalidatePath } from 'next/cache';
import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { StorageLocation } from '@/core/domain/entities/StorageLocation'; // Assegura't que la ruta és correcta

// Helper privat per extreure missatges d'error de forma segura
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Helper per auth
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user;
}

export async function addItemAction(formData: FormData) {
  try {
    const user = await getAuthenticatedUser();

    // Validació bàsica
    const name = formData.get('name') as string;
    const quantity = Number(formData.get('quantity'));
    const unit = formData.get('unit') as string;
    const location = formData.get('location') as StorageLocation;
    const expiryDateRaw = formData.get('expiryDate') as string;

    if (!name || quantity <= 0) {
      throw new Error('Dades invàlides: El nom és obligatori i la quantitat ha de ser positiva.');
    }

    const addItemUseCase = container.getAddItem();
    
    await addItemUseCase.execute({
      userId: user.id,
      name,
      quantity,
      unit,
      location,
      expiryDate: expiryDateRaw ? new Date(expiryDateRaw) : undefined,
      addedAt: new Date()
    });

    revalidatePath('/inventory');
    return { success: true };

  } catch (error: unknown) { // ✅ CORREGIT: usem unknown
    console.error('Error in addItemAction:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function consumeItemAction(itemId: string, amount: number) {
  try {
    await getAuthenticatedUser();

    const consumeItemUseCase = container.getConsumeItem();
    await consumeItemUseCase.execute(itemId, amount);

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) { // ✅ CORREGIT: usem unknown
    return { success: false, error: getErrorMessage(error) };
  }
}