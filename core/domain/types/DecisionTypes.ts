// src/core/domain/types/DecisionTypes.ts

export interface DecisionMetadata {
  matchPercentage?: number;
  consideredPreferences?: string[];
  avoidedAllergies?: string[];
  recipeId?: string | null;
  isSafe?: boolean;
}

