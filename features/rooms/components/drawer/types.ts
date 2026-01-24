// features/rooms/components/drawer/types.ts
import { ReactNode } from "react";

// Tipatge estricte per evitar 'any'
export interface DrawerTranslations {
  settings: string;
  features_title: string;
  enable_inventory: string;
  enable_shopping: string;
  room_id_title: string;
  room_id_label: string;
  copy_room_id: string;
  actions_title: string;
  invite_cta: string;
  delete_room: string;
  delete_confirm_msg: string;
  deleting: string;
}

export interface FeatureToggleCardProps {
  icon: ReactNode;
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
  activeColor: string;
  testId?: string;
}
