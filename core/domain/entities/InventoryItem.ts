// ARXIU: core/domain/entities/InventoryItem.ts

import { StorageLocation } from './StorageLocation';

export interface InventoryItemProps {
  id: string;
  userId: string;
  name: string;
  emoji?: string; // ✅ AFEGIT: Opcional, perquè potser no en té
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
    // Validació de quantitat (recorda: permetem 0, però no negatius)
    if (props.quantity < 0) {
      throw new Error("La quantitat no pot ser negativa");
    }
    if (!props.name || props.name.trim().length === 0) {
        throw new Error("El nom de l'article no pot estar buit");
    }
    return new InventoryItem(props);
  }

  public updateQuantity(newQuantity: number): InventoryItem {
    return InventoryItem.create({
      ...this.props, // Això manté l'emoji si existeix
      quantity: newQuantity
    });
  }

  // Getters
  get id() { return this.props.id; }
  get userId() { return this.props.userId; }
  get name() { return this.props.name; }
  get emoji() { return this.props.emoji; } // ✅ AFEGIT GETTER
  get quantity() { return this.props.quantity; }
  get unit() { return this.props.unit; }
  get location() { return this.props.location; }
  get expiryDate() { return this.props.expiryDate; }
  get addedAt() { return this.props.addedAt; }

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