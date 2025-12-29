import { Recipe } from '../entities/Recipe';
import { InventoryItemProps } from '../entities/InventoryItem';

export interface MissingIngredient {
    name: string;
    needed: number;
    available: number;
    missingQuantity: number;
    unit: string;
}

export interface MatchResult {
    isPossible: boolean;
    missingIngredients: MissingIngredient[];
    usedItems: { inventoryId: string; amountToConsume: number }[];
}

export class RecipeMatcher {

    match(recipe: Recipe, inventory: InventoryItemProps[]): MatchResult {
        const missingIngredients: MissingIngredient[] = [];
        const usedItems: { inventoryId: string; amountToConsume: number }[] = [];

        // ✅ CORRECCIÓN: Accedemos a recipe.props.ingredients
        for (const reqIngredient of recipe.props.ingredients) { 
            const reqName = this.normalize(reqIngredient.name);

            // 1. Filtrar candidats
            const stockItems = inventory.filter(item =>
                this.normalize(item.name).includes(reqName) ||
                reqName.includes(this.normalize(item.name))
            );

            // 2. Ordenar FIFO (Caducitat primer, sinó data de creació)
            stockItems.sort((a, b) => {
                const dateA = a.expiryDate ? new Date(a.expiryDate).getTime() : Number.MAX_SAFE_INTEGER;
                const dateB = b.expiryDate ? new Date(b.expiryDate).getTime() : Number.MAX_SAFE_INTEGER;
                return dateA - dateB;
            });

            const totalAvailable = stockItems.reduce((sum, item) => sum + item.quantity, 0);

            // 3. Comprovar quantitats
            if (totalAvailable < reqIngredient.quantity) {
                missingIngredients.push({
                    name: reqIngredient.name,
                    needed: Number(reqIngredient.quantity),
                    available: totalAvailable,
                    missingQuantity: Number(reqIngredient.quantity) - totalAvailable,
                    unit: reqIngredient.unit
                });
            } else {
                // 4. Calcular consum (FIFO)
                let remainingNeeded = Number(reqIngredient.quantity);

                for (const stockItem of stockItems) {
                    if (remainingNeeded <= 0) break;

                    const take = Math.min(stockItem.quantity, remainingNeeded);

                    // Validació: Només agafem items que tinguin ID real (persits)
                    if (stockItem.id) {
                        usedItems.push({
                            inventoryId: stockItem.id,
                            amountToConsume: take
                        });
                    }
                    remainingNeeded -= take;
                }
            }
        }

        return {
            isPossible: missingIngredients.length === 0,
            missingIngredients,
            usedItems
        };
    }

    private normalize(str: string): string {
        return str.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .trim();
    }
}