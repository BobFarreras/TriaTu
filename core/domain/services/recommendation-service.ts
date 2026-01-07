// src/domain/services/recommendation-service.ts

// DEFINICIONS DE TIPUS
export interface ParticipantProfile {
  id: string;
  allergies: string[];
  dislikes: string[];
  preferences: string[];
}

export interface RecipeCandidate {
  id: string;
  title: string;
  tags: string[];
  description?: string;
  score?: number;
  matchingReasons?: string[];
}

export interface RecommendationResult {
  success: boolean;
  choice?: string;
  reason?: string;
  metadata?: {
    matchPercentage: number;
    avoidedAllergies: string[];
    recipeId: string | null;
    isSafe: boolean;
  };
  error?: string;
}

export function findBestRecipe(
  groupProfile: ParticipantProfile[], 
  candidates: RecipeCandidate[]
): RecommendationResult {

  console.log("🔍 STARTING ALGORITHM...");
  console.log(`📊 Input: ${groupProfile.length} participants, ${candidates.length} candidates.`);

  // 1. CONSTRUIR LISTA NEGRA COL·LECTIVA
  const groupAllergies = new Set<string>();
  const groupDislikes = new Set<string>();
  const groupPreferences = new Set<string>();

  groupProfile.forEach(p => {
    // Normalitzem a minúscules i treiem espais extra
    p.allergies.forEach(a => groupAllergies.add(a.toLowerCase().trim()));
    p.dislikes.forEach(d => groupDislikes.add(d.toLowerCase().trim()));
    p.preferences.forEach(pref => groupPreferences.add(pref.toLowerCase().trim()));
  });

  const allergiesArray = Array.from(groupAllergies);
  console.log("🚨 DETECTED ALLERGIES (Collective):", allergiesArray);
  console.log("⛔ DETECTED DISLIKES (Collective):", Array.from(groupDislikes));

  const safeCandidates: RecipeCandidate[] = [];

  // 2. FILTRATGE DE SEGURETAT (HARD CONSTRAINTS)
  for (const recipe of candidates) {
    let isSafe = true;
    const recipeText = (
      (recipe.title || '') + " " + 
      (recipe.tags || []).join(" ") + " " + 
      (recipe.description || '')
    ).toLowerCase();

    // Check Al·lèrgies
    for (const allergy of allergiesArray) {
       // Si l'al·lèrgia és buida (string buit), la ignorem
       if (!allergy) continue; 
       
       if (recipeText.includes(allergy)) {
           console.log(`❌ Candidate '${recipe.title}' REJECTED due to allergy: '${allergy}'`);
           isSafe = false;
           break;
       }
    }

    // Check Exclusions
    if (isSafe) {
        for (const dislike of Array.from(groupDislikes)) {
            if (!dislike) continue;
            if (recipeText.includes(dislike)) {
                console.log(`❌ Candidate '${recipe.title}' REJECTED due to dislike: '${dislike}'`);
                isSafe = false; 
                break;
            }
        }
    }

    if (isSafe) {
        safeCandidates.push({ ...recipe, score: 0, matchingReasons: [] });
    }
  }

  console.log(`✅ Safe Candidates count: ${safeCandidates.length} / ${candidates.length}`);

  if (safeCandidates.length === 0) {
      console.warn("⚠️ NO SAFE CANDIDATES FOUND!");
      return { 
          success: false,
          error: "Cap recepta és segura per a aquest grup! 🚨",
          metadata: { 
            matchPercentage: 0, 
            avoidedAllergies: allergiesArray,
            recipeId: null,
            isSafe: false 
          }
      };
  }

  // 3. PUNTUACIÓ
  const rankedCandidates = safeCandidates.map(recipe => {
      let score = 0;
      const reasons: string[] = []; // Tipat explícit
      const recipeText = ((recipe.title || '') + " " + (recipe.tags || []).join(" ")).toLowerCase();

      groupPreferences.forEach(pref => {
          if (pref && recipeText.includes(pref)) {
              score += 10;
              reasons.push(pref);
          }
      });

      if (recipe.tags && recipe.tags.length > 0) score += 2;
      score += Math.random() * 5;

      return { ...recipe, score, matchingReasons: reasons };
  });

  rankedCandidates.sort((a, b) => (b.score || 0) - (a.score || 0));
  const winner = rankedCandidates[0];

  console.log(`🏆 WINNER: ${winner.title} (Score: ${winner.score?.toFixed(1)})`);

  const uniqueReasons = Array.from(new Set(winner.matchingReasons));
  const reasonText = uniqueReasons.length > 0 
    ? `Coincideix amb els gustos del grup (${uniqueReasons.slice(0, 3).join(', ')}) i és segura.` 
    : "Una opció segura i equilibrada per a tothom.";

  return {
    success: true,
    choice: winner.title,
    reason: reasonText,
    metadata: {
        matchPercentage: Math.min(99, 70 + Math.floor(winner.score || 0)),
        avoidedAllergies: allergiesArray,
        recipeId: winner.id,
        isSafe: true
    }
  };
}