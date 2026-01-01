import { createClient } from '@/adapters/supabase/server';
import { SearchRecipes } from '@/core/usecases/community/SearchRecipes';
import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';
import { RecipeFeed } from '@/components/recipes/RecipeFeed';
import { FilterBar } from '@/components/recipes/FilterBar';
import { BackButton } from '@/components/ui/BackButton';
import { CreateRecipeButton } from '@/components/recipes/CreateRecipeButton';
import { CommunityHeader } from '@/components/recipes/CommunityHeader'; // ✅ Import nou

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
  
  const ITEMS_PER_PAGE = 8;

  const tags: string[] = [];
  let maxTime: number | undefined = undefined;

  if (filterType === 'VEGGIE') tags.push('vegetarian');
  if (filterType === 'VEGAN') tags.push('vegan');
  if (filterType === 'GLUTEN_FREE') tags.push('gluten-free');
  if (filterType === 'DAIRY_FREE') tags.push('dairy-free');
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
      {/* HEADER: Ara utilitza el component Client per traduccions */}
      <div className="flex flex-row justify-between items-start mb-6 gap-4">
        <CommunityHeader /> 
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
      
      <CreateRecipeButton />
    </main>
  );
}