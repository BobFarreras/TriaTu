import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';

export function isItemExpired(item: InventoryItemProps): boolean {
  if (!item.expiryDate) return false;
  
  const today = new Date();
  const expiry = new Date(item.expiryDate); // Això gestiona Strings i Dates automàticament
  
  // Reset d'hores per comparar només dies
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  return expiry < today;
}

export function isItemExpiringSoon(item: InventoryItemProps, daysThreshold: number = 3): boolean {
  if (!item.expiryDate) return false;
  
  // Si ja està caducat, no és "aviat", és "ja" (opcional: pots voler que surti igualment)
  if (isItemExpired(item)) return true; // Canvi: Si està caducat, també el volem veure a la llista d'urgents!

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thresholdDate = new Date(today);
  thresholdDate.setDate(today.getDate() + daysThreshold);
  
  const expiry = new Date(item.expiryDate);
  expiry.setHours(0, 0, 0, 0);

  // És aviat si la data de caducitat és menor o igual al llindar
  return expiry <= thresholdDate;
}