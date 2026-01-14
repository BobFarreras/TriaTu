// ARXIU: src/app/actions/inventory.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container'; // ✅ Importem el contenidor
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { FOOD_PRESETS } from '@/lib/food-presets';

import {
  InventoryItemSchema,
  ConsumeItemSchema,
} from '@/core/application/schemas/inputSchemas';

// --- HELPERS (Es queden igual) ---
function calculateExpiryDate(name: string, emoji?: string): Date | undefined {
  const now = new Date();
  const preset = FOOD_PRESETS.find(p => 
    p.name.toLowerCase() === name.toLowerCase() || 
    (emoji && p.emoji === emoji)
  );
  if (preset) {
    const result = new Date();
    result.setDate(now.getDate() + preset.expirationDays);
    return result;
  }
  return undefined; 
}

const BatchInventorySchema = z.array(InventoryItemSchema.omit({ userId: true }));
function getZodError(error: z.ZodError<unknown>): string { return error.issues[0]?.message || "Dades invàlides"; }
function getErrorMessage(error: unknown): string { return error instanceof Error ? error.message : String(error); }

// ------------------------------------------------------------------
// 1. ADD ITEM
// ------------------------------------------------------------------
export async function addItemAction(formData: FormData) {
  try {
    // 1. Obtenim el client (essencial per seguretat)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 2. Processem dades (Form Data Parsing)
    const expiryRaw = formData.get('expiryDate');
    const expiryString = (expiryRaw && expiryRaw !== '' && expiryRaw !== 'null' && expiryRaw !== 'undefined')
      ? String(expiryRaw) : undefined;

    const rawData = {
      userId: user.id,
      name: formData.get('name'),
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit'),
      location: formData.get('location'),
      expiryDate: expiryString,
      emoji: formData.get('emoji')
    };

    const validation = InventoryItemSchema.safeParse(rawData);
    if (!validation.success) return { success: false, error: getZodError(validation.error) };
    
    const finalData = validation.data;
    let finalExpiryDate = expiryString ? new Date(expiryString) : undefined;
    if (!finalExpiryDate) {
        finalExpiryDate = calculateExpiryDate(String(finalData.name), String(finalData.emoji));
    }

    // ✅ 3. USEM EL CONTENIDOR (Li passem el client i ell ens dona el UseCase llest)
    const useCase = container.getAddItem(supabase);

    await useCase.execute({
      userId: user.id,
      name: String(finalData.name),
      quantity: Number(finalData.quantity),
      unit: String(finalData.unit),
      location: finalData.location as StorageLocation,
      expiryDate: finalExpiryDate,
      emoji: String(finalData.emoji || '📦'),
      addedAt: new Date()
    });

    revalidatePath('/inventory');
    return { success: true };

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 2. CONSUME ITEM
// ------------------------------------------------------------------
export async function consumeItemAction(itemId: string, amount: number) {
  try {
    const validation = ConsumeItemSchema.safeParse({ itemId, amount });
    if (!validation.success) return { success: false, error: getZodError(validation.error) };

    const supabase = await createClient(); // 1. Client
    const useCase = container.getConsumeItem(supabase); // 2. Container

    await useCase.execute(validation.data.itemId, validation.data.amount);

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 3. UPDATE ITEM
// ------------------------------------------------------------------
interface UpdateItemDTO { id: string; name: string; quantity: number; unit: string; emoji: string; expiryDate?: Date | null; location?: string; }

export async function updateItemAction(item: UpdateItemDTO) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    if (!item.id || !item.name) throw new Error("Dades incompletes");

    const useCase = container.getUpdateItem(supabase); // ✅ Container

    await useCase.execute({
      id: item.id,
      userId: user.id,
      name: item.name,
      emoji: item.emoji || '📦',
      quantity: item.quantity,
      unit: item.unit,
      location: (item.location as StorageLocation) || StorageLocation.PANTRY,
      expiryDate: item.expiryDate ? item.expiryDate : undefined,
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
    if (!itemId) return { success: false, error: "ID invàlid" };

    const supabase = await createClient();
    const useCase = container.getDeleteItem(supabase); // ✅ Container

    await useCase.execute(itemId);

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 5. BULK ADD ITEMS
// ------------------------------------------------------------------
export async function addBatchItemsAction(items: z.infer<typeof BatchInventorySchema>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const validation = BatchInventorySchema.safeParse(items);
    if (!validation.success) return { success: false, error: getZodError(validation.error) };

    // ✅ Aquí necessitem el Repositori directament, no un UseCase.
    // El contenidor també ens el pot donar!
    const repo = container.getInventoryRepo(supabase);

    const entities = validation.data.map(d => {
      let finalDate = d.expiryDate ? new Date(d.expiryDate) : undefined;
      if (!finalDate) {
         finalDate = calculateExpiryDate(d.name, d.emoji);
      }

      return InventoryItem.create({
        id: crypto.randomUUID(),
        userId: user.id,
        name: d.name,
        quantity: d.quantity,
        unit: d.unit,
        location: d.location as StorageLocation,
        expiryDate: finalDate,
        emoji: d.emoji || '📦',
        addedAt: new Date()
      });
    });

    await repo.saveBatch(entities);

    revalidatePath('/inventory');
    return { success: true };

  } catch (error: unknown) {
    console.error('Error in addBatchItemsAction:', error);
    return { success: false, error: getErrorMessage(error) };
  }
}