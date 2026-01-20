import { ShoppingListRepository } from "@/core/ports/ShoppingListRepository";
import { InventoryRepository } from "@/core/ports/InventoryRepository";
import { InventoryItem } from "@/core/domain/entities/InventoryItem";
import { ShoppingSession } from "@/core/domain/entities/ShoppingSession";
import { StorageLocation } from "@/core/domain/entities/StorageLocation";
import { ExpirySafetyService } from "@/core/application/services/ExpirySafetyService";
import { EmojiMatcherService } from "@/core/application/services/EmojiMatcherService";

export class CompleteShoppingSession {
  constructor(
    private readonly shoppingListRepo: ShoppingListRepository,
    private readonly inventoryRepo: InventoryRepository
  ) { }

  async execute(userId: string): Promise<{ added: number }> {
    // 1. Obtenir tota la llista
    const allItems = await this.shoppingListRepo.findAll(userId);

    // 2. Filtrar només els marcats (Checked)
    const boughtItems = allItems.filter(item => item.props.isChecked);

    if (boughtItems.length === 0) {
      return { added: 0 };
    }

    // -----------------------------------------------------------------------
    // A) GUARDAR HISTORIAL (Aquí SÍ que guardem el snapshot complet)
    // -----------------------------------------------------------------------
    // Calculem el cost total basant-nos en el que tenim a la llista
    const totalCost = boughtItems.reduce((acc, item) => acc + (item.props.estimatedCost || 0) * item.props.quantity, 0);

    const session = new ShoppingSession({
      id: crypto.randomUUID(),
      userId,
      createdAt: new Date(),
      totalCost,
      itemCount: boughtItems.length,
      itemsSnapshot: boughtItems.map(i => ({
        name: i.props.name,
        quantity: i.props.quantity,
        unit: i.props.unit,
        emoji: i.props.emoji,
        estimatedCost: i.props.estimatedCost,
        productId: i.props.productId,
        // 🔥 AQUESTA ÉS LA LÍNIA QUE FALTAVA 🔥
        // Com que shopping_list_items ja té la imatge, la passem a l'historial
        productImage: i.props.productImage
      }))
    });

    await this.shoppingListRepo.saveSession(session);

    // -----------------------------------------------------------------------
    // B) MOURE A INVENTARI (Repliquem lògica addItemAction)
    // -----------------------------------------------------------------------
    const inventoryItems = boughtItems.map(item => {

      // 1. MILLORA D'EMOJI (Igual que a inventory.ts)
      let finalEmoji = item.props.emoji;
      // Si no té emoji, o és genèric, intentem millorar-lo
      if (!finalEmoji || finalEmoji === '📦' || finalEmoji === '🛒') {
        const better = EmojiMatcherService.getEmoji(item.props.name);
        if (better !== '📦') finalEmoji = better;
      }

      // 2. UBICACIÓ I CADUCITAT (Igual que a inventory.ts)
      // Assumim PANTRY per defecte si ve de la llista (o podries deduir-ho per tags)
      const location = StorageLocation.PANTRY;

      // 🔥 AQUI ESTÀ LA CLAU: Calculem la data segura
      // applySafetyRules retorna "YYYY-MM-DD"
      const safeDateYMD = ExpirySafetyService.applySafetyRules(item.props.name, location, undefined);
      const expiryDate = new Date(safeDateYMD);

      // 3. CREAR ENTITAT (Només amb productId, sense imatge)
      return InventoryItem.create({
        id: crypto.randomUUID(),
        userId: userId,
        name: item.props.name,
        quantity: item.props.quantity,
        unit: item.props.unit,
        location: location,
        emoji: finalEmoji || '📦',

        expiryDate: expiryDate, // ✅ Data calculada correctament
        addedAt: new Date(),

        productId: item.props.productId || null // ✅ Només passem l'ID
      });
    });

    // 4. Guardar a l'Inventari (Batch)
    await this.inventoryRepo.saveBatch(inventoryItems);

    // 5. Eliminar de la Llista de la Compra
    const idsToDelete = boughtItems.map(i => i.props.id);
    await this.shoppingListRepo.deleteMany(idsToDelete);

    return { added: inventoryItems.length };
  }
}
