import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { createClient } from '@/adapters/supabase/server';

// ✅ TIPUS DTO
type DbParticipant = {
  user_id: string;
  joined_at: string;
};



type DbDecision = {
  choice: string;
  reason: string;
  created_at: string;
};

// 🆕 Nuevo tipo para la Sala (snake_case como en DB)
type DbRoom = {
  id: string;
  host_user_id: string;
  name: string;
  voting_mode: string;
  created_at: string;
};
export class SupabaseDecisionRoomRepository implements DecisionRoomRepository {

  // 1. GUARDAR SALA + PARTICIPANTS
  async save(room: DecisionRoom): Promise<void> {
    const supabase = await createClient();

    // A) Guardem la Sala
    const { error: roomError } = await supabase
      .from('decision_rooms')
      .upsert({
        id: room.id,
        host_user_id: room.hostUserId,
        name: room.name,
        voting_mode: room.votingMode,
        status: 'OPEN'
      });

    if (roomError) throw new Error(roomError.message);

    // B) Guardem els Participants
    const participantsData = room.participants.map(p => ({
      room_id: room.id,
      user_id: p.userId,
      joined_at: p.joinedAt ? p.joinedAt.toISOString() : new Date().toISOString()
    }));

    const { error: partError } = await supabase
      .from('room_participants')
      .upsert(participantsData, { onConflict: 'room_id,user_id' });

    if (partError) throw new Error(`Error saving participants: ${partError.message}`);
  }

  // 2. RECUPERAR SALA
  async findById(id: string): Promise<DecisionRoom | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('decision_rooms')
      .select(`
        *,
        participants:room_participants(*),
        decisions:group_decisions(*) 
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    const participantsList: { userId: string; joinedAt: Date }[] = data.participants.map((p: DbParticipant) => ({
      userId: p.user_id,
      joinedAt: new Date(p.joined_at)
    }));

    const hostId = data.host_user_id;

    if (!participantsList.some((p) => p.userId === hostId)) {
      participantsList.push({ userId: hostId, joinedAt: new Date(data.created_at) });
    }

    const decisionsRaw = data.decisions as DbDecision[] | null;

    const historyList = (decisionsRaw || []).map((d: DbDecision) => ({
      choice: d.choice,
      reason: d.reason,
      generatedAt: new Date(d.created_at)
    }));

    return new DecisionRoom({
      id: data.id,
      hostUserId: hostId,
      name: data.name,
      votingMode: (data.voting_mode as 'BLIND' | 'PUBLIC') || 'BLIND',
      participants: participantsList,
      history: historyList
    });
  }

  // 3. ALTRES MÈTODES
  async setVotingMode(roomId: string, mode: 'BLIND' | 'PUBLIC'): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('decision_rooms')
      .update({ voting_mode: mode })
      .eq('id', roomId);
    if (error) throw new Error(`Error setting voting mode: ${error.message}`);
  }

  async removeParticipant(roomId: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('room_participants')
      .delete()
      .match({ room_id: roomId, user_id: userId });
    if (error) throw new Error(`Error removing participant: ${error.message}`);
  }

  async clearHistory(roomId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('group_decisions')
      .delete()
      .eq('room_id', roomId);
    if (error) throw new Error(`Error clearing history: ${error.message}`);
  }

  async addParticipant(roomId: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('room_participants')
      .insert({ room_id: roomId, user_id: userId });
    if (error && error.code !== '23505') throw new Error(error.message);
  }

  async saveDecision(roomId: string, outcome: DecisionOutcome): Promise<void> {
    const supabase = await createClient();
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

// ✅ 4. CERCA DE SALES PER USUARI (CORREGIT & TIPAT)
  async findByParticipantId(userId: string): Promise<DecisionRoom[]> {
    const supabase = await createClient();

    const { data: participations, error } = await supabase
      .from('room_participants')
      .select(`
        room_id,
        room:decision_rooms (*)
      `)
      .eq('user_id', userId)
      .order('joined_at', { ascending: false });

    if (error) {
       console.error("Error fetching user rooms:", error);
       return [];
    }
    
    const rooms: DecisionRoom[] = [];
    
    if (participations) {
        for (const p of participations) {
            // 🛡️ CORRECCIÓ: En lloc de 'any', usem una unió de tipus.
            // Diem: "Això és una DbRoom O BÉ un array de DbRoom".
            const rawRoom = p.room as DbRoom | DbRoom[]; 
            
            // TypeScript ara sap que rawRoom pot ser un array, així que Array.isArray funciona.
            // Si és array, agafem el primer element. Si és objecte, l'agafem directament.
            const roomData = Array.isArray(rawRoom) ? rawRoom[0] : rawRoom;
            
            if (!roomData) continue; 
            
            rooms.push(new DecisionRoom({
                id: roomData.id,
                hostUserId: roomData.host_user_id,
                name: roomData.name,
                votingMode: (roomData.voting_mode as 'BLIND' | 'PUBLIC') || 'BLIND',
                participants: [], 
                history: []       
            }));
        }
    }

    return rooms;
  }
}