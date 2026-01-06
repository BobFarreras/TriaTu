import { describe, it, expect } from 'vitest';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';

describe('Entity: DecisionRoom', () => {
  it('✅ Hauria de guardar correctament el inviteCode', () => {
    const room = new DecisionRoom({
      id: '123',
      hostUserId: 'user-1',
      name: 'Test Room',
      inviteCode: 'CODE123', // El nostre nou camp
      votingMode: 'BLIND',
      participants: [],
      history: []
    });

    expect(room.inviteCode).toBe('CODE123');
  });

  // Si volguéssim ser estrictes, podríem fer que el tipus petés si falta el codi,
  // però això ja ho comprova TypeScript al compilar.
});