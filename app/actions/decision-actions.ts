// app/actions/decision-actions.ts
'use server'

import { container } from '@/services/container';
import { DecisionType } from '@/core/domain/entities/Decision';
import { DecisionContext } from '@/core/domain/value-objects/DecisionContext';
import { IndividualDecisionSchema } from '@/core/application/schemas/inputSchemas'; // ✅ Import

// DTOs
type MakeDecisionInput = {
  userId: string;
  type: DecisionType;
  energyLevel: number;
  timeMinutes: number;
};

export async function makeIndividualDecisionAction(input: MakeDecisionInput) {
  // 1. 🛡️ VALIDACIÓ ZOD
  const validation = IndividualDecisionSchema.safeParse({
      userId: input.userId,
      type: input.type,
      energyLevel: input.energyLevel,
      timeMinutes: input.timeMinutes
  });

  if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message };
  }

  const data = validation.data;

  try {
    const useCase = container.getMakeIndividualDecision();
    
    const context = new DecisionContext({
      energyLevel: data.energyLevel,
      availableTimeMinutes: data.timeMinutes
    });

    const decision = await useCase.execute({
      userId: data.userId,
      type: data.type as DecisionType, // Casting segur després de validació
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
  } catch (error: unknown) {
    console.error('Action Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    return { success: false, error: errorMessage };
  }
}