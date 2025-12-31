// tests/core/domain/entities/RankingEntry.test.ts
import { describe, it, expect } from 'vitest';
import { calculateBadges, BADGES } from '@/core/domain/entities/RankingEntry';

describe('Domain Logic: Ranking Badges', () => {
    
    it('should award the Crown to Rank 1', () => {
        const badges = calculateBadges(1, 0, 0, 0);
        expect(badges).toContain(BADGES.TOP_1);
        expect(badges).not.toContain(BADGES.TOP_3); // Si ets 1r, tens la corona, no el trofeu genèric
    });

    it('should award Trophy to Rank 2 and 3', () => {
        const badgesRank2 = calculateBadges(2, 0, 0, 0);
        const badgesRank3 = calculateBadges(3, 0, 0, 0);
        
        expect(badgesRank2).toContain(BADGES.TOP_3);
        expect(badgesRank3).toContain(BADGES.TOP_3);
    });

    it('should award Quality Master if quality score is high enough', () => {
        // Rank 10 (no podium), Quality 60 (high), others 0
        const badges = calculateBadges(10, 60, 0, 0);
        expect(badges).toContain(BADGES.QUALITY_MASTER);
        expect(badges).not.toContain(BADGES.TOP_1);
    });

    it('should award multiple badges for a complete player', () => {
        // Rank 1, High Quality, High Pantry
        const badges = calculateBadges(1, 55, 0, 45);
        
        expect(badges).toContain(BADGES.TOP_1);
        expect(badges).toContain(BADGES.QUALITY_MASTER);
        expect(badges).toContain(BADGES.PANTRY_PRO);
    });

    it('should return empty badges for a newbie', () => {
        const badges = calculateBadges(100, 0, 0, 0);
        expect(badges).toHaveLength(0);
    });
});