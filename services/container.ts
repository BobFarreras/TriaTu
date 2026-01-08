// src/services/container.ts
import { SupabaseClient } from '@supabase/supabase-js'; // ✅ Importem el tipus
// ADAPTERS - SUPABASE
import { SupabaseDecisionRepository } from '@/adapters/supabase/SupabaseDecisionRepository';
import { SupabaseDecisionRoomRepository } from '@/adapters/supabase/SupabaseDecisionRoomRepository';
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository';
import { SupabaseInventoryRepository } from '@/adapters/supabase/SupabaseInventoryRepository';

import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';

// ADAPTERS - AI
import { OpenAIImageRecognizer } from '@/adapters/openai/OpenAIImageRecognizer';
import { GeminiImageRecognizer } from '@/adapters/gemini/GeminiImageRecognizer';
import { FallbackImageRecognizer } from '@/adapters/strategies/FallbackImageRecognizer';
import { GeminiRecipeGenerator } from '@/adapters/gemini/GeminiRecipeGenerator';
import { OpenAIRecipeGenerator } from '@/adapters/openai/OpenAIRecipeGenerator';
import { FallbackRecipeGenerator } from '@/adapters/strategies/FallbackRecipeGenerator';

// DOMAIN SERVICES
import { BasicDecisionEngine } from '@/services/decision/BasicDecisionEngine';
import { BasicGroupResolver } from '@/services/decision/BasicGroupResolver';
import { FoodKnowledgeService } from '@/core/domain/services/FoodKnowledgeService';
import { RecipeMatcher } from '@/core/domain/services/RecipeMatcher';

// PORTS (Interfícies)
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';

import { RecipeRepository } from '@/core/ports/RecipeRepository';

// USE CASES - ROOMS & DECISIONS
import { MakeIndividualDecision } from '@/core/usecases/decision/MakeIndividualDecision';
import { CreateDecisionRoom } from '@/core/usecases/rooms/CreateDecisionRoom';
import { JoinDecisionRoom } from '@/core/usecases/rooms/JoinDecisionRoom';
import { MakeGroupDecision } from '@/core/usecases/rooms/MakeGroupDecision';
import { RemoveParticipant } from '@/core/usecases/rooms/RemoveParticipant';
import { ClearRoomHistory } from '@/core/usecases/rooms/ClearRoomHistory';
import { SetRoomVotingMode } from '@/core/usecases/rooms/SetRoomVotingMode';
import { GetUserRooms } from "@/core/usecases/rooms/GetUserRooms";

// USE CASES - CANDIDATES & PROFILE
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
import { CookRecipe } from '@/core/usecases/inventory/CookRecipe';
import { SuggestRecipes } from '@/core/usecases/inventory/SuggestRecipes';

// USE CASES - RECIPES
import { SaveGeneratedRecipe } from '@/core/usecases/recipes/SaveGeneratedRecipe';
import { GetRecipe } from '@/core/usecases/recipes/GetRecipe';
import { GetRandomInspiration } from '@/core/usecases/recipes/GetRandomInspiration'; // ✅ NOU
import { SupabaseRankingRepository } from '@/adapters/supabase/SupabaseRankingRepository';
import { SupabaseUserProfileRepository } from '@/adapters/supabase/SupabaseUserProfileRepository';
// --- INSTÀNCIES STATELESS (Singletons Implícits) ---
// Són classes que no guarden estat intern, per tant podem reutilitzar la mateixa instància sempre.
const decisionRepo = new SupabaseDecisionRepository();
const roomRepo = new SupabaseDecisionRoomRepository();

const foodKnowledgeService = new FoodKnowledgeService();
const individualEngine = new BasicDecisionEngine();
const groupResolver = new BasicGroupResolver(foodKnowledgeService);
const candidateRepo = new SupabaseCandidateRepository();
const inventoryRepo = new SupabaseInventoryRepository();
const recipeRepo = new SupabaseRecipeRepository();

