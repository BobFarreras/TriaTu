import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export interface RecipeGenerator {
  generate(
    inventory: InventoryItemProps[], 
    restrictions: DietaryRestriction[],
    focusDish?: string // <--- NOU PARÀMETRE OPCIONAL
  ): Promise<Recipe[]>;
}