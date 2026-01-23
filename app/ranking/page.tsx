import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { RankingView } from '@/features/ranking/components/RankingView';
import { Player } from '@/core/domain/entities/Player';
import { getCurrentUser } from '@/lib/auth/session';

export const revalidate = 60; 

// 1. Definim el contracte del que ve del Repositori (DTO)
// Això documenta què esperem exactament de la capa d'infraestructura
interface RankingDTO {
  userId?: string;
  id?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  qualityScore?: number;
  pantryScore?: number;
  wins?: number;
  rank?: number;
}

// 2. Mapper amb tipatge estricte
const toPlayer = (entry: RankingDTO): Player => {
  return {
    // Prioritzem userId, si no existeix, provem id. Si cap existeix, string buit (o gestionar error)
    id: entry.userId ?? entry.id ?? '', 
    
    // Mateixa lògica per al nom
    username: entry.displayName ?? entry.username ?? 'Anònim',
    
    avatarUrl: entry.avatarUrl,
    
    // Càlcul segur de la puntuació
    score: (entry.qualityScore ?? 0) + (entry.pantryScore ?? 0), 
    
    wins: entry.wins ?? 0,
    rank: entry.rank
  };
};

export default async function RankingPage() {
    const supabase = await createClient();
    const rankingRepo = container.getRankingRepository(supabase);
    
    const [rawTopPlayers, user] = await Promise.all([
        rankingRepo.getTopPlayers(50),
        getCurrentUser()
    ]);

    // Convertim forçant el tipus d'entrada al nostre DTO
    // Això és segur perquè el mapper gestiona els undefineds amb '??'
    const topPlayers: Player[] = (rawTopPlayers as unknown as RankingDTO[]).map(toPlayer);

    const podiumPlayers = topPlayers.slice(0, 3);
    const listPlayers = topPlayers.slice(3);

    return (
        <RankingView 
            podiumPlayers={podiumPlayers}
            listPlayers={listPlayers}
            currentUserId={user?.id}
            totalPlayersCount={topPlayers.length}
        />
    );
}
