import { CandidateRepository } from "@/core/ports/CandidateRepository";
import { createClient } from "@/adapters/supabase/server";
import { Candidate } from "@/core/domain/entities/Candidate";

// ✅ DEFINIM LA FORMA DE LA TAULA (DTO)
interface CandidateRow {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
}

export class SupabaseCandidateRepository implements CandidateRepository {

    async add(roomId: string, userId: string, content: string): Promise<void> {
        const supabase = await createClient();

        console.log(`🛠️ [REPO] Intentant INSERT amb user: ${userId}`);

        const { error } = await supabase
            .from('room_candidates')
            .insert({ room_id: roomId, user_id: userId, content });

        if (error) {
            console.error(`⛔ [DB ERROR]`, error);
            throw new Error(error.message);
        }
    }

    async getAllForRoom(roomId: string): Promise<Candidate[]> {
        const supabase = await createClient();

        // Tipem la resposta de Supabase amb <CandidateRow[]>
        const { data, error } = await supabase
            .from('room_candidates')
            .select('*')
            .eq('room_id', roomId)
            .returns<CandidateRow[]>(); // <--- TRUC MÀGIC PER EVITAR ANY

        if (error) throw new Error(error.message);

        // Ara 'd' ja té tipus CandidateRow, no cal 'any'
        return (data || []).map((d) => ({
            id: d.id,
            roomId: d.room_id,
            userId: d.user_id,
            content: d.content
        }));
    }
    
    async deleteById(candidateId: string, userId: string): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from('room_candidates')
            .delete()
            .eq('id', candidateId)
            .eq('user_id', userId);

        if (error) throw new Error(error.message);
    }

    async deleteAllForRoom(roomId: string): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from('room_candidates')
            .delete()
            .eq('room_id', roomId);

        if (error) throw new Error(error.message);
    }
}