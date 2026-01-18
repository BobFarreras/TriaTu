import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

export type GenerationMode = 'CHEF' | 'FATE';

export interface GenerationContext {
  mode: GenerationMode;
  inventory: InventoryItemProps[];
  restrictions: DietaryRestriction[];
  
  // Opcions de perfil
  dislikes: string[]; 
  energyLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  timeAvailableMinutes?: number;
  
  // Configuració de la peticiósi
  focusDish?: string; 
  count: number;
  language: string;
  vibe: string;

  
}