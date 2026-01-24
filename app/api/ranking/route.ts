import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/adapters/supabase/server';
import { container } from '@/services/container';
import { mapRankingEntryToPlayer } from '@/features/ranking/logic/mapRankingEntryToPlayer';

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0)
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query params' }, { status: 400 });
  }

  const { limit, offset } = parsed.data;
  const supabase = await createClient();
  const rankingRepo = container.getRankingRepository(supabase);

  const page = await rankingRepo.getPlayersPage(limit, offset);
  const players = page.players.map(mapRankingEntryToPlayer);

  return NextResponse.json({
    players,
    totalCount: page.totalCount,
    nextOffset: offset + players.length
  });
}
