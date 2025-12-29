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

// CANVI IMPORTANT: Usem el nou Use Case persistent
import { MakeGroupDecision } from '@/core/usecases/rooms/MakeGroupDecision';
import { UpdateUserProfile } from '@/core/usecases/profile/UpdateUserProfile'; // Import nou
import { FoodKnowledgeService } from '@/core/domain/services/FoodKnowledgeService'; // Import nou
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
// Singleton
const decisionRepo = new SupabaseDecisionRepository();
const roomRepo = new SupabaseDecisionRoomRepository();
const profileRepo = new SupabasePreferenceRepository();
// Instància del servei (Singleton)
const foodKnowledgeService = new FoodKnowledgeService();
const individualEngine = new BasicDecisionEngine();
const groupResolver = new BasicGroupResolver(foodKnowledgeService);
// Instàncies
const candidateRepo = new SupabaseCandidateRepository();
const inventoryRepo = new SupabaseInventoryRepository(); // <--- INSTÀNCIA SINGLETON
// Instància del servei (Singleton)
export const container = {
  getMakeIndividualDecision: () => new MakeIndividualDecision(decisionRepo, profileRepo, individualEngine),
  getCreateDecisionRoom: () => new CreateDecisionRoom(roomRepo),
  getJoinDecisionRoom: () => new JoinDecisionRoom(roomRepo),
  // CANVI IMPORTANT: Retornem MakeGroupDecision
  // ✅ CORRECCIÓ AQUÍ: Afegim 'candidateRepo' com a 3r argument
  getMakeGroupDecision: () => new MakeGroupDecision(
    roomRepo,
    profileRepo,
    candidateRepo, // <--- AFEGIT!
    groupResolver
  ), getUpdateUserProfile: () => new UpdateUserProfile(profileRepo), // Nou mètode
  // AFEGIM ELS NOUS:
  getRemoveParticipant: () => new RemoveParticipant(roomRepo),
  getClearRoomHistory: () => new ClearRoomHistory(roomRepo),
  getAddCandidate: () => new AddCandidate(candidateRepo),
  getSetVotingMode: () => new SetRoomVotingMode(roomRepo),
  getRemoveCandidate: () => new RemoveCandidate(candidateRepo),
  // ✅ CORRECCIÓ AQUÍ:
  // En lloc de 'this.getDecisionRoomRepository()', fem servir la variable 'roomRepo' directament.
  getUserRooms: () => new GetUserRooms(roomRepo),

  // === NOUS MÈTODES PER AL REVOST ===
  getAddItem: () => new AddItem(inventoryRepo),
  getConsumeItem: () => new ConsumeItem(inventoryRepo),
  getGetExpiringItems: () => new GetExpiringItems(inventoryRepo),
  getGetUserInventory: () => new GetUserInventory(inventoryRepo),
};