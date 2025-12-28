// app/actions/decision-actions.ts
'use server'

import { container } from '@/services/container';
import { DecisionType } from '@/core/domain/entities/Decision';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';

// DTOs
type MakeDecisionInput = {
  userId: string;
  type: DecisionType;
  energyLevel: number;
  timeMinutes: number;
};

export async function makeIndividualDecisionAction(input: MakeDecisionInput) {
  try {
    const useCase = container.getMakeIndividualDecision();
    
    const context = new DecisionContext({
      energyLevel: input.energyLevel,
      availableTimeMinutes: input.timeMinutes
    });

    const decision = await useCase.execute({
      userId: input.userId,
      type: input.type,
      context
    });

    return {
      success: true,
      data: {
        id: decision.id,
        choice: decision.outcome?.choice,
        reason: decision.outcome?.reason
      }
    };
  } catch (error: unknown) { // CORRECCIÓ: 'unknown' en lloc de 'any'
    console.error('Action Error:', error);
    
    // Extracció segura del missatge d'error
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    return { success: false, error: errorMessage };
  }
}