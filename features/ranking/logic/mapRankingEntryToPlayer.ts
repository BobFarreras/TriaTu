import { Player } from '@/core/domain/entities/Player';
import { RankingEntry } from '@/core/domain/entities/RankingEntry';
import { sumRankingScore } from './score';

export const mapRankingEntryToPlayer = (entry: RankingEntry): Player => ({
  id: entry.userId,
  username: entry.displayName ?? 'Anònim',
  score: sumRankingScore({
    qualityScore: entry.qualityScore,
    pantryScore: entry.pantryScore,
    communityScore: entry.communityScore
  }),
  wins: 0,
  rank: entry.rank
});
