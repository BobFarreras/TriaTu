// src/adapters/supabase/types/database.dtos.ts
import { DecisionMetadata } from '@/core/domain/types/DecisionTypes';

// --- DTOs per a PARTICIPANTS ---
export interface DbProfileRow {
  user_id: string;
  exclusions: string[] | null;
  food_preferences: string[] | null;
}

export interface DbParticipant {
  user_id: string;
  joined_at: string;
}

// --- DTOs per a RECEPTES ---
export interface DbSavedRecipe {
  id: string;
  name: string;          // A saved_recipes es diu 'name'
  dietary_tags: string[] | null;
  tags: string[] | null; // Assumim string[] o jsonb
}

export interface DbCommunityRecipe {
  id: string;
  title: string;
  tags: string[] | null;
  description: string | null;
}

export interface DbSavedRecipeRow {
  recipe_id: string;
  recipes: {
    id: string;
    title: string;
    tags: string[] | null;
    description: string | null;
  } | null;
}

// --- DTOs per a DECISIONS i SALES ---
export interface DbDecision {
  choice: string;
  reason: string;
  created_at: string;
  // Fem servir el tipus del domini perquè és el que guardem al JSONB
  metadata: DecisionMetadata | null; 
}

export interface DbRoom {
  id: string;
  host_user_id: string;
  invite_code: string;
  name: string;
  voting_mode: string;
  created_at: string;
  last_decision_at?: string | null;
  status?: string;
}

// Resposta complexa del JOIN de sales
export interface DbRoomJoinResponse extends DbRoom {
  participants: DbParticipant[];
  decisions: DbDecision[];
}