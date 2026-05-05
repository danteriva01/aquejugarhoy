import { getGames } from '../src/lib/api/rawg';
import { enrichGamesWithSteamData } from '../src/lib/api/steam';

process.env.RAWG_API_KEY = 'f92e6b1eb2bd45a382da698ccd1b5507';

async function run() {
  console.log("Fetching games...");
  const data = await getGames({ page_size: 5, search: 'warhammer' });
  console.log(`Fetched ${data.results.length} games. Enriching...`);
  
  const enriched = await enrichGamesWithSteamData(data.results);
  
  enriched.forEach(g => {
    console.log(`Game: ${g.name}`);
    console.log(`  Steam AppID:`, g.stores?.find(s => s.store.slug === 'steam')?.url?.match(/\/app\/(\d+)/)?.[1]);
    console.log(`  PriceInfo:`, g.priceInfo);
  });
}

run().catch(console.error);
