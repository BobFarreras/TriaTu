// =================== FILE: adapters/supabase/SupabaseDecisionRoomRepository.ts ===================

import { DecisionRoomRepository } from '@/core/ports/DecisionRoomRepository';
import { DecisionRoom } from '@/core/domain/entities/DecisionRoom';
import { DecisionOutcome } from '@/core/domain/value-objects/DecisionOutcome';
import { createClient } from '@/adapters/supabase/server';

// --- TIPUS ESTRUCTURALS DE BASE DE DADES (Sense 'any') ---

interface DbParticipant {
  user_id: string;
  joined_at: string;
}

interface DbDecision {
  choice: string;
  reason: string;
  created_at: string;
}

interface DbRoom {
  id: string;
  host_user_id: string;
  name: string;
  voting_mode: string;
  created_at: string;
  status?: string;
}

// Tipus compost per a la resposta del JOIN de Supabase
interface DbRoomJoinResponse extends DbRoom {
  participants: DbParticipant[];
  decisions: DbDecision[];
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

  // 2. RECUPERAR SALA (AMB SEGURETAT BLINDADA)
  async findById(id: string): Promise<DecisionRoom | null> {
    const supabase = await createClient();

    // A. Obtenim l'usuari actual per validar permisos al codi
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    // B. Consulta a Supabase
    // Usem .returns<DbRoomJoinResponse>() si volem forçar el tipus, o fem casting manual segur.
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

    // Casting segur del resultat del JOIN
    const roomData = data as unknown as DbRoomJoinResponse;

    // C. 🛡️ TALLAFOCS DE SEGURETAT (APP LAYER CHECK)
    // Verifiquem manualment que l'usuari té dret a veure això.
    // Això ens protegeix si l'RLS estigués mal configurat.
    
    const isHost = roomData.host_user_id === user.id;
    const isParticipant = roomData.participants.some((p) => p.user_id === user.id);

    if (!isHost && !isParticipant) {
        // Retornem null silenciosament. Per al UseCase, la sala no existeix.
        return null;
    }

    // D. Mapeig a Entitat de Domini
    const participantsList = roomData.participants.map((p) => ({
      userId: p.user_id,
      joinedAt: new Date(p.joined_at)
    }));

    // Assegurar que el host és a la llista (per coherència)
    if (!participantsList.some((p) => p.userId === roomData.host_user_id)) {
      participantsList.push({ 
        userId: roomData.host_user_id, 
        joinedAt: new Date(roomData.created_at) 
      });
    }

    const historyList = (roomData.decisions || []).map((d) => ({
      choice: d.choice,
      reason: d.reason,
      generatedAt: new Date(d.created_at)
    }));

    return new DecisionRoom({
      id: roomData.id,
      hostUserId: roomData.host_user_id,
      name: roomData.name,
      votingMode: (roomData.voting_mode as 'BLIND' | 'PUBLIC') || 'BLIND',
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
    
    // Ignorem l'error de duplicat (23505)
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

  // 4. CERCA DE SALES PER USUARI (TIPAT CORRECTAMENT)
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
            // Unió de tipus per gestionar si Supabase retorna objecte o array
            const rawRoom = p.room as unknown as (DbRoom | DbRoom[] | null);
            
            if (!rawRoom) continue;

            const roomData = Array.isArray(rawRoom) ? rawRoom[0] : rawRoom;
            
            // Protecció addicional per si roomData fos null
            if (!roomData) continue;
            
            rooms.push(new DecisionRoom({
                id: roomData.id,
                hostUserId: roomData.host_user_id,
                name: roomData.name,
                votingMode: (roomData.voting_mode as 'BLIND' | 'PUBLIC') || 'BLIND',
                participants: [], // A la llista resum no carreguem tots els participants
                history: []       
            }));
        }
    }

    return rooms;
  }
}