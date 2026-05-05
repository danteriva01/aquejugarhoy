import { getGames } from '../src/lib/api/rawg';

async function test() {
  const games = await getGames({ page_size: 5 });
  console.log("Found games:", games.results.map(g => g.name));

  const appIds = games.results.map(g => {
    const steamStore = g.stores?.find(s => s.store.slug === 'steam');
    if (!steamStore?.url) return null;
    // URL is usually https://store.steampowered.com/app/12345/...
    const match = steamStore.url.match(/\/app\/(\d+)/);
    return match ? match[1] : null;
  }).filter(Boolean);

  console.log("Extracted Steam AppIDs:", appIds);

  if (appIds.length > 0) {
    const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${appIds.join(',')}&filters=price_overview`;
    console.log("Fetching from Steam:", steamUrl);
    const res = await fetch(steamUrl);
    const data = await res.json();
    console.log("Steam Data:", JSON.stringify(data, null, 2));
  }
}

test().catch(console.error);
