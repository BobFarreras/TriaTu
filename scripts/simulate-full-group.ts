import { config } from 'dotenv';
config({ path: '.env.local' });

// Usem imports dinàmics
async function main() {
  const { SupabasePreferenceRepository } = await import('../adapters/supabase/SupabasePreferenceRepository');
  const { SupabaseDecisionRoomRepository } = await import('../adapters/supabase/SupabaseDecisionRoomRepository');
  const { BasicGroupResolver } = await import('../services/decision/BasicGroupResolver');
  const { ResolveGroupDecision } = await import('../core/usecases/rooms/ResolveGroupDecision');
  const { CreateDecisionRoom } = await import('../core/usecases/rooms/CreateDecisionRoom');
  const { JoinDecisionRoom } = await import('../core/usecases/rooms/JoinDecisionRoom');
  const { PreferenceProfile } = await import('../core/domain/entities/PreferenceProfile');
  
  // ✅ 1. IMPORTAR EL SERVEI NOU
  const { FoodKnowledgeService } = await import('../core/domain/services/FoodKnowledgeService');

  const profileRepo = new SupabasePreferenceRepository();
  const roomRepo = new SupabaseDecisionRoomRepository();
  
  // ✅ 2. INSTANCIAR EL SERVEI I INJECTAR-LO
  const foodService = new FoodKnowledgeService();
  const groupResolver = new BasicGroupResolver(foodService); // <--- Ara sí!

  const createRoom = new CreateDecisionRoom(roomRepo);
  const joinRoom = new JoinDecisionRoom(roomRepo);
  const resolveRoom = new ResolveGroupDecision(roomRepo, profileRepo, groupResolver);

  // --- DADES DE PROVA ---
  const users = [
    { id: crypto.randomUUID(), name: 'Alice (Vegan)', prefs: ['Salad', 'Tofu', 'Fruit'], excl: ['Meat'] },
    { id: crypto.randomUUID(), name: 'Bob (Meat Lover)', prefs: ['Burger', 'Steak', 'Pizza'], excl: ['Tofu'] },
    { id: crypto.randomUUID(), name: 'Charlie (Flexible)', prefs: ['Pizza', 'Salad', 'Sushi'], excl: [] }
  ];

  console.log('🎭 Creating fake profiles...');
  for (const u of users) {
    const profile = new PreferenceProfile({
      id: u.id,
      foodPreferences: u.prefs,
      socialTolerance: 5,
      exclusions: u.excl
    });
    // Nota: Assegura't que SupabasePreferenceRepository té el mètode 'save'.
    // Si no el té, hauràs de crear-lo o fer servir una inserció directa per al test.
    try {
        await profileRepo.save(profile);
    } catch (e) {
        console.warn(`⚠️ Could not save profile for ${u.name}. Check Repo implementation. Error:`, e);
    }
  }

  // 2. Crear Sala
  console.log('🏠 Creating Room...');
  const roomId = await createRoom.execute({ hostUserId: users[0].id, name: 'Team Lunch' });
  console.log(`   Room ID: ${roomId}`);

  // 3. Unir-se
  console.log('👋 Joining users...');
  // El host (Alice) ja hi és
  await joinRoom.execute({ roomId, userId: users[1].id }); // Bob
  await joinRoom.execute({ roomId, userId: users[2].id }); // Charlie

  // 4. Resoldre
  console.log('🧠 Resolving consensus...');
  try {
    const outcome = await resolveRoom.execute({ roomId, requesterUserId: users[0].id });
    
    console.log('\n=============================');
    console.log('🎉 FINAL VERDICT:', outcome.choice);
    console.log('📝 REASON:', outcome.reason);
    console.log('=============================\n');

  } catch (e) {
    console.error('❌ Failed:', e);
  }
}

main();