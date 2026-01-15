// app/not-found.tsx
import { NotFoundState } from '@/components/ui/states/NotFoundState';

export default function GlobalNotFound() {
  return (
    <NotFoundState 
        icon="🛸"
        title="Pàgina no trobada"
        description="Sembla que t'has perdut a l'espai. La pàgina que busques no existeix o ha estat moguda."
        actionLabel="Tornar al Dashboard"
    />
  );
}