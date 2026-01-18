import { SupabaseClient } from '@supabase/supabase-js';

// ADAPTERS - SUPABASE
import { SupabaseDecisionRepository } from '@/adapters/supabase/SupabaseDecisionRepository';
import { SupabaseDecisionRoomRepository } from '@/adapters/supabase/SupabaseDecisionRoomRepository';
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository';
import { SupabaseInventoryRepository } from '@/adapters/supabase/SupabaseInventoryRepository';
import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';
import { SupabaseRankingRepository } from '@/adapters/supabase/SupabaseRankingRepository';
import { SupabaseUserProfileRepository } from '@/adapters/supabase/SupabaseUserProfileRepository';
import { SupabaseShoppingListRepository } from '@/adapters/supabase/SupabaseShoppingListRepository';
import { SupabaseProductCatalogRepository } from '@/adapters/supabase/SupabaseProductCatalogRepository';

// ADAPTERS - EXTERNAL (AI & SCRAPERS)
import { OpenAIImageRecognizer } from '@/adapters/openai/OpenAIImageRecognizer';
import { GeminiImageRecognizer } from '@/adapters/gemini/GeminiImageRecognizer';
import { FallbackImageRecognizer } from '@/adapters/strategies/FallbackImageRecognizer';
import { GeminiRecipeGenerator } from '@/adapters/gemini/GeminiRecipeGenerator';
import { OpenAIRecipeGenerator } from '@/adapters/openai/OpenAIRecipeGenerator';
import { FallbackRecipeGenerator } from '@/adapters/strategies/FallbackRecipeGenerator';
import { BonpreuAdapter } from '@/adapters/external/BonpreuAdapter';

// DOMAIN SERVICES
import { BasicDecisionEngine } from '@/services/decision/BasicDecisionEngine';
import { BasicGroupResolver } from '@/services/decision/BasicGroupResolver';
import { FoodKnowledgeService } from '@/core/domain/services/FoodKnowledgeService';
import { RecipeMatcher } from '@/core/domain/services/RecipeMatcher';

// ✅ NOU SERVICE HÍBRID
import { GenerateMenuService } from '@/core//services/GenerateMenuService';

// PORTS
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
import { RecipeRepository } from '@/core/ports/RecipeRepository';
import { DeleteRecipe } from '@/core/usecases/recipes/DeleteRecipe';
// USE CASES - DECISION & ROOMS
import { MakeIndividualDecision } from '@/core/usecases/decision/MakeIndividualDecision';
import { CreateDecisionRoom } from '@/core/usecases/rooms/CreateDecisionRoom';
import { JoinDecisionRoom } from '@/core/usecases/rooms/JoinDecisionRoom';
import { MakeGroupDecision } from '@/core/usecases/rooms/MakeGroupDecision';
import { RemoveParticipant } from '@/core/usecases/rooms/RemoveParticipant';
import { ClearRoomHistory } from '@/core/usecases/rooms/ClearRoomHistory';
import { SetRoomVotingMode } from '@/core/usecases/rooms/SetRoomVotingMode';
import { GetUserRooms } from "@/core/usecases/rooms/GetUserRooms";
import { UpdateUserProfile } from '@/core/usecases/profile/UpdateUserProfile';
import { AddCandidate } from '@/core/usecases/candidates/AddCandidate';
import { RemoveCandidate } from '@/core/usecases/candidates/RemoveCandidate';

// USE CASES - INVENTORY
import { AddItem } from '@/core/usecases/inventory/AddItem';
import { ConsumeItem } from '@/core/usecases/inventory/ConsumeItem';
import { GetExpiringItems } from '@/core/usecases/inventory/GetExpiringItems';
import { GetUserInventory } from '@/core/usecases/inventory/GetUserInventory';
import { UpdateItem } from '@/core/usecases/inventory/UpdateItem';
import { DeleteItem } from '@/core/usecases/inventory/DeleteItem';

import { SearchAndCacheProducts } from '@/core/usecases/inventory/SearchAndCacheProducts';

// USE CASES - RECIPES
import { GetRecipe } from '@/core/usecases/recipes/GetRecipe';
import { GetRandomInspiration } from '@/core/usecases/recipes/GetRandomInspiration';

// USE CASES - SHOPPING
import { AddToShoppingList } from '@/core/usecases/shopping-list/AddToShoppingList';
import { GetShoppingList } from '@/core/usecases/shopping-list/GetShoppingList';
import { CompleteShoppingSession } from '@/core/usecases/shopping-list/CompleteShoppingSession';
import { GetShoppingHistory } from '@/core/application/shopping-list/GetShoppingHistory';


// --- INSTÀNCIES STATELESS (PODEN SER GLOBALS) ---
const foodKnowledgeService = new FoodKnowledgeService();
const individualEngine = new BasicDecisionEngine();
const groupResolver = new BasicGroupResolver(foodKnowledgeService);

const geminiAdapter = new GeminiImageRecognizer();
const openAIAdapter = new OpenAIImageRecognizer();
const robustRecognizer = new FallbackImageRecognizer(geminiAdapter, openAIAdapter);

const bonpreuAdapter = new BonpreuAdapter();

