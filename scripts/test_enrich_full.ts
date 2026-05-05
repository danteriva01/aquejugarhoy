// @ts-nocheck
import { Game } from '../src/lib/api/types';
import { enrichGamesWithSteamData } from '../src/lib/api/steam';

async function run() {
  const mockGames: Game[] = [
    {
      id: 1,
      slug: 'warhammer',
      name: 'Warhammer 40,000',
      released: '2004',
      tba: false,
      background_image: '',
      rating: 4.8,
      rating_top: 5,
      ratings_count: 100,
      reviews_text_count: 10,
      added: 100,
      added_by_status: {},
      metacritic: 80,
      playtime: 10,
      suggestions_count: 100,
      updated: '2024',
      platforms: [],
      parent_platforms: [],
      genres: [],
      stores: [{ id: 1, store: { id: 1, name: 'Steam', slug: 'steam', domain: 'steam', games_count: 1, image_background: '' }, url: 'https://store.steampowered.com/app/4570/' }],
      tags: [],
      esrb_rating: null,
      short_screenshots: []
    }
  ];

  const enriched = await enrichGamesWithSteamData(mockGames);
  console.log(JSON.stringify(enriched[0].priceInfo, null, 2));
}

run();
