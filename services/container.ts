// services/container.ts

import { SupabaseDecisionRepository } from '@/adapters/supabase/SupabaseDecisionRepository';
import { SupabaseDecisionRoomRepository } from '@/adapters/supabase/SupabaseDecisionRoomRepository';
import { SupabasePreferenceRepository } from '@/adapters/supabase/SupabasePreferenceRepository';
import { BasicDecisionEngine } from '@/services/decision/BasicDecisionEngine';
import { BasicGroupResolver } from '@/services/decision/BasicGroupResolver';
import { RemoveParticipant } from '@/core/usecases/rooms/RemoveParticipant';
import { ClearRoomHistory } from '@/core/usecases/rooms/ClearRoomHistory';
import { MakeIndividualDecision } from '@/core/usecases/decision/MakeIndividualDecision';
import { CreateDecisionRoom } from '@/core/usecases/rooms/CreateDecisionRoom';
import { JoinDecisionRoom } from '@/core/usecases/rooms/JoinDecisionRoom';
import { MakeGroupDecision } from '@/core/usecases/rooms/MakeGroupDecision';
import { UpdateUserProfile } from '@/core/usecases/profile/UpdateUserProfile';
import { FoodKnowledgeService } from '@/core/domain/services/FoodKnowledgeService';
import { SupabaseCandidateRepository } from '@/adapters/supabase/SupabaseCandidateRepository';
import { AddCandidate } from '@/core/usecases/candidates/AddCandidate';
import { SetRoomVotingMode } from '@/core/usecases/rooms/SetRoomVotingMode';
import { RemoveCandidate } from '@/core/usecases/candidates/RemoveCandidate';
import { GetUserRooms } from "@/core/usecases/rooms/GetUserRooms";
import { SupabaseInventoryRepository } from '@/adapters/supabase/SupabaseInventoryRepository';
import { AddItem } from '@/core/usecases/inventory/AddItem';
import { ConsumeItem } from '@/core/usecases/inventory/ConsumeItem';
import { GetExpiringItems } from '@/core/usecases/inventory/GetExpiringItems';
import { GetUserInventory } from '@/core/usecases/inventory/GetUserInventory';
import { OpenAIImageRecognizer } from '@/adapters/openai/OpenAIImageRecognizer';
import { GeminiImageRecognizer } from '@/adapters/gemini/GeminiImageRecognizer';
import { FallbackImageRecognizer } from '@/adapters/strategies/FallbackImageRecognizer';

// RECEPTES
import { GeminiRecipeGenerator } from '@/adapters/gemini/GeminiRecipeGenerator';
import { OpenAIRecipeGenerator } from '@/adapters/openai/OpenAIRecipeGenerator';
import { FallbackRecipeGenerator } from '@/adapters/strategies/FallbackRecipeGenerator';
import { RecipeGenerator } from '@/core/ports/RecipeGenerator'; // ✅ Importem la interfície
import { CookRecipe } from '@/core/usecases/inventory/CookRecipe';
import { RecipeMatcher } from '@/core/domain/services/RecipeMatcher';
import { GetRecipe } from '@/core/usecases/recipes/GetRecipe';
// USUARIS
import { SupabaseUserRepository } from '@/adapters/supabase/SupabaseUserRepository';
import { UserRepository } from '@/core/ports/UserRepository'; // ✅ Importem la interfície

import { SupabaseRecipeRepository } from '@/adapters/supabase/SupabaseRecipeRepository';
import { SaveGeneratedRecipe } from '@/core/usecases/recipes/SaveGeneratedRecipe';
import { SuggestRecipes } from '@/core/usecases/inventory/SuggestRecipes';
import { UpdateItem } from '@/core/usecases/inventory/UpdateItem';
import { DeleteItem } from '@/core/usecases/inventory/DeleteItem';

