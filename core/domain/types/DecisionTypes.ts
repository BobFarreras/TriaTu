// src/core/domain/types/DecisionTypes.ts

export interface DecisionMetadata {
  matchPercentage?: number;
  consideredPreferences?: string[];
  avoidedAllergies?: string[];
  recipeId?: string | null;
  isSafe?: boolean;
}

// Resultat estàndard de l'algoritme de recomanació
export interface RecommendationResult {
  success: boolean;
  choice?: string;
  reason?: string;
  metadata?: DecisionMetadata;
  error?: string;
}