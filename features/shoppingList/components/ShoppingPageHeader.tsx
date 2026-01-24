'use client';

import { BackButton } from '@/components/ui/BackButton';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function ShoppingPageHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-6">
      <BackButton />
      <h1 className="text-2xl font-bold flex items-center gap-2">
        📝 {t.shoppingList.page_title}
      </h1>
    </div>
  );
}
