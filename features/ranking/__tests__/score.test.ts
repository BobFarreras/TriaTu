import { describe, it, expect } from 'vitest';
import { sumRankingScore } from '../logic/score';

describe('sumRankingScore', () => {
  it('sums quality, pantry, and community scores', () => {
    expect(sumRankingScore({ qualityScore: 10, pantryScore: 20, communityScore: 5 })).toBe(35);
  });

  it('handles missing values as zero', () => {
    expect(sumRankingScore({ qualityScore: 10 })).toBe(10);
    expect(sumRankingScore({})).toBe(0);
  });
});
