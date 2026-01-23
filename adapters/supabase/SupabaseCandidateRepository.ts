import { CandidateRepository } from "@/core/ports/CandidateRepository";
import { createClient } from "@/adapters/supabase/server";
import { Candidate } from "@/core/domain/entities/Candidate";

// DTO per a TypeScript
interface CandidateRow {
    id: string;
    room_id: string;
    user_id: string;
    content: string;
}

export class SupabaseCandidateRepository implements CandidateRepository {

    // 1. AFEGIR
    async add(roomId: string, userId: string, content: string): Promise<void> {
        const supabase = await createClient();
        
        const { error } = await supabase
            .from('room_candidates') // ✅ TAULA ORIGINAL
            .insert({ room_id: roomId, user_id: userId, content });

        if (error) throw new Error(error.message);
    }

    // 2. LLISTAR
    async getAllForRoom(roomId: string): Promise<Candidate[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('room_candidates') // ✅ TAULA ORIGINAL
            .select('*')
            .eq('room_id', roomId)
            .returns<CandidateRow[]>();

        if (error) throw new Error(error.message);

        return (data || []).map((d) => ({
            id: d.id,
            roomId: d.room_id,
            userId: d.user_id,
            content: d.content
        }));
    }
    
    // 3. ESBORRAR (PER ID)
    // Ajustem la signatura per complir amb la teva interfície: (candidateId, userId)
    async deleteById(candidateId: string, userId: string): Promise<void> {
        void userId;
        const supabase = await createClient();
        
        const { error } = await supabase
            .from('room_candidates') // ✅ TAULA ORIGINAL
            .delete()
            .eq('id', candidateId);
            // .eq('user_id', userId) // Descomenta si no tens RLS i vols seguretat extra

        if (error) throw new Error(error.message);
    }

    // 4. ESBORRAR TOTS (Per neteja de sala)
    async deleteAllForRoom(roomId: string): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from('room_candidates') // ✅ TAULA ORIGINAL
            .delete()
            .eq('room_id', roomId);

        if (error) throw new Error(error.message);
    }
}
