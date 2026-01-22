// =================== FILE: adapters/supabase/SupabaseDecisionRoomRepository.ts ===================

import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { createClient } from '@/adapters/supabase/server';
// ✅ IMPORTS CENTRALITZATS
import { DbRoomJoinResponse } from '@/adapters/supabase/types/database.dtos';
import { getCurrentUser } from '@/lib/auth/session';



interface DbRoom {
  id: string;
  host_user_id: string;
  invite_code: string;
  name: string;
  voting_mode: string;
  created_at: string;
  last_decision_at?: string | null; // ✅ IMPORTANT: Per gestionar el cooldown
  status?: string;
}


// -----------------------------------------------------------

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
        invite_code: room.inviteCode,
        name: room.name,
        voting_mode: room.votingMode,
        status: 'OPEN',
        // Nota: last_decision_at es gestiona per separat en fer decisions
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

  // 2. RECUPERAR SALA (AMB METADATA I SEGURETAT)
  async findById(id: string): Promise<DecisionRoom | null> {
    const supabase = await createClient();

    const user = await getCurrentUser();
    if (!user) return null;

    // ✅ QUERY OPTIMITZADA: Inclou 'metadata' a decisions
    const { data, error } = await supabase
      .from('decision_rooms')
      .select(`
        *,
        participants:room_participants(*),
        decisions:group_decisions(
            choice,
            reason,
            created_at,
            metadata  
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    const roomData = data as unknown as DbRoomJoinResponse;

    // 🛡️ TALLAFOCS: Només host o participants poden veure la sala
    const isHost = roomData.host_user_id === user.id;
    const isParticipant = roomData.participants.some((p) => p.user_id === user.id);

    if (!isHost && !isParticipant) {
      return null;
    }

    // Mapeig Participants
    const participantsList = roomData.participants.map((p) => ({
      userId: p.user_id,
      joinedAt: new Date(p.joined_at)
    }));

    // Assegurar que el host és a la llista (per coherència de domini)
    if (!participantsList.some((p) => p.userId === roomData.host_user_id)) {
      participantsList.push({
        userId: roomData.host_user_id,
        joinedAt: new Date(roomData.created_at)
      });
    }

    // Mapeig Historial (Inclou Metadata per a la UI)
    const historyList = (roomData.decisions || []).map((d) => ({
      choice: d.choice,
      reason: d.reason,
      generatedAt: new Date(d.created_at),
      metadata: d.metadata // ✅ PASSEM LA INFO DE LA RECEPTA AL DOMINI
    }));

    // Retornem Entitat de Domini Neta
    const room = new DecisionRoom({
      id: roomData.id,
      hostUserId: roomData.host_user_id,
      inviteCode: roomData.invite_code,
      name: roomData.name,
      votingMode: (roomData.voting_mode as 'BLIND' | 'PUBLIC') || 'BLIND',
      participants: participantsList,
      history: historyList
    });

    // Hidratem el lastDecisionAt si existeix (per gestionar cooldowns al domini)
    // ✅ CORRECCIÓ DEL HACK 'lastDecisionAt':
    // En lloc de '(room as any)', fem servir una Intersecció de Tipus.
    // Això li diu a TS: "Tracta room com si tingués lastDecisionAt, encara que l'entitat pública no ho mostri".
    if (roomData.last_decision_at) {
      (room as DecisionRoom & { lastDecisionAt: Date }).lastDecisionAt = new Date(roomData.last_decision_at);
    }
    return room;
  }

  // 3. GESTIÓ DE VOTACIONS I ESTAT
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

  // ✅ MILLORA: Reset complet (Esborrar historial + Resetear Timer)
  async clearHistory(roomId: string): Promise<void> {
    const supabase = await createClient();

    // 1. Esborrar decisions
    const { error: deleteError } = await supabase
      .from('group_decisions')
      .delete()
      .eq('room_id', roomId);

    if (deleteError) throw new Error(`Error clearing history: ${deleteError.message}`);

    // 2. Resetear el timestamp de l'última decisió (Evita l'error "Wait 105s")
    const { error: updateError } = await supabase
      .from('decision_rooms')
      .update({ last_decision_at: null })
      .eq('id', roomId);

    if (updateError) throw new Error(`Error reseting room timer: ${updateError.message}`);
  }

  async addParticipant(roomId: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('room_participants')
      .insert({ room_id: roomId, user_id: userId });

    // Ignorem l'error de duplicat (23505)
    if (error && error.code !== '23505') throw new Error(error.message);
  }

  async saveDecision(roomId: string, outcome: DecisionOutcome): Promise<void> {
    const supabase = await createClient();

    // Guardem la decisió i actualitzem el timestamp de la sala
    // Nota: Això és per decisions manuals. Les màgiques usen la seva pròpia acció.
    const { error } = await supabase
      .from('group_decisions')
      .insert({
        room_id: roomId,
        choice: outcome.choice,
        reason: outcome.reason,
        created_at: outcome.generatedAt.toISOString()
        // metadata: outcome.metadata // Si el teu ValueObject en té, posa-ho aquí
      });

    if (error) throw new Error(error.message);

    // Actualitzem el last_decision_at de la sala
    await supabase
      .from('decision_rooms')
      .update({ last_decision_at: new Date().toISOString() })
      .eq('id', roomId);
  }

  // 4. CERCA DE SALES PER USUARI
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
        const rawRoom = p.room as unknown as (DbRoom | DbRoom[] | null);
        if (!rawRoom) continue;

        const roomData = Array.isArray(rawRoom) ? rawRoom[0] : rawRoom;
        if (!roomData) continue;

        rooms.push(new DecisionRoom({
          id: roomData.id,
          hostUserId: roomData.host_user_id,
          inviteCode: roomData.invite_code,
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
