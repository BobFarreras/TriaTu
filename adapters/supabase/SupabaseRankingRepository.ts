import { SupabaseClient } from '@supabase/supabase-js';
import { RankingRepository } from '@/core/ports/RankingRepository';
import { RankingEntry, calculateBadges } from '@/core/domain/entities/RankingEntry';

// ✅ 1. Definim el DTO (Data Transfer Object)
// Aquesta interfície reflecteix EXACTAMENT les columnes de la vista SQL 'user_leaderboard'.
// És privat perquè només importa a aquest arxiu (Infraestructura).
interface LeaderboardRowDTO {
    user_id: string;
    display_name: string;
    avatar_emoji: string; // ✅ NOU CAMP
    quality_score: number | null;   // SQL pot retornar null si no hi ha dades
    pantry_score: number | null;
    community_score: number | null;
}

export class SupabaseRankingRepository implements RankingRepository {
    constructor(private supabase: SupabaseClient) { }

    async getTopPlayers(limit: number = 20): Promise<RankingEntry[]> {
        // 1. Fem la consulta
        const { data, error } = await this.supabase
            .from('user_leaderboard')
            .select('*')
            .returns<LeaderboardRowDTO[]>();

        // 🚨 CONSOLES DE DEPURACIÓ 🚨
        console.log('--- 🏆 DEBUG RÀNQUING ---');
        if (error) {
            console.error('❌ Error Supabase:', error);
        } else {
            console.log(`✅ Dades rebudes: ${data?.length} usuaris`);
            console.log('📋 Mostra (primer usuari):', data?.[0]);
            // Si vols veure tots els IDs per comprovar qui falta:
            console.log('👥 User IDs trobats:', data?.map(u => u.user_id));
        }
        console.log('-------------------------');

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        if (!data) return [];

        // 2. Mapeig (es manté igual que abans)
        const players = data.map((row) => {
            const quality = Number(row.quality_score) ?? 0;
            const pantry = Number(row.pantry_score) ?? 0;
            const community = Number(row.community_score) ?? 0;

            const total = quality + pantry + community;

            return {
                userId: row.user_id,
                displayName: row.display_name ?? 'Chef Anònim',
                avatarEmoji: row.avatar_emoji ?? '👨‍🍳', // ✅ NOU CAMP AL DOMINI
                qualityScore: quality,
                pantryScore: pantry,
                communityScore: community,
                totalScore: total,
                rank: 0,
                badges: []
            };
        });

        // Ordenar
        players.sort((a, b) => b.totalScore - a.totalScore);

        // Retornar amb badges
        return players.slice(0, limit).map((player, index) => {
            const rank = index + 1;
            const badges = calculateBadges(
                rank,
                player.qualityScore,
                player.communityScore,
                player.pantryScore
            );
            return { ...player, rank, badges };
        });
    }

    async getUserRank(userId: string): Promise<RankingEntry | null> {
        const allPlayers = await this.getTopPlayers(1000);
        const found = allPlayers.find(p => p.userId === userId) || null;

        // 🚨 DEBUG INDIVIDUAL
        console.log(`🔍 Buscant usuari ${userId} al rànquing... ${found ? 'Trobat ✅' : 'No trobat ❌'}`);

        return found;
    }
}