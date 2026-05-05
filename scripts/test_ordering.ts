import { getGames } from '../src/lib/api/rawg';
import { enrichGamesWithSteamData } from '../src/lib/api/steam';
import { sortGamesByScore } from '../src/lib/scoring';

async function run() {
  console.log('Fetching co-op games ordered by -added...');
  const data = await getGames({ platforms: '4', ordering: '-added', tags: 'co-op', page_size: 40 });
  
  const enriched = await enrichGamesWithSteamData(data.results);
  
  const context = {
    withWhom: 'amigos',
    playerCount: '2-4',
    gameStyle: 'coop-fun',
    budget: 'mixed'
  };

  const scored = sortGamesByScore(enriched, context);

  console.log('\nTop scored games for coop-fun:');
  scored.slice(0, 15).forEach(g => {
    console.log(`[Score: ${g._score}] ${g.name} - ${g._matchReasons.join(', ')}`);
  });
}

run().catch(console.error);
