// src/domain/inventory/InventoryItem.ts

import { StorageLocation } from '../inventory/StorageLocation';

export interface InventoryItemProps {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string; // ex: 'unitats', 'kg', 'litres'
  location: StorageLocation;
  expiryDate?: Date; // Opcional, algunes coses no caduquen ràpid (sal, sucre)
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

  private validate(props: InventoryItemProps): void {
    if (props.quantity <= 0) {
      throw new Error('Invariant Error: La quantitat ha de ser positiva');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Invariant Error: El nom no pot estar buit');
    }
  }

  // Lògica de Domini: Comprovació de caducitat
  public isExpired(): boolean {
    if (!this.props.expiryDate) return false;
    const today = new Date();
    return this.props.expiryDate < today;
  }

  // Lògica de Domini: Avisos de caducitat pròxima
  public isExpiringSoon(daysThreshold: number = 3): boolean {
    if (!this.props.expiryDate) return false;
    if (this.isExpired()) return false; // Si ja està caducat, no està "a punt"

    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);

    return this.props.expiryDate <= thresholdDate;
  }

  // Mètodes per modificar l'estat de manera controlada
  public updateQuantity(newQuantity: number): InventoryItem {
    return new InventoryItem({
      ...this.props,
      quantity: newQuantity
    });
  }
}