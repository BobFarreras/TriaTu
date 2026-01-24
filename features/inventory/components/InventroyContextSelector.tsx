import { ScopeSelector } from '@/components/ScopeSelector';

interface Props {
  scope: string;
  setScope: (val: string) => void;
  rooms: { id: string; name: string }[];
}

export function InventoryContextSelector({ scope, setScope, rooms }: Props) {
  return (
    <ScopeSelector
      scope={scope}
      setScope={setScope}
      rooms={rooms}
      personalLabel="Inventari Personal"
      testId="inventory-scope-select"
    />
  );
}