// --- INSTÀNCIES STATELESS (Singletons Implícits) ---
const decisionRepo = new SupabaseDecisionRepository();
const roomRepo = new SupabaseDecisionRoomRepository();
const profileRepo = new SupabasePreferenceRepository();
const foodKnowledgeService = new FoodKnowledgeService();
const individualEngine = new BasicDecisionEngine();
const groupResolver = new BasicGroupResolver(foodKnowledgeService);
const candidateRepo = new SupabaseCandidateRepository();
const inventoryRepo = new SupabaseInventoryRepository();
const recipeRepo = new SupabaseRecipeRepository(); // <--- NOU
// --- SCANNER ---
const geminiAdapter = new GeminiImageRecognizer();
const openAIAdapter = new OpenAIImageRecognizer();
const robustRecognizer = new FallbackImageRecognizer(geminiAdapter, openAIAdapter);

// --- SERVICES ---
const recipeMatcher = new RecipeMatcher();

// --- LAZY SINGLETONS (Variables de mòdul) ---
// Així evitem 'any' i mantenim l'estat global del mòdul
let recipeGeneratorInstance: RecipeGenerator | null = null;
let userRepositoryInstance: UserRepository | null = null;


export const container = {
  getMakeIndividualDecision: () => new MakeIndividualDecision(decisionRepo, profileRepo, individualEngine),
  getCreateDecisionRoom: () => new CreateDecisionRoom(roomRepo),
  getJoinDecisionRoom: () => new JoinDecisionRoom(roomRepo),
  getMakeGroupDecision: () => new MakeGroupDecision(
    roomRepo,
    profileRepo,
    candidateRepo,
    groupResolver
  ),
  getUpdateUserProfile: () => new UpdateUserProfile(profileRepo),
  getRemoveParticipant: () => new RemoveParticipant(roomRepo),
  getClearRoomHistory: () => new ClearRoomHistory(roomRepo),
  getAddCandidate: () => new AddCandidate(candidateRepo),
  getSetVotingMode: () => new SetRoomVotingMode(roomRepo),
  getRemoveCandidate: () => new RemoveCandidate(candidateRepo),
  getUserRooms: () => new GetUserRooms(roomRepo),

  // === INVENTORY ===
  getAddItem: () => new AddItem(inventoryRepo),
  getConsumeItem: () => new ConsumeItem(inventoryRepo),
  getGetExpiringItems: () => new GetExpiringItems(inventoryRepo),
  getGetUserInventory: () => new GetUserInventory(inventoryRepo),
  // ✅ AFEGITS ARA:
  getUpdateItem: () => new UpdateItem(inventoryRepo),
  getDeleteItem: () => new DeleteItem(inventoryRepo),
  getImageRecognizer: () => robustRecognizer,

  // === RECIPES ===
  // Lazy initialization amb tipatge correcte
  getRecipeGenerator: (): RecipeGenerator => {
    if (!recipeGeneratorInstance) {
      const gemini = new GeminiRecipeGenerator();
      const openai = new OpenAIRecipeGenerator();

      // 🔄 CANVI D'ORDRE: OpenAI Primer, Gemini Segon
      // Abans: new FallbackRecipeGenerator(gemini, openai);
      // Ara:
      recipeGeneratorInstance = new FallbackRecipeGenerator(gemini, openai);
    }
    return recipeGeneratorInstance;
  },

  getCookRecipe: () => new CookRecipe(inventoryRepo, recipeMatcher),

  // === USER ===
  getUserRepository: (): UserRepository => {
    if (!userRepositoryInstance) {
      userRepositoryInstance = new SupabaseUserRepository();
    }
    return userRepositoryInstance;
  },
  // === RECIPES (Persistència) ===
  getSaveGeneratedRecipe: () => new SaveGeneratedRecipe(recipeRepo),

  // Helper per llegir receptes (per a la pàgina /recipes/[id])
  getRecipeById: () => ({
    execute: (id: string) => recipeRepo.findById(id)
  }),
  // ✅ NOU: El Cas d'Ús Híbrid (Fase 4)
  getSuggestRecipes: () => {
    const generator = container.getRecipeGenerator(); // Reutilitzem el getter lazy
    return new SuggestRecipes(
      inventoryRepo,
      recipeRepo,
      generator,
      recipeMatcher
    );
  },
  getGetRecipe: () => new GetRecipe(recipeRepo),

};