export interface RankingScoreInput {
  qualityScore?: number;
  pantryScore?: number;
  communityScore?: number;
}

export function sumRankingScore({
  qualityScore = 0,
  pantryScore = 0,
  communityScore = 0
}: RankingScoreInput): number {
  return qualityScore + pantryScore + communityScore;
}
