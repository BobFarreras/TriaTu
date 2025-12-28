import { Decision } from '@/core/domain/entities/Decision';

export interface DecisionRepository {
  save(decision: Decision): Promise<void>;
  findById(id: string): Promise<Decision | null>;
}