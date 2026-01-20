import { createClient } from '@/adapters/supabase/server';
import { SearchRecipes } from '@/core/usecases/community/SearchRecipes';
import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';
import { RecipeFeed } from '@/features/recipes/components/RecipeFeed';
import { FilterBar } from '@/features/recipes/components/FilterBar';
import { BackButton } from '@/components/ui/BackButton';
import { CreateRecipeButton } from '@/features/recipes/components/CreateRecipeButton';
import { CommunityHeader } from '@/features/recipes/components/CommunityHeader';

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

  const mode = typeof searchParams.mode === 'string' ? searchParams.mode : 'ALL';
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const filterType = typeof searchParams.filter === 'string' ? searchParams.filter : 'ALL';
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const ITEMS_PER_PAGE = 8;

  // --- LÒGICA DE FILTRES ---
  const tags: string[] = [];
  let maxTime: number | undefined = undefined;

  // ⚠️ IMPORTANT: Assegura't que aquests strings són els mateixos que es guarden quan crees una recepta
  if (filterType === 'VEGGIE') tags.push('vegetarià');
  if (filterType === 'VEGAN') tags.push('vegà');
  if (filterType === 'GLUTEN_FREE') tags.push('sense gluten');
  if (filterType === 'DAIRY_FREE') tags.push('sense lactosa');
  if (filterType === 'DESSERT') tags.push('postres');

  if (filterType === 'FAST') maxTime = 20;

  // --- EXECUCIÓ ---
  const { recipes, total } = await searchUseCase.execute({
    searchTerm: query,
    tags: tags,
    maxTimeMinutes: maxTime,
    limit: ITEMS_PER_PAGE,
    offset: (page - 1) * ITEMS_PER_PAGE,
    userId: userId,
    filterMode: mode as 'ALL' | 'MINE' | 'FAVORITES'
  });

  const plainRecipes = recipes.map(recipe => recipe.toPrimitives());

  // Recollir ratings si cal
  let userRatings: Record<string, number> = {};
  if (userId && recipes.length > 0) {
    const recipeIds = recipes.map(r => r.id);
    userRatings = await repo.getUserRatingsMap(userId, recipeIds);
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-row justify-between items-start mb-6 gap-4">
        <BackButton />
        <CommunityHeader />

      </div>

      <FilterBar
        currentFilter={filterType}
        currentSearch={query}
        currentMode={mode}
      />

      <div className="mt-6">
        <RecipeFeed
          recipes={plainRecipes}
          userId={userId}
          userRatings={userRatings}
          totalPages={Math.ceil(total / ITEMS_PER_PAGE)}
          currentPage={page}
        />
      </div>

      <CreateRecipeButton />
    </main>
  );
}
