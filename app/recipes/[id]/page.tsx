import { notFound, redirect } from 'next/navigation';
import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { RecipeDetailView } from '@/features/recipes/ui/RecipeDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 1. Obtenim la Recepta
  const getRecipe = container.getGetRecipe();
  const recipe = await getRecipe.execute(id);

  if (!recipe) notFound();

  // 2. Obtenim l'Inventari (NOU)
  const getUserInventory = container.getGetUserInventory();
  const inventoryItems = await getUserInventory.execute(user.id);

  // 3. Passem tot a la vista
  return (
    <main className="min-h-screen bg-[#131f24] p-4 md:p-6 flex justify-center">
        <RecipeDetailView 
            recipe={recipe.props} 
            inventory={inventoryItems.map(i => i.props)} // Passem props planes
            userId={user.id} 
        />
    </main>
  );
}