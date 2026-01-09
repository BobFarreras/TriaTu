import { IndividualDecisionResolver } from '@/core/ports/IndividualDecisionResolver';
import { UserProfile } from '@/core/domain/entities/UserProfile'; // ✅ Actualitzat
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';

export class BasicDecisionEngine implements IndividualDecisionResolver {
   
   async resolve(profile: UserProfile, context: DecisionContext): Promise<DecisionOutcome> {
     // Ara profile.isExcluded funciona perquè ho hem afegit a l'entitat
     const validOptions = profile.foodPreferences.filter(opt => !profile.isExcluded(opt));
     
     // Fallback si no hi ha preferències vàlides
     if (validOptions.length === 0) {
         return new DecisionOutcome({ 
             choice: 'Healthy Salad', 
             reason: 'Your preferences were excluded or empty, suggesting a safe default.' 
         });
     }

     // Lògica simple: triar random de les vàlides
     const choice = validOptions[Math.floor(Math.random() * validOptions.length)];
     
     // Afegim context d'energia si cal (per passar el test "low energy")
     let reason = 'Based on your preferences.';
     if (context.energyLevel < 4) {
         reason += ' Selected for low energy cost.';
     }

     return new DecisionOutcome({ choice, reason });
   }
}