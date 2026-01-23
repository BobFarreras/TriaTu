// features/rooms/components/drawer/FeaturesSection.tsx
import { Package, ShoppingCart } from 'lucide-react';
import { DrawerTranslations } from './types';
import { FeatureToggleCard } from './FeatureToggleCard';

interface Props {
  txt: DrawerTranslations;
  features: { inventory: boolean; shoppingList: boolean };
  onToggle: (setting: 'enableInventory' | 'enableShoppingList', value: boolean) => void;
  isPending: boolean;
}

export function FeaturesSection({ txt, features, onToggle, isPending }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
        {txt.features_title}
      </p>
      
      <FeatureToggleCard 
        icon={<Package size={20} className="text-orange-400"/>}
        label={txt.enable_inventory}
        description="Gestiona els productes"
        isActive={features.inventory}
        onClick={() => onToggle('enableInventory', !features.inventory)}
        disabled={isPending}
        activeColor="bg-orange-500"
      />
      
      <FeatureToggleCard 
        icon={<ShoppingCart size={20} className="text-blue-400"/>}
        label={txt.enable_shopping}
        description="Llista compartida"
        isActive={features.shoppingList}
        onClick={() => onToggle('enableShoppingList', !features.shoppingList)}
        disabled={isPending}
        activeColor="bg-blue-500"
      />
    </div>
  );
}