// src/core/domain/entities/RankingEntry.ts

export interface RankingEntry {
    userId: string;
    displayName: string;
    
    // Desglossem la puntuació per transparència
    qualityScore: number;   // Punts per estrelles rebudes (Reputació)
    pantryScore: number;    // Punts per tenir el rebost al dia (Hàbit)
    communityScore: number; // Punts per votar altres (Participació)
    
    totalScore: number;     // Suma total
    rank: number;           // Posició numèrica (1, 2, 3...)
    badges: string[];       // Medalles visuals
}

// ==========================================
// PURE DOMAIN LOGIC (Regles de Negoci)
// ==========================================

export const BADGES = {
    TOP_1: '👑',
    TOP_3: '🏆',
    QUALITY_MASTER: '⭐',    // +50 punts de qualitat
    COMMUNITY_HERO: '🗣️',    // +20 punts de comunitat
    PANTRY_PRO: '📦'         // +40 punts de rebost
};

/**
 * Funció pura que calcula les medalles basant-se en les mètriques.
 * Aquesta lògica està aïllada i és 100% testejable.
 */
export function calculateBadges(
    rank: number, 
    qualityScore: number, 
    communityScore: number, 
    pantryScore: number
): string[] {
    const badges: string[] = [];
    
    // 1. Medalles per Posició
    if (rank === 1) badges.push(BADGES.TOP_1);
    else if (rank <= 3) badges.push(BADGES.TOP_3);

    // 2. Medalles per Mèrit (Gamification)
    if (qualityScore >= 50) badges.push(BADGES.QUALITY_MASTER);
    if (communityScore >= 20) badges.push(BADGES.COMMUNITY_HERO);
    if (pantryScore >= 40) badges.push(BADGES.PANTRY_PRO);
    
    return badges;
}