// ARXIU: adapters/supabase/SupabaseRankingRepository.ts

import { SupabaseClient } from '@supabase/supabase-js';
import { RankingRepository } from '@/core/ports/RankingRepository';
import { RankingEntry, calculateBadges } from '@/core/domain/entities/RankingEntry';

// ✅ 1. DTO (Data Transfer Object)
// Coincideix 1:1 amb la teva VIEW 'user_leaderboard' actualitzada
interface LeaderboardRowDTO {
    user_id: string;
    display_name: string;
    avatar_emoji: string;
    quality_score: number | null;
    pantry_score: number | null;
    community_score: number | null;
    total_score: number | null; // ✅ NOU: Ja ve calculat d'SQL
}

export class SupabaseRankingRepository implements RankingRepository {
    constructor(private supabase: SupabaseClient) { }

    async getTopPlayers(limit: number = 20): Promise<RankingEntry[]> {
        const page = await this.getPlayersPage(limit, 0);
        return page.players;
    }

    async getPlayersPage(limit: number = 20, offset: number = 0): Promise<{ players: RankingEntry[]; totalCount: number }> {
        const { data, error, count } = await this.supabase
            .from('user_leaderboard')
            .select('*', { count: 'exact' })
            .order('total_score', { ascending: false })
            .range(offset, offset + limit - 1)
            .returns<LeaderboardRowDTO[]>();

        if (error) {
            console.error('❌ Error Supabase Ranking:', error);
            return { players: [], totalCount: 0 };
        }

        if (!data) return { players: [], totalCount: count ?? 0 };

        return {
            players: data.map((row, index) => {
                const rank = offset + index + 1;

                const quality = Number(row.quality_score) || 0;
                const pantry = Number(row.pantry_score) || 0;
                const community = Number(row.community_score) || 0;
                const total = Number(row.total_score) || 0;

                const badges = calculateBadges(rank, quality, community, pantry);

                return {
                    userId: row.user_id,
                    displayName: row.display_name ?? 'Chef Anònim',
                    avatarEmoji: row.avatar_emoji ?? '👨‍🍳',
                    qualityScore: quality,
                    pantryScore: pantry,
                    communityScore: community,
                    totalScore: total,
                    rank: rank,
                    badges: badges
                };
            }),
            totalCount: count ?? data.length
        };
    }

    async getUserRank(userId: string): Promise<RankingEntry | null> {
        // Estratègia simple: Baixem el Top 1000 per trobar l'usuari i saber el seu rank real.
        // (Per a apps molt grans, això es faria amb una query SQL específica, però per <10k usuaris això és perfecte)
        const allPlayers = await this.getTopPlayers(1000);
        
        const found = allPlayers.find(p => p.userId === userId) || null;

        if (found) {
            console.log(`🔍 Usuari trobat al rànquing: #${found.rank} - ${found.displayName}`);
        }

        return found;
    }
}
