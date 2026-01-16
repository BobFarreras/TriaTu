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

  const getRecipe = container.getGetRecipe(); 
  const recipe = await getRecipe.execute(id);

  if (!recipe) notFound();

  const getUserInventory = container.getGetUserInventory(supabase);
  const inventoryItems = await getUserInventory.execute(user.id);

  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-white">
        <RecipeDetailView 
            recipe={recipe.props} 
            inventory={inventoryItems.map(i => i.props)} 
            userId={user.id} 
        />
    </main>
  );
}