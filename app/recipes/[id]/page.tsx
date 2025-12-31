import { notFound, redirect } from 'next/navigation';
import { container } from '@/services/container';
import { createClient } from '@/adapters/supabase/server';
import { RecipeDetailView } from '@/features/recipes/ui/RecipeDetailView';
import { BackButton } from '@/components/ui/BackButton';

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

  const getUserInventory = container.getGetUserInventory();
  const inventoryItems = await getUserInventory.execute(user.id);

  return (
    // FONS MÀGIC UNIFICAT
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-white pb-20">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            
            {/* HEADER DE NAVEGACIÓ */}
            <div className="mb-6 flex justify-between items-center">
                <BackButton href="/recipes" label="Tornar al receptari" className="bg-slate-900/50 backdrop-blur-md" />
            </div>

            <RecipeDetailView 
                recipe={recipe.props} 
                inventory={inventoryItems.map(i => i.props)} 
                userId={user.id} 
            />
        </div>
    </main>
  );
}