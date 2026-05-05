import { getGames } from '../src/lib/api/rawg';
import { extractSteamAppId } from '../src/lib/api/steam';

process.env.RAWG_API_KEY = 'f92e6b1eb2bd45a382da698ccd1b5507';

async function run() {
  const data = await getGames({ search: 'grand theft auto v' });
  const game = data.results[0];
  console.log('Game:', game.name);
  console.log('Stores:', JSON.stringify(game.stores, null, 2));
  console.log('Extracted App ID:', extractSteamAppId(game));
}
run();
