import { getGames } from '../src/lib/api/rawg';
import { enrichGamesWithSteamData } from '../src/lib/api/steam';
import { sortGamesByScore } from '../src/lib/scoring';

async function run() {
  console.log('Fetching from RAWG with tags=party-game, ordering=-rating...');
  const data = await getGames({
    platforms: '4',
    ordering: '-rating',
    tags: 'party-game',
    page_size: 40
  });

  console.log(`Found ${data.count} games total. Fetched ${data.results.length}.`);
  console.log('Top 10 raw results from RAWG:');
  data.results.slice(0, 10).forEach(g => {
    console.log(`- ${g.name} (Rating: ${g.rating}, Tags: ${g.tags?.map(t => t.slug).slice(0, 3).join(',')})`);
  });

  console.log('\nEnriching with Steam...');
  const enriched = await enrichGamesWithSteamData(data.results);

  console.log('\nScoring for Amigos > 5+ > Party > Mixed...');
  const context = {
    withWhom: 'amigos',
    playerCount: '5+',
    gameStyle: 'party',
    budget: 'mixed'
  };

  const scored = sortGamesByScore(enriched, context);

  console.log(`\nTop scored games (${scored.length} passed > 0 score filter):`);
  scored.slice(0, 10).forEach(g => {
    console.log(`[Score: ${g._score}] ${g.name} - Reasons: ${g._matchReasons.join(', ')}`);
  });
}

run().catch(console.error);