// Lazy Singleton per al generador de receptes (AI)
let recipeGeneratorInstance: RecipeGenerator | null = null;
const getRecipeGenerator = (): RecipeGenerator => {
  if (!recipeGeneratorInstance) {
    const gemini = new GeminiRecipeGenerator();
    const openai = new OpenAIRecipeGenerator();
    recipeGeneratorInstance = new FallbackRecipeGenerator(gemini, openai);
  }
  return recipeGeneratorInstance;
};

// Repositoris que no depenen del client
const decisionRepo = new SupabaseDecisionRepository();
const roomRepo = new SupabaseDecisionRoomRepository();
const candidateRepo = new SupabaseCandidateRepository();
const recipeRepo = new SupabaseRecipeRepository();
const userProfileRepo = new SupabaseUserProfileRepository();

export const container = {
  // === INVENTORY ===
  getAddItem: (client: SupabaseClient) =>
    new AddItem(new SupabaseInventoryRepository(client)),

  getConsumeItem: (client: SupabaseClient) =>
    new ConsumeItem(new SupabaseInventoryRepository(client)),

  getGetExpiringItems: (client: SupabaseClient) =>
    new GetExpiringItems(new SupabaseInventoryRepository(client)),

  getGetUserInventory: (client: SupabaseClient) =>
    new GetUserInventory(new SupabaseInventoryRepository(client)),

  getUpdateItem: (client: SupabaseClient) =>
    new UpdateItem(new SupabaseInventoryRepository(client)),

  getDeleteItem: (client: SupabaseClient) =>
    new DeleteItem(new SupabaseInventoryRepository(client)),



  getInventoryRepo: (client: SupabaseClient) =>
    new SupabaseInventoryRepository(client),

  getSearchAndCacheProducts: (client: SupabaseClient) =>
    new SearchAndCacheProducts(
      bonpreuAdapter,
      new SupabaseProductCatalogRepository(client)
    ),

  // === AI & TOOLS ===
  getImageRecognizer: () => robustRecognizer,


  // === DECISIONS ===
  getMakeIndividualDecision: () => new MakeIndividualDecision(decisionRepo, userProfileRepo, individualEngine),
  getCreateDecisionRoom: () => new CreateDecisionRoom(roomRepo),
  getJoinDecisionRoom: () => new JoinDecisionRoom(roomRepo),
  getMakeGroupDecision: () => new MakeGroupDecision(roomRepo, userProfileRepo, candidateRepo, groupResolver),
  getRemoveParticipant: () => new RemoveParticipant(roomRepo),
  getClearRoomHistory: () => new ClearRoomHistory(roomRepo),
  getSetVotingMode: () => new SetRoomVotingMode(roomRepo),
  getUserRooms: () => new GetUserRooms(roomRepo),
  getUpdateUserProfile: () => new UpdateUserProfile(userProfileRepo),
  getAddCandidate: () => new AddCandidate(candidateRepo),
  getRemoveCandidate: () => new RemoveCandidate(candidateRepo),

  // === RECIPES & GENERATION ===
  getRecipeRepository: (): RecipeRepository => recipeRepo,

  // ✅ NOU: El servei estrella d'avui (Híbrid)
  getGenerateMenuService: (client: SupabaseClient) =>
    new GenerateMenuService(
      new SupabaseInventoryRepository(client),
      recipeRepo,
      getRecipeGenerator()
    ),

  getGetRecipe: () => new GetRecipe(recipeRepo),
  getGetRandomInspiration: () => new GetRandomInspiration(recipeRepo),
  getRecipeById: () => ({ execute: (id: string) => recipeRepo.findById(id) }),
  getRankingRepository: (client: SupabaseClient) => new SupabaseRankingRepository(client),

  // === SHOPPING LIST ===
  getAddToShoppingList: (client: SupabaseClient) =>
    new AddToShoppingList(new SupabaseShoppingListRepository(client)),

  getGetShoppingList: (client: SupabaseClient) =>
    new GetShoppingList(new SupabaseShoppingListRepository(client)),

  getGetShoppingHistory: (client: SupabaseClient) =>
    new GetShoppingHistory(new SupabaseShoppingListRepository(client)),

  getCompleteShoppingSession: (client: SupabaseClient) =>
    new CompleteShoppingSession(
      new SupabaseShoppingListRepository(client),
      new SupabaseInventoryRepository(client)
    ),

  getShoppingListRepo: (client: SupabaseClient) =>
    new SupabaseShoppingListRepository(client),

  // ✅ CORRECCIÓ: Tipem el paràmetre explícitament
  getDeleteRecipe() {
    const repo = new SupabaseRecipeRepository();
    return new DeleteRecipe(repo);
  },
  // ✅ NOU MÈTODE NECESSARI
  // ✅ CORRECCIÓ: Retornem el FallbackRecipeGenerator, no només Gemini
  // ✅ CORRECCIÓ FINAL: Sense arguments als constructors
  getRecipeGenerator() {
    // 1. Instanciem els motors directament (sense repo, ja que l'inventari ve pel Context)
    const primary = new GeminiRecipeGenerator();
    const secondary = new OpenAIRecipeGenerator();

    // 2. Retornem l'estratègia robusta amb Fallback
    console.log("🛡️ [Container] Inicialitzant Generador amb Fallback (Gemini -> OpenAI)");
    return new FallbackRecipeGenerator(primary, secondary);
  }
}