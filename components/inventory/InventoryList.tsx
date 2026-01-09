'use client';


import { useLanguage } from '@/lib/i18n/LanguageContext';
import { InventoryItemProps } from '@/core/domain/entities/InventoryItem';
import { InventoryItemCard } from './InventoryItemCard';




export function InventoryList({ items }: { items: InventoryItemProps[] }) {
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
        <p className="text-4xl mb-2 grayscale opacity-50">{t.inventory.list.empty_title}</p>
        <p className="text-slate-500 text-sm">{t.inventory.list.empty_text}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4">
      {items.map((item) => (
        <InventoryItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

