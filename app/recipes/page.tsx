import { createClient } from '@/adapters/supabase/server';
import { SearchRecipes } from '@/core/usecases/community/SearchRecipes';
import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';
import { RecipeFeed } from '@/components/recipes/RecipeFeed';
import { FilterBar } from '@/components/recipes/FilterBar';
import { BackButton } from '@/components/ui/BackButton';
import { CreateRecipeButton } from '@/components/recipes/CreateRecipeButton'; // ✅ IMPORT NOU
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CommunityPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const supabase = await createClient();
  const repo = new SupabaseRecipeRepository();
  const searchUseCase = new SearchRecipes(repo);

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const filterType = typeof searchParams.filter === 'string' ? searchParams.filter : 'ALL';
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;

  // ✅ CONFIGURACIÓ DE PAGINACIÓ
  const ITEMS_PER_PAGE = 8; // Canviat a 8 per optimitzar la graella (2x4 o 4x2)


  // --- 4. MAPEGAR FILTRES (Traducció URL -> Base de Dades) ---
  const tags: string[] = [];
  let maxTime: number | undefined = undefined;

  // ⚠️ ATENCIÓ: Aquests strings han de coincidir amb el que genera Gemini
  // Gemini sol generar tags en anglès tècnic (lowercase)

  if (filterType === 'VEGGIE') tags.push('vegetarian'); // O 'vegetarià' si li vas forçar català als tags
  if (filterType === 'VEGAN') tags.push('vegan');
  if (filterType === 'GLUTEN_FREE') tags.push('gluten-free');
  if (filterType === 'DAIRY_FREE') tags.push('dairy-free');

  // Postres sol ser un tag general, no dietary
  if (filterType === 'DESSERT') tags.push('postres', 'dolços');

  if (filterType === 'FAST') maxTime = 20;

  const { recipes, total } = await searchUseCase.execute({
    searchTerm: query,
    tags: tags,
    maxTimeMinutes: maxTime,
    limit: ITEMS_PER_PAGE,
    offset: (page - 1) * ITEMS_PER_PAGE
  });

  const plainRecipes = recipes.map(recipe => recipe.toPrimitives());

  let userRatings: Record<string, number> = {};
  if (userId && recipes.length > 0) {
    const recipeIds = recipes.map(r => r.id);
    userRatings = await repo.getUserRatingsMap(userId, recipeIds);
  }
  return (
    <main className="container mx-auto px-4 py-6">

      {/* HEADER: Flex Row per alinear Títol i Botó */}
      <div className="flex flex-row justify-between items-start mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Comunitat <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">Foodie</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
            Explora què cuina la gent.
          </p>
        </div>

        {/* El botó ara s'adapta sol */}
        <BackButton />
      </div>

      <FilterBar currentFilter={filterType} currentSearch={query} />

      <div className="mt-6">
        <RecipeFeed
          recipes={plainRecipes}
          userId={userId}
          userRatings={userRatings}
          totalPages={Math.ceil(total / ITEMS_PER_PAGE)}
          currentPage={page}
        />
      </div>
      {/* ✅ AFEGIM EL BOTÓ FLOTANT AQUÍ AL FINAL */}
      <CreateRecipeButton />
    </main>
  );
}