// --- SCANNER SERVICES ---
const geminiAdapter = new GeminiImageRecognizer();
const openAIAdapter = new OpenAIImageRecognizer();
const robustRecognizer = new FallbackImageRecognizer(geminiAdapter, openAIAdapter);

// --- DOMAIN SERVICES ---
const recipeMatcher = new RecipeMatcher();


// ✅ CORRECCIÓ: Instanciem el repositori BO
const userProfileRepo = new SupabaseUserProfileRepository();
// --- LAZY SINGLETONS ---
// Inicialitzem sota demanda per estalviar recursos o evitar problemes d'ordre d'inicialització.
let recipeGeneratorInstance: RecipeGenerator | null = null;


export const container = {
  // === DECISION & ROOMS ===
  getMakeIndividualDecision: () => new MakeIndividualDecision(decisionRepo, userProfileRepo, individualEngine),
  getCreateDecisionRoom: () => new CreateDecisionRoom(roomRepo),
  getJoinDecisionRoom: () => new JoinDecisionRoom(roomRepo),
  getMakeGroupDecision: () => new MakeGroupDecision(roomRepo, userProfileRepo, candidateRepo, groupResolver),
  getRemoveParticipant: () => new RemoveParticipant(roomRepo),
  getClearRoomHistory: () => new ClearRoomHistory(roomRepo),
  getSetVotingMode: () => new SetRoomVotingMode(roomRepo),
  getUserRooms: () => new GetUserRooms(roomRepo),

  // === CANDIDATES & PROFILE ===
  getUpdateUserProfile: () => new UpdateUserProfile(userProfileRepo),
  getAddCandidate: () => new AddCandidate(candidateRepo),
  getRemoveCandidate: () => new RemoveCandidate(candidateRepo),

  // === INVENTORY ===
  getAddItem: () => new AddItem(inventoryRepo),
  getConsumeItem: () => new ConsumeItem(inventoryRepo),
  getGetExpiringItems: () => new GetExpiringItems(inventoryRepo),
  getGetUserInventory: () => new GetUserInventory(inventoryRepo),
  getUpdateItem: () => new UpdateItem(inventoryRepo),
  getDeleteItem: () => new DeleteItem(inventoryRepo),
  getImageRecognizer: () => robustRecognizer,
  getCookRecipe: () => new CookRecipe(inventoryRepo, recipeMatcher),

  // === RECIPES (GENERATOR) ===
  getRecipeGenerator: (): RecipeGenerator => {
    if (!recipeGeneratorInstance) {
      const gemini = new GeminiRecipeGenerator();
      const openai = new OpenAIRecipeGenerator();
      // Configuració Fallback: Gemini (Primari) -> OpenAI (Secundari)
      recipeGeneratorInstance = new FallbackRecipeGenerator(gemini, openai);
    }
    return recipeGeneratorInstance;
  },



  // === RECIPES (DATA & USE CASES) ===

  // ✅ 1. EXPOSAR EL REPOSITORI (Necessari per les Actions com getRandomRecipes)
  getRecipeRepository: (): RecipeRepository => recipeRepo,

  getSaveGeneratedRecipe: () => new SaveGeneratedRecipe(recipeRepo),

  getGetRecipe: () => new GetRecipe(recipeRepo),

  // ✅ 2. SUGGEST RECIPES (Mode Xef: Inventari + IA)
  getSuggestRecipes: () => {
    const generator = container.getRecipeGenerator();
    return new SuggestRecipes(
      inventoryRepo,
      recipeRepo,
      generator,
      recipeMatcher
    );
  },

  // ✅ 3. RANDOM INSPIRATION (Mode Destí: Aleatori + Al·lèrgies)
  getGetRandomInspiration: () => new GetRandomInspiration(recipeRepo),

  // Helper legacy (opcional, millor fer servir getGetRecipe)
  getRecipeById: () => ({
    execute: (id: string) => recipeRepo.findById(id)
  }),
  // ✅ Tipatge estricte: Ara sabem que supabaseClient ha de ser un client real
  getRankingRepository: (supabaseClient: SupabaseClient) => {
    return new SupabaseRankingRepository(supabaseClient);
  }
};