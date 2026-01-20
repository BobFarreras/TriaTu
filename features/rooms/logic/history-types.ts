import { DecisionMetadata } from '@/core/domain/types/DecisionTypes';

export interface DecisionMetaExtended extends DecisionMetadata {
  recipeId?: string;
  matchPercentage?: number;
  matchCount?: number;
  isManual?: boolean;
  isSafe?: boolean;
  isAiGenerated?: boolean;
  avoidedAllergies?: string[];
  fullRecipe?: unknown;
}

export interface HistoryItem {
  choice: string;
  reason: string;
  date: string;
  metadata?: DecisionMetadata | string; 
}

export const safeParseMeta = (rawMeta: unknown): DecisionMetaExtended => {
  if (!rawMeta) return {};
  if (typeof rawMeta === 'string') {
    try { return JSON.parse(rawMeta); } catch { return {}; }
  }
  return rawMeta as DecisionMetaExtended;
};