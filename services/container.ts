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
import { OpenAIImageRecognizer } from '@/adapters/openai/OpenAIImageRecognizer'; // ⚠️ REVISA LA RUTA
import { GeminiImageRecognizer } from '@/adapters/gemini/GeminiImageRecognizer'; // ⚠️ REVISA LA RUTA
import { FallbackImageRecognizer } from '@/adapters/strategies/FallbackImageRecognizer';

// ✅ NOUS IMPORTS NECESSARIS PER AL GENERADOR DE RECEPTES
import { GeminiRecipeGenerator } from '@/adapters/gemini/GeminiRecipeGenerator';
import { OpenAIRecipeGenerator } from '@/adapters/openai/OpenAIRecipeGenerator';
import { FallbackRecipeGenerator } from '@/adapters/strategies/FallbackRecipeGenerator';
import { RecipeGenerator } from '@/core/ports/RecipeGenerator';
// ✅ 1. IMPORTAR EL CAS D'ÚS I EL SERVEI DE DOMINI
import { CookRecipe } from '@/core/usecases/inventory/CookRecipe';
import { RecipeMatcher } from '@/core/domain/services/RecipeMatcher';

// Singleton
const decisionRepo = new SupabaseDecisionRepository();
const roomRepo = new SupabaseDecisionRoomRepository();
const profileRepo = new SupabasePreferenceRepository();
const foodKnowledgeService = new FoodKnowledgeService();
const individualEngine = new BasicDecisionEngine();
const groupResolver = new BasicGroupResolver(foodKnowledgeService);
const candidateRepo = new SupabaseCandidateRepository();
const inventoryRepo = new SupabaseInventoryRepository();

// Instàncies Scanner
const geminiAdapter = new GeminiImageRecognizer();
const openAIAdapter = new OpenAIImageRecognizer();
const robustRecognizer = new FallbackImageRecognizer(geminiAdapter, openAIAdapter);

// ✅ VARIABLE SINGLETON PER AL GENERADOR DE RECEPTES
let recipeGeneratorInstance: RecipeGenerator | null = null;


// ✅ 2. INSTANCIAR EL MATCHER (Singleton)
const recipeMatcher = new RecipeMatcher();


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

  // === MÈTODES DEL REVOST ===
  getAddItem: () => new AddItem(inventoryRepo),
  getConsumeItem: () => new ConsumeItem(inventoryRepo),
  getGetExpiringItems: () => new GetExpiringItems(inventoryRepo),
  getGetUserInventory: () => new GetUserInventory(inventoryRepo),
  getImageRecognizer: () => robustRecognizer,

  // ✅ GETTER DEL GENERADOR DE RECEPTES
  getRecipeGenerator: () => {
    if (!recipeGeneratorInstance) {
        // Creem les instàncies només quan es necessiten (Lazy Loading)
        const gemini = new GeminiRecipeGenerator();
        const openai = new OpenAIRecipeGenerator();
        // Creem l'estratègia Fallback
        recipeGeneratorInstance = new FallbackRecipeGenerator(gemini, openai);
    }
    return recipeGeneratorInstance;
  },
  getCookRecipe: () => new CookRecipe(inventoryRepo, recipeMatcher),
};