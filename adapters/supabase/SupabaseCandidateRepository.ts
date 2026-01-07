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

        const { data, error } = await supabase
            .from('room_candidates')
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
    
    // ⚠️ AQUI ESTAVA EL PROBLEMA ⚠️
    async deleteById(candidateId: string): Promise<void> {
        const supabase = await createClient();
        
        // CORRECCIÓ:
        // 1. Traiem .eq('user_id', userId) -> L'RLS ja decidirà si tens permís.
        // 2. Afegim count: 'exact' -> Per saber si realment s'ha esborrat.
        
        const { error, count } = await supabase
            .from('room_candidates')
            .delete({ count: 'exact' }) 
            .eq('id', candidateId);
            // .eq('user_id', userId);  <-- ELIMINAT! L'Admin no és el propietari, però pot esborrar.

        if (error) throw new Error(error.message);

        // Si count és 0, vol dir que l'RLS t'ha bloquejat o la ID no existeix
        if (count === 0) {
            throw new Error("No tens permís per esborrar aquesta opció o ja no existeix.");
        }
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