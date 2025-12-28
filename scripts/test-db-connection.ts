// scripts/test-db-connection.ts
import { config } from 'dotenv';

// 1. Carreguem les variables d'entorn ABANS de fer res més
config({ path: '.env.local' });

async function main() {
  console.log('🚀 Testing Full Decision Flow...');

  // 2. Fem imports DINÀMICS. 
  // Si els féssim a dalt de tot (estàtics), el codi de client.ts s'executaria 
  // abans que dotenv hagués carregat les variables, i petaria igualment.
  const { SupabaseDecisionRepository } = await import('../adapters/supabase/SupabaseDecisionRepository');
  const { SupabasePreferenceRepository } = await import('../adapters/supabase/SupabasePreferenceRepository');
  const { BasicDecisionEngine } = await import('../services/decision/BasicDecisionEngine');
  const { MakeIndividualDecision } = await import('../core/usecases/decision/MakeIndividualDecision');
  const { DecisionContext } = await import('../core/domain/value-objects/DecisionContext');
  const { DecisionType } = await import('../core/domain/entities/Decision');

  // 3. Inicialitzem dependencies
  const decisionRepo = new SupabaseDecisionRepository();
  const profileRepo = new SupabasePreferenceRepository();
  const engine = new BasicDecisionEngine();

  // 4. Inicialitzem el Use Case
  const makeDecision = new MakeIndividualDecision(decisionRepo, profileRepo, engine);

  // Fes servir l'ID que has posat a l'INSERT SQL
  // Assegura't que aquest UUID existeix a la taula preference_profiles de Supabase
  const userId = '11111111-1111-1111-1111-111111111111'; 

  try {
    const context = new DecisionContext({
      energyLevel: 3, 
      availableTimeMinutes: 45
    });

    console.log('🧠 Thinking...');
    const decision = await makeDecision.execute({
      userId,
      type: DecisionType.FOOD,
      context
    });

    console.log('✅ Decision Made & Saved!');
    console.log(`🆔 ID: ${decision.id}`);
    console.log(`🍽️ Choice: ${decision.outcome?.choice}`);
    console.log(`🤔 Reason: ${decision.outcome?.reason}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();