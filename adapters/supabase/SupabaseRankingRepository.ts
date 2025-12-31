import { SupabaseClient } from '@supabase/supabase-js';
import { RankingRepository } from '@/core/ports/RankingRepository';
import { RankingEntry, calculateBadges } from '@/core/domain/entities/RankingEntry';

// ✅ 1. Definim el DTO (Data Transfer Object)
// Aquesta interfície reflecteix EXACTAMENT les columnes de la vista SQL 'user_leaderboard'.
// És privat perquè només importa a aquest arxiu (Infraestructura).
interface LeaderboardRowDTO {
    user_id: string;
    display_name: string;
    quality_score: number | null;   // SQL pot retornar null si no hi ha dades
    pantry_score: number | null;
    community_score: number | null;
}

export class SupabaseRankingRepository implements RankingRepository {
    // ✅ 2. Tipem el client correctament
    constructor(private supabase: SupabaseClient) {}

    async getTopPlayers(limit: number = 20): Promise<RankingEntry[]> {
        // ✅ 3. Utilitzem el mètode .returns<T>() de Supabase per tipar la resposta
        // Això elimina l'error 'any' i ens dona autocomplete.
        const { data, error } = await this.supabase
            .from('user_leaderboard')
            .select('*')
            .returns<LeaderboardRowDTO[]>(); 

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        // Si data és null (encara que rar amb returns), protegim
        if (!data) return [];

        // ✅ 4. Mapeig amb tipus segurs (Ja no hi ha 'any')
        const players = data.map((row) => {
            // Convertim nulls a 0 de forma segura
            const quality = Number(row.quality_score) ?? 0;
            const pantry = Number(row.pantry_score) ?? 0;
            const community = Number(row.community_score) ?? 0;
            
            const total = quality + pantry + community;

            // Retornem l'entitat de domini neta
            return {
                userId: row.user_id,
                displayName: row.display_name ?? 'Chef Anònim',
                qualityScore: quality,
                pantryScore: pantry,
                communityScore: community,
                totalScore: total,
                rank: 0, 
                badges: []
            };
        });

        // Ordenar per puntuació total
        players.sort((a, b) => b.totalScore - a.totalScore);

        // Assignar Ranks i Medalles
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
        return allPlayers.find(p => p.userId === userId) || null;
    }
}