# Ranking

Objectiu:
Definir com es calcula la puntuacio del ranking i com es mostra a la UI.

## Fonts de dades

- `RankingRepository.getTopPlayers` retorna la llista de jugadors amb `qualityScore`, `pantryScore`, `communityScore`.
- `app/ranking/page.tsx` mapeja el DTO a `Player` i calcula `score`.

## Formula de puntuacio

Total = qualityScore + pantryScore + communityScore

Notes:
- Qualsevol valor absent es tracta com 0.
- El calcul centralitzat es `sumRankingScore` a `features/ranking/logic/score.ts`.

## UI i explicacio

- `RankingView` mostra podi i llista.
- El boto `TourTrigger` obre un dialeg informatiu (`RankingInfoDialog`).
- Textos del dialeg a `lib/i18n/locales/{ca,es,en}.ts` sota `ranking.info_*`.

## Paginacio

- `app/ranking/page.tsx` carrega el podi (top 3) i la primera pagina de 20 jugadors.
- La resta es carrega via `GET /api/ranking?offset=...&limit=20` quan l'usuari fa scroll.
- El total ve de `RankingRepository.getPlayersPage`.

## Testing

- `features/ranking/__tests__/score.test.ts` cobreix la suma de puntuacions.
- Executa `pnpm test:ci -- features/ranking/__tests__/score.test.ts`.
