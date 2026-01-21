import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { RecipeEditor } from '@/features/recipes/components/editor/RecipeEditor';
import { redirect, notFound } from 'next/navigation';
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { InventoryItemUI } from '@/features/recipes/components/editor/types';
import { Recipe } from '@/core/domain/entities/Recipe';
import { InventoryItem } from '@/core/domain/entities/InventoryItem';

// ✅ 1. CORRECCIÓ DE TIPUS: params és una Promise
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditRecipePage({ params }: PageProps) {
  // ✅ 2. CORRECCIÓ CLAU: Fem 'await' abans de llegir l'ID
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // 1. Carreguem la Recepta
  const getRecipe = container.getGetRecipe();
  const recipe = (await getRecipe.execute(id)) as Recipe | null;

  if (!recipe) notFound();

  // 2. Seguretat: Només l'autor pot editar
  if (recipe.authorId !== user.id) {
      redirect(`/recipes/${id}`); 
  }

  // 3. Carreguem l'Inventari (per l'editor)
  const getUserInventory = container.getGetUserInventory(supabase);
  const inventoryEntities = (await getUserInventory.execute(user.id)) as InventoryItem[];
  
  const plainInventory: InventoryItemUI[] = inventoryEntities.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    emoji: item.emoji || undefined
  }));

  return (
    <OnboardingProvider>
      <div className="h-dvh overflow-hidden flex flex-col">
        {/* Passem la recepta existent com a punt de partida */}
        <RecipeEditor 
            userInventory={plainInventory} 
            initialRecipe={recipe.props} 
        />
      </div>
    </OnboardingProvider>
  );
}
