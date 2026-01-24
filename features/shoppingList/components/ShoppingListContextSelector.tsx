import { ScopeSelector } from '@/components/ScopeSelector';

interface Props {
  scope: string;
  setScope: (val: string) => void;
  rooms: { id: string; name: string }[];
}

export function ShoppingListContextSelector({ scope, setScope, rooms }: Props) {
  return (
    <ScopeSelector
      scope={scope}
      setScope={setScope}
      rooms={rooms}
      personalLabel="Compra Personal"
      testId="shopping-scope-select"
      className="shrink-0"
    />
  );
}
