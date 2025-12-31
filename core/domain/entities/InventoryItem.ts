import { StorageLocation } from './StorageLocation'; // Assegura't que la ruta és correcta segons la teva estructura

export interface InventoryItemProps {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  location: StorageLocation;
  expiryDate?: Date;
  addedAt: Date;
}

export class InventoryItem {
  public readonly props: InventoryItemProps;

  private constructor(props: InventoryItemProps) {
    this.props = props;
  }

  public static create(props: InventoryItemProps): InventoryItem {
    if (props.quantity <= 0) {
      throw new Error("La quantitat ha de ser positiva");
    }
    if (!props.name || props.name.trim().length === 0) {
        throw new Error("El nom de l'article no pot estar buit");
    }
    return new InventoryItem(props);
  }

  // ✅ MÈTODE QUE FALTAVA
  public updateQuantity(newQuantity: number): InventoryItem {
    // Reutilitzem el mètode create per mantenir les validacions (ex: no permetre negatius)
    return InventoryItem.create({
      ...this.props,
      quantity: newQuantity
    });
  }

  // Getters
  get id() { return this.props.id; }
  get quantity() { return this.props.quantity; }
  get name() { return this.props.name; }
  get userId() { return this.props.userId; }

  // Lògica de domini
  public isExpired(): boolean {
    if (!this.props.expiryDate) return false;
    return this.props.expiryDate < new Date();
  }

  public isExpiringSoon(days: number): boolean {
    if (!this.props.expiryDate) return false;
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + days);
    return this.props.expiryDate <= targetDate && this.props.expiryDate >= today;
  }
}