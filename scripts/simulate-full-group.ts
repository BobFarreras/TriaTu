// scripts/simulate-full-group.ts
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

  const profileRepo = new SupabasePreferenceRepository();
  const roomRepo = new SupabaseDecisionRoomRepository();
  const groupResolver = new BasicGroupResolver();

  const createRoom = new CreateDecisionRoom(roomRepo);
  const joinRoom = new JoinDecisionRoom(roomRepo);
  const resolveRoom = new ResolveGroupDecision(roomRepo, profileRepo, groupResolver);

  // 1. Crear Usuaris Ficticis (Actors)
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
    await profileRepo.save(profile); // Assegura't que tens aquest mètode al repo
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

    /* Analisi esperat:
       Alice vol: Salad, Tofu, Fruit. Exclou: Meat
       Bob vol: Burger, Steak, Pizza. Exclou: Tofu
       Charlie vol: Pizza, Salad, Sushi.
       
       Intersecció:
       - Pizza: Bob (Si), Charlie (Si), Alice (No, però no Exclou explícitament 'Pizza' tret que porti Meat)
       - Salad: Alice (Si), Charlie (Si), Bob (No, no exclou)
       
       Depenent de l'ordre o l'algoritme, hauria de sortir Salad o Pizza.
    */

  } catch (e) {
    console.error('❌ Failed:', e);
  }
}

main();