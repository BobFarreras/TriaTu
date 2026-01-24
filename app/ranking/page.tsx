import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { RankingView } from '@/features/ranking/components/RankingView';
import { OnboardingProvider } from '@/components/onboarding/OnboardingContext';
import { getCurrentUser } from '@/lib/auth/session';
import { mapRankingEntryToPlayer } from '@/features/ranking/logic/mapRankingEntryToPlayer';

export const revalidate = 60; 

export default async function RankingPage() {
    const supabase = await createClient();
    const rankingRepo = container.getRankingRepository(supabase);
    
    const [podiumEntries, listPage, user] = await Promise.all([
        rankingRepo.getTopPlayers(3),
        rankingRepo.getPlayersPage(20, 3),
        getCurrentUser()
    ]);

    const podiumPlayers = podiumEntries.map(mapRankingEntryToPlayer);
    const listPlayers = listPage.players.map(mapRankingEntryToPlayer);

    return (
        <OnboardingProvider>
            <RankingView 
                podiumPlayers={podiumPlayers}
                listPlayers={listPlayers}
                currentUserId={user?.id}
                totalPlayersCount={listPage.totalCount}
            />
        </OnboardingProvider>
    );
}
