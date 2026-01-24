// src/core/repositories/RankingRepository.ts
import { RankingEntry } from "../domain/entities/RankingEntry";

export interface RankingRepository {
    /**
     * Obté els millors jugadors ordenats per puntuació total.
     * @param limit Nombre màxim d'usuaris a recuperar
     */
    getTopPlayers(limit: number): Promise<RankingEntry[]>;

    /**
     * Obté una pagina de jugadors ordenats per puntuacio total.
     * @param limit Nombre maxim d'usuaris a recuperar
     * @param offset Posicio inicial (0-based)
     */
    getPlayersPage(limit: number, offset: number): Promise<{ players: RankingEntry[]; totalCount: number }>;

    /**
     * Obté la posició específica d'un usuari.
     * @param userId ID de l'usuari
     */
    getUserRank(userId: string): Promise<RankingEntry | null>;
}
