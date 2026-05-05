import type {
  PaginatedResponse,
  Game,
  GameDetail,
  Screenshot,
  Trailer,
  Genre,
  Platform,
  GameQueryParams,
} from './types';
import { enrichGamesWithSteamData } from './steam';

const BASE_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.RAWG_API_KEY;

async function fetchRAWG<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('key', API_KEY || '');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`RAWG API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ===== Games (PC-only by default) =====

export async function getGames(params: GameQueryParams & { hardware?: string } = {}): Promise<PaginatedResponse<Game>> {
  const { hardware, ...restParams } = params;
  let pcParams: Record<string, any> = { platforms: '4', ...restParams };

  // Handle hardware filtering
  if (hardware === 'low') {
    // Low-end PC: append 'indie' or '2d' tag, or older games
    const existingTags = pcParams.tags ? String(pcParams.tags).split(',') : [];
    if (!existingTags.includes('indie')) {
      existingTags.push('indie');
    }
    pcParams.tags = existingTags.join(',');
    pcParams.dates = '1990-01-01,2016-12-31'; // Max 2016
  } else if (hardware === 'mid') {
    // Mid-range PC: max 2021
    pcParams.dates = '2000-01-01,2021-12-31';
  }

  return fetchRAWG<PaginatedResponse<Game>>('/games', pcParams);
}

export async function getGameBySlug(slug: string): Promise<GameDetail> {
  return fetchRAWG<GameDetail>(`/games/${slug}`);
}

export async function getCuratedGames(slugs: string[]): Promise<Game[]> {
  const results = await Promise.all(
    slugs.map(slug => getGameBySlug(slug).catch(() => null))
  );
  return results.filter((g): g is GameDetail => g !== null);
}

export async function getGameScreenshots(id: number): Promise<PaginatedResponse<Screenshot>> {
  return fetchRAWG<PaginatedResponse<Screenshot>>(`/games/${id}/screenshots`);
}

export async function getGameTrailers(id: number): Promise<PaginatedResponse<Trailer>> {
  return fetchRAWG<PaginatedResponse<Trailer>>(`/games/${id}/movies`);
}

export async function getSimilarGames(id: number, pageSize = 6): Promise<PaginatedResponse<Game>> {
  return fetchRAWG<PaginatedResponse<Game>>(`/games/${id}/suggested`, { page_size: pageSize });
}

// ===== Genres & Platforms =====

export async function getGenres(): Promise<PaginatedResponse<Genre>> {
  return fetchRAWG<PaginatedResponse<Genre>>('/genres', { page_size: 40 });
}

export async function getPlatforms(): Promise<PaginatedResponse<Platform>> {
  return fetchRAWG<PaginatedResponse<Platform>>('/platforms', { page_size: 50, ordering: '-games_count' });
}

// ===== Convenience functions for Home page sections =====

export async function getTrendingGames(pageSize = 12): Promise<Game[]> {
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const dates = `${monthAgo.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`;

  const data = await getGames({
    ordering: '-added',
    dates,
    page_size: pageSize,
  });
  return enrichGamesWithSteamData(data.results);
}

export async function getPopularGames(pageSize = 12): Promise<Game[]> {
  const data = await getGames({
    ordering: '-added',
    metacritic: '80,100',
    page_size: pageSize,
  });
  return enrichGamesWithSteamData(data.results);
}

export async function getFreeToPlayGames(pageSize = 12): Promise<Game[]> {
  const data = await getGames({
    tags: 'free-to-play',
    ordering: '-added',
    page_size: 30, // Fetch more to ensure we have enough after filtering
  });
  
  const enrichedGames = await enrichGamesWithSteamData(data.results);
  
  // Cross-validate with Steam data: only keep games explicitly marked as free or 0 price.
  // If Steam API failed (no priceInfo), we tentatively keep it to avoid empty lists.
  const verifiedFreeGames = enrichedGames.filter(game => {
    if (!game.priceInfo) return true; 
    return game.priceInfo.isFree || game.priceInfo.salePrice === 0;
  });

  return verifiedFreeGames.slice(0, pageSize);
}

export async function getCoopGames(pageSize = 12): Promise<Game[]> {
  const data = await getGames({
    tags: 'co-op',
    ordering: '-added',
    page_size: pageSize,
  });
  return enrichGamesWithSteamData(data.results);
}

export async function getNewReleases(pageSize = 12): Promise<Game[]> {
  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const dates = `${threeMonthsAgo.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`;

  const data = await getGames({
    ordering: '-released',
    dates,
    page_size: pageSize,
  });
  return enrichGamesWithSteamData(data.results);
}

export async function getRandomGame(params: GameQueryParams = {}): Promise<Game | null> {
  const randomPage = Math.floor(Math.random() * 10) + 1;
  const data = await getGames({
    ...params,
    page: randomPage,
    page_size: 1,
    ordering: '-rating',
  });
  const enriched = await enrichGamesWithSteamData(data.results);
  return enriched[0] || null;
}
