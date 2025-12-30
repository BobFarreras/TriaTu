import { StorageLocation } from './StorageLocation';

export interface InventoryItemProps {
  id: string;
  userId: string;
  name: string;
  emoji?: string;
  quantity: number;
  unit: string;
  location: StorageLocation;
  expiryDate?: Date;
  addedAt: Date;
}

export class InventoryItem {
  public readonly props: InventoryItemProps;

  private constructor(props: InventoryItemProps) {
    this.validate(props);
    this.props = props;
  }

  public static create(props: InventoryItemProps): InventoryItem {
    return new InventoryItem(props);
  }

  // ✅ SOLUCIÓ: GETTERS PER EXPOSAR LES PROPS
  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get quantity(): number { return this.props.quantity; }
  get unit(): string { return this.props.unit; }
  get emoji(): string { return this.props.emoji || '📦'; } 

  private validate(props: InventoryItemProps): void {
    if (props.quantity < 0) {
      throw new Error('Invariant Error: La quantitat no pot ser negativa');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Invariant Error: El nom no pot estar buit');
    }
  }

  public isExpired(): boolean {
    if (!this.props.expiryDate) return false;
    const today = new Date();
    return this.props.expiryDate < today;
  }

  public isExpiringSoon(daysThreshold: number = 3): boolean {
    if (!this.props.expiryDate) return false;
    if (this.isExpired()) return false;
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);
    return this.props.expiryDate <= thresholdDate;
  }

  public updateQuantity(newQuantity: number): InventoryItem {
    return new InventoryItem({
      ...this.props,
      quantity: newQuantity
    });
  }
}