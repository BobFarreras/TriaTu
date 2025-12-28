import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { supabase } from './client';

// Tipus per a la resposta del JOIN (incloent historial)
type RoomDB = {
  id: string;
  host_user_id: string;
  name: string;
  // Status pot venir de DB però l'ignorem al domini
  room_participants: { user_id: string }[];
  group_decisions: { choice: string; reason: string; created_at: string }[];
};

export class SupabaseDecisionRoomRepository implements DecisionRoomRepository {
  
  async save(room: DecisionRoom): Promise<void> {
    const { error } = await supabase
      .from('decision_rooms')
      .upsert({
        id: room.id,
        host_user_id: room.hostUserId,
        name: room.name,
        status: 'OPEN' // Hardcoded perquè la DB ho requereix (NOT NULL), però el domini ho ignora
      });
    if (error) throw new Error(error.message);
  }

  async addParticipant(roomId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('room_participants')
      .insert({ room_id: roomId, user_id: userId });
    
    // Ignorem error 23505 (unique violation) si ja hi és
    if (error && error.code !== '23505') throw new Error(error.message);
  }

  async saveDecision(roomId: string, outcome: DecisionOutcome): Promise<void> {
    const { error } = await supabase
      .from('group_decisions')
      .insert({
        room_id: roomId,
        choice: outcome.choice,
        reason: outcome.reason,
        created_at: outcome.generatedAt.toISOString()
      });
    if (error) throw new Error(error.message);
  }

  async findById(id: string): Promise<DecisionRoom | null> {
    // Carreguem Sala + Participants + Historial (últims 10)
    const { data, error } = await supabase
      .from('decision_rooms')
      .select(`
        *, 
        room_participants(user_id),
        group_decisions(choice, reason, created_at)
      `) 
      .eq('id', id)
      .order('created_at', { foreignTable: 'group_decisions', ascending: false })
      .limit(10, { foreignTable: 'group_decisions' })
      .single();

    if (error || !data) return null;

    const roomData = data as unknown as RoomDB;

    // Creem l'entitat SENSE passar status
    const room = new DecisionRoom({
      id: roomData.id,
      hostUserId: roomData.host_user_id,
      name: roomData.name
    });

    // Participants
    if (roomData.room_participants) {
      roomData.room_participants.forEach(p => room.addParticipant(p.user_id));
    }

    // Historial
    if (roomData.group_decisions) {
        const history = roomData.group_decisions.map(d => new DecisionOutcome({
            choice: d.choice,
            reason: d.reason,
            // Podríem passar la data si modifiquem DecisionOutcome, però per ara es generarà "ara"
            // Si vols ser precís amb la data, hauríem d'actualitzar DecisionOutcome.ts
        }));
        room.loadHistory(history);
    }

    return room;
  }
}