import fs from 'fs';
import path from 'path';
import { getGameBySlug } from '../src/lib/api/rawg';
import { enrichGamesWithSteamData } from '../src/lib/api/steam';
import type { Game } from '../src/lib/api/types';

const rawDatasetPath = path.join(process.cwd(), 'dataset_videojuegos.json');
const outputPath = path.join(process.cwd(), 'src', 'lib', 'data', 'curated_games.json');

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Special overrides for names that don't slugify perfectly to RAWG
const SLUG_OVERRIDES: Record<string, string> = {
  "Lego Star Wars: The Skywalker Saga": "lego-star-wars-the-skywalker-saga",
  "Lego Harry Potter Collection": "lego-harry-potter-collection",
  "Phogs!": "phogs",
  "Phasmophobia": "phasmophobia",
  "Don't Starve Together": "dont-starve-together",
  "Warhammer 40,000: Darktide": "warhammer-40000-darktide",
  "Warhammer 40,000: Space Marine 2": "warhammer-40000-space-marine-2",
  "God of War (2018)": "god-of-war-2",
  "Prey (2017)": "prey",
  "DOOM (2016)": "doom-2",
  "Tomb Raider (2013)": "tomb-raider"
};

async function buildDb() {
  const rawData = JSON.parse(fs.readFileSync(rawDatasetPath, 'utf-8'));
  console.log(`Starting to fetch ${rawData.length} games...`);

  let finalGames = [];
  
  // Batch size 10
  for (let i = 0; i < rawData.length; i += 10) {
    const batch = rawData.slice(i, i + 10);
    console.log(`Processing batch ${i / 10 + 1} of ${Math.ceil(rawData.length / 10)}...`);
    
    const fetchedGames = await Promise.all(batch.map(async (item: any) => {
      const slug = SLUG_OVERRIDES[item.nombre] || slugify(item.nombre);
      try {
        const gameData = await getGameBySlug(slug);
        if (!gameData) throw new Error("Not found");
        return {
          ...gameData,
          _curatedContext: item
        };
      } catch (err) {
        console.warn(`Failed to fetch: ${item.nombre} (Slug: ${slug})`);
        
        // Try simple search if slug fails
        try {
           const searchRes = await fetch(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(item.nombre)}&page_size=1`);
           const searchData = await searchRes.json();
           if (searchData.results && searchData.results.length > 0) {
             const bestMatch = searchData.results[0];
             return {
               ...bestMatch,
               _curatedContext: item
             };
           }
        } catch(e) {}
        
        return null;
      }
    }));
    
    const validGames = fetchedGames.filter(g => g !== null);
    
    // Enrich with Steam
    const enrichedBatch = await enrichGamesWithSteamData(validGames);
    finalGames.push(...enrichedBatch);
    
    // Avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }

  // Ensure directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(finalGames, null, 2));
  console.log(`Done! Saved ${finalGames.length} games to curated_games.json`);
}

buildDb().catch(console.error);
