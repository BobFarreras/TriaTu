import { describe, it, expect } from 'vitest';
import { mapRankingEntryToPlayer } from '../logic/mapRankingEntryToPlayer';
import { RankingEntry } from '@/core/domain/entities/RankingEntry';

describe('mapRankingEntryToPlayer', () => {
  it('maps ranking entry to player with summed score', () => {
    const entry: RankingEntry = {
      userId: 'user-1',
      displayName: 'Chef Test',
      avatarEmoji: '👨‍🍳',
      qualityScore: 10,
      pantryScore: 20,
      communityScore: 5,
      totalScore: 35,
      rank: 4,
      badges: []
    };

    const player = mapRankingEntryToPlayer(entry);

    expect(player.id).toBe('user-1');
    expect(player.username).toBe('Chef Test');
    expect(player.score).toBe(35);
    expect(player.rank).toBe(4);
  });
});
