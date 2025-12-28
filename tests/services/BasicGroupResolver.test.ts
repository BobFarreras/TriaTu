import { describe, it, expect } from 'vitest';
import { BasicGroupResolver } from '@/services/decision/BasicGroupResolver';
import { FoodKnowledgeService } from '@/core/domain/services/FoodKnowledgeService';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { PreferenceProfile } from '@/core/domain/entities/PreferenceProfile';

describe('BasicGroupResolver (Smart V2)', () => {
  // Instanciem el servei de coneixement
  const knowledgeService = new FoodKnowledgeService();
  const resolver = new BasicGroupResolver(knowledgeService);

  it('should reject a candidate if it conflicts with a hard exclusion (Safety First)', async () => {
    // 1. Sala
    const room = new DecisionRoom({ id: 'r1', hostUserId: 'u1', name: 'Test Room' });

    // 2. Perfils: Usuari 1 vol Pizza, Usuari 2 és Celíac
    const p1 = new PreferenceProfile({ 
        id: 'u1', 
        foodPreferences: ['pizza'], 
        socialTolerance: 5, 
        exclusions: [] 
    });
    
    const p2 = new PreferenceProfile({ 
        id: 'u2', 
        foodPreferences: [], 
        socialTolerance: 5, 
        exclusions: ['gluten'] // <--- L'Exclusió Clau
    });

    // 3. Candidats proposats
    const candidates = ['pizza', 'sushi'];

    // 4. Executar
    const outcome = await resolver.resolve(room, [p1, p2], candidates);

    // 5. Verificar
    // La pizza té gluten, el sushi no. Hauria de guanyar el sushi.
    expect(outcome.choice.toLowerCase()).toBe('sushi');
    
    // Ara sí que esperem que la raó contingui "gluten" perquè hem actualitzat el Resolver
    expect(outcome.reason.toLowerCase()).toContain('gluten'); 
  });

  it('should boost score if a candidate matches a cuisine preference', async () => {
    // Usuari li agrada "Italiana", Candidat és "Pizza"
    const p1 = new PreferenceProfile({ 
        id: 'u1', 
        foodPreferences: ['italian'], // Preferència genèrica
        socialTolerance: 5, 
        exclusions: [] 
    });

    const candidates = ['pizza', 'burger']; // Pizza és italiana, Burger no
    const outcome = await resolver.resolve(new DecisionRoom({ id: 'r1', hostUserId: 'u1', name: '' }), [p1], candidates);

    expect(outcome.choice.toLowerCase()).toBe('pizza');
  });
});