import { ScopeSelector } from '@/components/ScopeSelector';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  scope: string;
  setScope: (val: string) => void;
  rooms: { id: string; name: string }[];
}

export function ShoppingListContextSelector({ scope, setScope, rooms }: Props) {
  const { t } = useLanguage();

  return (
    <ScopeSelector
      scope={scope}
      setScope={setScope}
      rooms={rooms}
      personalLabel={t.shoppingList.personal_scope}
      sharedLabel={t.shoppingList.shared_scope}
      testId="shopping-scope-select"
      className="shrink-0"
    />
  );
}
