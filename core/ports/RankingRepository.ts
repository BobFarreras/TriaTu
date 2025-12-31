// src/core/repositories/RankingRepository.ts
import { RankingEntry } from "../domain/entities/RankingEntry";

export interface RankingRepository {
    /**
     * Obté els millors jugadors ordenats per puntuació total.
     * @param limit Nombre màxim d'usuaris a recuperar
     */
    getTopPlayers(limit: number): Promise<RankingEntry[]>;

    /**
     * Obté la posició específica d'un usuari.
     * @param userId ID de l'usuari
     */
    getUserRank(userId: string): Promise<RankingEntry | null>;
}