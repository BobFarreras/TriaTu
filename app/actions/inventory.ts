// src/app/actions/inventory-actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { StorageLocation } from '@/core/domain/entities/StorageLocation';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';
import { SupabaseInventoryRepository } from '@/adapters/supabase/SupabaseInventoryRepository';
import { FOOD_PRESETS } from '@/lib/food-presets'; // ✅ Importa els presets
import {
  InventoryItemSchema,
  ConsumeItemSchema,
} from '@/core/application/schemas/inputSchemas';

// ------------------------------------------------------------------
// ✅ FUNCIÓ HELPER INTEL·LIGENT (Moguda a dalt per claredat)
// ------------------------------------------------------------------
function calculateExpiryDate(name: string, emoji?: string): Date | undefined {
  const now = new Date();
  
  // 1. Busquem match exacte als presets (per Nom o Emoji)
  const preset = FOOD_PRESETS.find(p => 
    p.name.toLowerCase() === name.toLowerCase() || 
    (emoji && p.emoji === emoji)
  );

  if (preset) {
    const days = preset.expirationDays;
    // Creem una nova data sumant els dies
    const result = new Date();
    result.setDate(now.getDate() + days);
    return result;
  }

  // 2. Si no trobem res, retornem undefined (sense data)
  // Opcional: Podries retornar 'now + 14 dies' si vols un fallback genèric
  return undefined; 
}

// ------------------------------------------------------------------
// SCHEMAS I INTERFÍCIES
// ------------------------------------------------------------------

const BatchInventorySchema = z.array(
  InventoryItemSchema.omit({ userId: true })
);

interface UpdateItemDTO {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  emoji: string;
  expiryDate?: Date | null;
  location?: string;
}

interface ItemData {
  name: string;
  quantity: number;
  unit: string;
  location: StorageLocation;
  emoji: string;
  expiryDate?: string | undefined;
}

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

    const expiryRaw = formData.get('expiryDate');
    const expiryString = (expiryRaw && expiryRaw !== '' && expiryRaw !== 'null' && expiryRaw !== 'undefined')
      ? String(expiryRaw)
      : undefined;

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
    let finalData: ItemData | z.infer<typeof InventoryItemSchema>;

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      // Si l'únic error és la data, fem bypass (ja ho gestionem nosaltres)
      if (errors.expiryDate && Object.keys(errors).length === 1) {
        finalData = rawData as unknown as ItemData;
      } else {
        console.error("❌ [SERVER] Error Zod Real:", errors);
        return { success: false, error: getZodError(validation.error) };
      }
    } else {
      finalData = validation.data;
    }

    // ✅ CÀLCUL INTEL·LIGENT DE DATA
    // Si l'usuari ha posat data (expiryString), la fem servir.
    // Si no, la calculem automàticament segons el producte.
    let finalExpiryDate = expiryString ? new Date(expiryString) : undefined;
    
    if (!finalExpiryDate) {
        finalExpiryDate = calculateExpiryDate(String(finalData.name), String(finalData.emoji));
    }

    const addItemUseCase = container.getAddItem();

    await addItemUseCase.execute({
      userId: user.id,
      name: String(finalData.name),
      quantity: Number(finalData.quantity),
      unit: String(finalData.unit),
      location: finalData.location as StorageLocation,
      expiryDate: finalExpiryDate, // Data calculada o manual
      emoji: String(finalData.emoji || '📦'),
      addedAt: new Date()
    });

    revalidatePath('/inventory');
    return { success: true };

  } catch (error: unknown) {
    console.error('💥 [SERVER] Error addItemAction:', error);
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
export async function updateItemAction(item: UpdateItemDTO) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    if (!item.id) throw new Error("ID is required");
    if (!item.name) throw new Error("Name is required");

    const updateUseCase = container.getUpdateItem();

    await updateUseCase.execute({
      id: item.id,
      userId: user.id,
      name: item.name,
      emoji: item.emoji || '📦',
      quantity: item.quantity,
      unit: item.unit,
      location: (item.location as StorageLocation) || 'PANTRY',
      expiryDate: item.expiryDate ? item.expiryDate : undefined,
      addedAt: new Date()
    });

    revalidatePath('/inventory');
    return { success: true };
  } catch (error: unknown) {
    console.error("❌ [SERVER UPDATE ERROR]:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

// ------------------------------------------------------------------
// 4. DELETE ITEM
// ------------------------------------------------------------------
export async function deleteItemAction(itemId: string) {
  try {
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

// ------------------------------------------------------------------
// 5. BULK ADD ITEMS
// ------------------------------------------------------------------
export async function addBatchItemsAction(items: z.infer<typeof BatchInventorySchema>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const validation = BatchInventorySchema.safeParse(items);
    if (!validation.success) {
      return { success: false, error: getZodError(validation.error) };
    }

    const repo = new SupabaseInventoryRepository();

    const entities = validation.data.map(d => {
      
      // ✅ CÀLCUL INTEL·LIGENT DE DATA (Usant la funció helper)
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
        expiryDate: finalDate, // Data automàtica
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