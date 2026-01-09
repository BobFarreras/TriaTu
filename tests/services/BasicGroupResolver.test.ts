// tests/services/BasicGroupResolver.test.ts
import { describe, it, expect, vi } from 'vitest';
import { BasicGroupResolver } from '@/services/decision/BasicGroupResolver';
import { FoodKnowledgeService } from '@/core/domain/services/FoodKnowledgeService';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import { RoomParticipant } from '@/core/domain/entities/RoomParticipant';
import { DietaryRestriction } from '@/core/domain/value-objects/DietaryRestriction';

describe('BasicGroupResolver (Smart V2)', () => {
  
  // 1. MOCK: Creem un servei fals
  const mockKnowledgeService = {
    // ✅ CORRECCIÓ: Usem 'hasConflict' que és el nom real del mètode
    hasConflict: vi.fn((food: string, exclusionKeyword: string) => {
        const f = food.toLowerCase();
        const k = exclusionKeyword.toLowerCase();
        
        // Simulem: Si l'aliment és Pizza i la keyword és 'gluten' -> Conflicte
        if (f.includes('pizza') && k === 'gluten') {
            return true; 
        }
        return false;
    }),
    
    matchesPreference: vi.fn(() => true) 
  } as unknown as FoodKnowledgeService;

  const resolver = new BasicGroupResolver(mockKnowledgeService);

  it('should reject a candidate if it conflicts with a hard exclusion (Safety First)', async () => {
    // 1. Sala
    const room = new DecisionRoom({ 
        id: 'r1', hostUserId: 'u1', name: 'Test Room',
        inviteCode: 'TEST', votingMode: 'PUBLIC',
        participants: [new RoomParticipant('u1'), new RoomParticipant('u2')],
        history: []
    });

    // 2. Perfils: U2 és Celíac
    const p1 = new UserProfile('u1', [], ['pizza'], 5);
    const p2 = new UserProfile('u2', [DietaryRestriction.GLUTEN_FREE], [], 5);

    // 3. Candidats
    const candidates = ['pizza', 'sushi'];

    // 4. Executar
    const outcome = await resolver.resolve(room, [p1, p2], candidates);

    // 5. Verificar
    // Pizza hauria de ser rebutjada perquè 'gluten' és una keyword de GLUTEN_FREE i el mock retorna true
    expect(outcome.choice.toLowerCase()).toBe('sushi');
    expect(outcome.reason.toLowerCase()).toMatch(/gluten|safety|restriction|excluded/); 
  });

  it('should boost score if a candidate matches a cuisine preference', async () => {
    const p1 = new UserProfile('u1', [], ['italian'], 5);
    const room = new DecisionRoom({ 
        id: 'r1', hostUserId: 'u1', name: 'Italian Night',
        inviteCode: 'TEST', votingMode: 'PUBLIC',
        participants: [new RoomParticipant('u1')],
        history: []
    });

    const candidates = ['pizza', 'burger']; 
    const outcome = await resolver.resolve(room, [p1], candidates);

    expect(outcome.choice.toLowerCase()).toBe('pizza');
  });
});