// ARXIU: src/app/actions/shopping-list-actions.ts
'use server';

import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const AddItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string()
});

export async function addToShoppingListAction(name: string, quantity: number, unit: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const validation = AddItemSchema.safeParse({ name, quantity, unit });
    if (!validation.success) return { success: false, error: "Dades invàlides" };

    const useCase = container.getAddToShoppingList(supabase);
    
    await useCase.execute(
        user.id, 
        validation.data.name, 
        validation.data.quantity, 
        validation.data.unit
    );

    revalidatePath('/shopping-list');
    return { success: true };

  } catch (error) {
    console.error("Error adding to list:", error);
    return { success: false, error: "No s'ha pogut afegir a la llista." };
  }
}