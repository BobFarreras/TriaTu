'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export function CommunityHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex-1">
      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
        {t.community.title} <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">{t.community.title_suffix}</span>
      </h1>
     
    </div>
  );
}