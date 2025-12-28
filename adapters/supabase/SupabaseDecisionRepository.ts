// adapters/supabase/SupabaseDecisionRepository.ts
import { DecisionRepository } from '@/core/ports/DecisionRepository';
import { Decision, DecisionStatus, DecisionType } from '@/core/domain/entities/Decision';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { supabase } from './client';



export class SupabaseDecisionRepository implements DecisionRepository {

    async save(decision: Decision): Promise<void> {
        // 1. Guardar la decisió principal
        const { error: decisionError } = await supabase
            .from('decisions')
            .upsert({
                id: decision.id,
                user_id: decision.userId,
                type: decision.type,
                status: decision.status,
                context: decision.context
            });

        if (decisionError) throw new Error(`Error saving decision: ${decisionError.message}`);

        // 2. Si té resultat, guardar-lo a la taula satèl·lit
        if (decision.outcome) {
            const { error: outcomeError } = await supabase
                .from('decision_outcomes')
                .upsert({
                    decision_id: decision.id,
                    choice: decision.outcome.choice,
                    reason: decision.outcome.reason,
                    generated_at: decision.outcome.generatedAt.toISOString()
                });

            if (outcomeError) throw new Error(`Error saving outcome: ${outcomeError.message}`);
        }
    }

    async findById(id: string): Promise<Decision | null> {
        // Recuperem decisió + outcome (join)
        const { data, error } = await supabase
            .from('decisions')
            .select('*, decision_outcomes(*)')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        // MAPPER: Database -> Domain Entity
        const context = new DecisionContext({
            energyLevel: data.context.energyLevel,
            availableTimeMinutes: data.context.availableTimeMinutes,
            location: data.context.location
        });

        const decision = new Decision({
            id: data.id,
            userId: data.user_id,
            type: data.type as DecisionType,
            context: context
        });

        // Restaurar estat
        if (data.status !== DecisionStatus.PENDING) {
            decision.status = data.status as DecisionStatus;
        }
        // Restaurar Outcome
        if (data.decision_outcomes) {
            const outcomeData = Array.isArray(data.decision_outcomes)
                ? data.decision_outcomes[0]
                : data.decision_outcomes;

            if (outcomeData) {
                const outcome = new DecisionOutcome({
                    choice: outcomeData.choice,
                    reason: outcomeData.reason
                });

                // CORRECCIÓ: Casting a 'unknown' i després a un objecte que té la propietat _outcome.
                // Això evita el problema de la intersecció amb 'private' i evita l'ús de 'any'.
                (decision as unknown as { _outcome: DecisionOutcome })._outcome = outcome;
            }
        }

        return decision;

        return decision;
    }
}