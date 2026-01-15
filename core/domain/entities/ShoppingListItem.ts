// ARXIU: core/domain/entities/ShoppingListItem.ts

export interface ShoppingListItemProps {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  isChecked: boolean;
  emoji?: string; // ✅ NOU
  productId?: string, // ✅ AFEGIT AL CONSTRUCTOR
  productImage?: string, // ✅ AFEGIT AL CONSTRUCTOR
  estimatedCost?: number // ✅ AFEGIT AL CONSTRUCTOR
}

export class ShoppingListItem {
  constructor(public readonly props: ShoppingListItemProps) { }

  // Factory per crear nous items nets
  static create(
    userId: string,
    name: string,
    quantity: number,
    unit: string,
    emoji?: string,
    isChecked: boolean = false,
    // ✅ NOUS PARÀMETRES
    productId?: string,
    productImage?: string,
    estimatedCost?: number
  ): ShoppingListItem {
    if (quantity <= 0) throw new Error("La quantitat ha de ser positiva");
    if (!name.trim()) throw new Error("El nom no pot estar buit");

    return new ShoppingListItem({
      id: crypto.randomUUID(), // Generació temporal d'ID si és nou
      userId,
      name,
      quantity,
      unit,
      isChecked,
      emoji,
      productId,
      productImage,
      estimatedCost
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