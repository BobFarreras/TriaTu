'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export function SocialHeader() {
  const { t } = useLanguage();

  return (
    <h1 className="text-2xl font-black text-white tracking-tight leading-none">
        {t.social.title}
    </h1>
  );
}