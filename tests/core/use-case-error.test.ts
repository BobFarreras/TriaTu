import { describe, it, expect } from 'vitest';
import { UseCaseError } from '@/core/application/errors/UseCaseError';
import { wrapUseCase } from '@/services/observability/wrapUseCase';

describe('UseCaseError', () => {
  it('wraps a non-UseCaseError', () => {
    const original = new Error('boom');
    const wrapped = UseCaseError.wrap('inventory', 'AddItem', original, 'INVENTORY_ADD');

    expect(wrapped).toBeInstanceOf(UseCaseError);
    expect(wrapped.feature).toBe('inventory');
    expect(wrapped.useCase).toBe('AddItem');
    expect(wrapped.code).toBe('INVENTORY_ADD');
    expect(wrapped.cause).toBe(original);
  });

  it('returns the same instance when already a UseCaseError', () => {
    const original = new UseCaseError('fail', { feature: 'rooms', useCase: 'JoinDecisionRoom' });
    const wrapped = UseCaseError.wrap('rooms', 'JoinDecisionRoom', original);

    expect(wrapped).toBe(original);
  });
});

describe('wrapUseCase', () => {
  it('converts thrown errors into UseCaseError', async () => {
    const useCase = {
      execute: async () => {
        throw new Error('boom');
      }
    };

    const wrapped = wrapUseCase('inventory', 'AddItem', useCase);

    await expect(wrapped.execute()).rejects.toMatchObject({
      name: 'UseCaseError',
      feature: 'inventory',
      useCase: 'AddItem'
    });
  });
});
