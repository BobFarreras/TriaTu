// tests/domain/DecisionRoom.test.ts
import { describe, it, expect } from 'vitest';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';

describe('DecisionRoom Entity', () => {
  it('should create a new room with one participant (host)', () => {
    const room = new DecisionRoom({
      id: 'room-1',
      hostUserId: 'user-A',
      name: 'Dinner tonight'
    });

    // JA NO COMPROVEM STATUS (sempre estan obertes)
    expect(room.participants).toHaveLength(1);
    expect(room.participants[0].userId).toBe('user-A');
  });

  it('should allow adding a new participant', () => {
    const room = new DecisionRoom({
      id: 'room-1',
      hostUserId: 'user-A',
      name: 'Dinner'
    });

    room.addParticipant('user-B');

    expect(room.participants).toHaveLength(2);
    expect(room.participants.find(p => p.userId === 'user-B')).toBeDefined();
  });

  it('should ignore duplicate participants (idempotency)', () => {
    const room = new DecisionRoom({
      id: 'room-1',
      hostUserId: 'user-A',
      name: 'Dinner'
    });

    // Intentem afegir el host de nou
    room.addParticipant('user-A');

    // NO ha de llençar error, però la longitud ha de continuar sent 1
    expect(room.participants).toHaveLength(1);
  });
});