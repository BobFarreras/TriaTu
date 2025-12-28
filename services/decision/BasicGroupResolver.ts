// services/decision/BasicGroupResolver.ts
import { GroupDecisionResolver } from '@/core/ports/GroupDecisionResolver';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

// Interface auxiliar per accedir a propietats privades de forma segura
interface ProfileWithExclusions {
  exclusions: string[];
}

export class BasicGroupResolver implements GroupDecisionResolver {
  
  async resolve(
    room: DecisionRoom, 
    profiles: PreferenceProfile[],
    candidates?: string[] // <-- NOU PARÀMETRE OPCIONAL
  ): Promise<DecisionOutcome> {
    
    // Validació inicial
    if (profiles.length === 0) {
      return new DecisionOutcome({ choice: 'Random', reason: 'No profiles available' });
    }

    // 1. Recollir totes les Exclusions globals (Hard Limits)
    const globalExclusions = new Set<string>();
    
    profiles.forEach(p => {
        const profileAccess = p as unknown as ProfileWithExclusions;
        profileAccess.exclusions.forEach((ex: string) => globalExclusions.add(ex.toLowerCase()));
    });

    // CAS A: HI HA CANDIDATS (Llista Tancada - Ex: "Japonès o Italià?")
    if (candidates && candidates.length > 0) {
      return this.resolveFromCandidates(candidates, globalExclusions);
    }

    // CAS B: NO HI HA CANDIDATS (Llista Oberta - Ex: "Què mengem avui?")
    return this.resolveOpenEnded(profiles, globalExclusions);
  }

  // --- Lògica A: Filtrar i triar d'una llista ---
  private resolveFromCandidates(candidates: string[], exclusions: Set<string>): DecisionOutcome {
    // 1. Filtrar opcions prohibides
    const validCandidates = candidates.filter(c => !exclusions.has(c.toLowerCase()));

    if (validCandidates.length === 0) {
      return new DecisionOutcome({ 
        choice: 'None', 
        reason: 'Conflict! All proposed options interact with someone\'s exclusions.' 
      });
    }

    // 2. Triar un guanyador (MVP: Aleatori entre els vàlids)
    // En el futur aquí podríem mirar quin candidat coincideix més amb les preferències positives.
    const winner = validCandidates[Math.floor(Math.random() * validCandidates.length)];
    
    return new DecisionOutcome({
      choice: winner,
      reason: `Chosen from your list (${validCandidates.length} valid options). Safe for everyone.`
    });
  }

  // --- Lògica B: Algoritme de Vots (El que ja tenies) ---
  private resolveOpenEnded(profiles: PreferenceProfile[], exclusions: Set<string>): DecisionOutcome {
    const voteCount: Record<string, number> = {};
    
    profiles.forEach(p => {
      p.foodPreferences.forEach(food => {
        const normalizedFood = food.toLowerCase();
        if (!exclusions.has(normalizedFood)) {
          voteCount[normalizedFood] = (voteCount[normalizedFood] || 0) + 1;
        }
      });
    });

    let bestOption = 'Random Place';
    let maxVotes = 0;
    const entries = Object.entries(voteCount);

    if (entries.length > 0) {
      entries.sort((a, b) => b[1] - a[1]);
      bestOption = entries[0][0]; 
      maxVotes = entries[0][1];
      // Capitalitzem
      bestOption = bestOption.charAt(0).toUpperCase() + bestOption.slice(1);
    }

    const reason = maxVotes === profiles.length 
      ? `Perfect match! Everyone likes ${bestOption}.`
      : `Best compromise. ${bestOption} satisfies ${maxVotes} out of ${profiles.length} people.`;

    return new DecisionOutcome({ choice: bestOption, reason });
  }
}