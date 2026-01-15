// app/(dashboard)/inventory/not-found.tsx
import { NotFoundState } from '@/components/ui/states/NotFoundState';

export default function InventoryNotFound() {
  return (
    <NotFoundState 
        icon="🥕"
        title="Producte Desaparegut"
        description="No trobem aquest producte al teu inventari. Potser ja te l'has menjat o ha caducat?"
        actionHref="/inventory"
        actionLabel="Tornar a l'Inventari"
    />
  );
}