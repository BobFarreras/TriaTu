// app/(dashboard)/recipes/not-found.tsx
import { NotFoundState } from '@/components/ui/states/NotFoundState';

export default function RecipeNotFound() {
  return (
    <NotFoundState 
        icon="👨‍🍳"
        title="Recepta no trobada"
        description="El xef no troba aquesta fitxa. És possible que l'hagis esborrat o l'enllaç estigui trencat."
        actionHref="/recipes"
        actionLabel="Veure Llibre de Receptes"
    />
  );
}