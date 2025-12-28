// services/container.ts
import { SupabaseDecisionRepository } from '@/adapters/supabase/SupabaseDecisionRepository';
import { SupabaseDecisionRoomRepository } from '@/adapters/supabase/SupabaseDecisionRoomRepository';
import { SupabasePreferenceRepository } from '@/adapters/supabase/SupabasePreferenceRepository';
import { BasicDecisionEngine } from '@/services/decision/BasicDecisionEngine';
import { BasicGroupResolver } from '@/services/decision/BasicGroupResolver';

import { MakeIndividualDecision } from '@/core/usecases/decision/MakeIndividualDecision';
import { CreateDecisionRoom } from '@/core/usecases/rooms/CreateDecisionRoom';
import { JoinDecisionRoom } from '@/core/usecases/rooms/JoinDecisionRoom';
// CANVI IMPORTANT: Usem el nou Use Case persistent
import { MakeGroupDecision } from '@/core/usecases/rooms/MakeGroupDecision';
import { UpdateUserProfile } from '@/core/usecases/profile/UpdateUserProfile'; // Import nou
// Singleton
const decisionRepo = new SupabaseDecisionRepository();
const roomRepo = new SupabaseDecisionRoomRepository();
const profileRepo = new SupabasePreferenceRepository();

const individualEngine = new BasicDecisionEngine();
const groupResolver = new BasicGroupResolver();

export const container = {
  getMakeIndividualDecision: () => new MakeIndividualDecision(decisionRepo, profileRepo, individualEngine),
  getCreateDecisionRoom: () => new CreateDecisionRoom(roomRepo),
  getJoinDecisionRoom: () => new JoinDecisionRoom(roomRepo),
  // CANVI IMPORTANT: Retornem MakeGroupDecision
  getMakeGroupDecision: () => new MakeGroupDecision(roomRepo, profileRepo, groupResolver),
  getUpdateUserProfile: () => new UpdateUserProfile(profileRepo), // Nou mètode
};