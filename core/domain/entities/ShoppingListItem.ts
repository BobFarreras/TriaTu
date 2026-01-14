// ARXIU: core/domain/entities/ShoppingListItem.ts

export interface ShoppingListItemProps {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  isChecked: boolean;
  emoji?: string; // ✅ NOU
}

export class ShoppingListItem {
  constructor(public readonly props: ShoppingListItemProps) { }

  // Factory per crear nous items nets
  public static create(userId: string, name: string, quantity: number, unit: string, emoji?: string): ShoppingListItem {
    if (quantity <= 0) throw new Error("La quantitat ha de ser positiva");
    if (!name.trim()) throw new Error("El nom no pot estar buit");

    return new ShoppingListItem({
      id: crypto.randomUUID(), // Generació temporal d'ID si és nou
      userId,
      name,
      quantity,
      unit,
      isChecked: false,
      emoji: emoji || '📦' // ✅ Default si no en té
    });
  }

  public check(): void {
    this.props.isChecked = true;
  }

  public uncheck(): void {
    this.props.isChecked = false;
  }

  public addQuantity(amount: number): void {
    this.props.quantity += amount;
  }
}