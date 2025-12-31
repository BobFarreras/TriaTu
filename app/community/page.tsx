import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';
import { CreateRecipeForm } from '@/components/community/CreateRecipeForm';
import { StarRating } from '@/components/community/StarRating';
import { createClient } from '@/adapters/supabase/server';

// Forcem que la pàgina sigui dinàmica perquè veiem els nous vots al moment
export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  const repo = new SupabaseRecipeRepository();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Obtenir totes les receptes (o les 50 primeres)
  // En el futur afegirem paginació al search
  const recipes = await repo.search({});

  return (
    <main className="max-w-4xl mx-auto p-4 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Comunitat de Cuina 🍲</h1>
        <p className="text-gray-600">Comparteix, descobreix i valora les millors receptes.</p>
      </header>

      {/* Secció de creació */}
      <section>
        <CreateRecipeForm />
      </section>

      {/* Llista de receptes */}
      <section className="grid gap-6 md:grid-cols-2">
        {recipes.map(async (recipe) => {
          // Per cada recepta, mirem si l'usuari actual ja l'ha votat
          // (Això es podria optimitzar en SQL, però per MVP està bé)
          let userRating = 0;
          if (user) {
            const rating = await repo.getUserRatingForRecipe(user.id, recipe.id);
            if (rating) userRating = rating.value;
          }

          return (
            <article key={recipe.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{recipe.name}</h2>
                <div className="bg-gray-100 text-xs px-2 py-1 rounded">
                  {recipe.props.prepTimeMinutes || 15} min
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Publicat per: {recipe.authorId === user?.id ? 'Tu' : 'Anònim'}
              </p>

              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-sm">Ingredients principals:</h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.slice(0, 3).map((ing, i) => (
                    <span key={i} className="text-xs bg-orange-50 text-orange-800 px-2 py-1 rounded-full border border-orange-100">
                      {ing.name}
                    </span>
                  ))}
                  {recipe.ingredients.length > 3 && <span className="text-xs text-gray-500">+{recipe.ingredients.length - 3} més</span>}
                </div>
              </div>

              <div className="border-t pt-4 mt-4 flex justify-between items-center">
                 {/* Component Client Interactiu */}
                 <StarRating 
                    recipeId={recipe.id} 
                    average={recipe.ratingSummary.average} 
                    count={recipe.ratingSummary.count}
                    initialUserRating={userRating}
                 />
              </div>
            </article>
          );
        })}
      </section>
      
      {recipes.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Encara no hi ha receptes. Sigues el primer en publicar-ne una!
        </div>
      )}
    </main>
  );
}