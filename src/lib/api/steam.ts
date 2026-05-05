import type { Game, GamePriceInfo, GameDetail } from './types';
import { getGameBySlug } from './rawg';
import { translateSteamRating } from '@/lib/utils';

// Global in-memory cache to avoid redundant API calls
const priceCache = new Map<string, GamePriceInfo | null>();

/**
 * Extracts Steam AppID from RAWG game data
 */
export function extractSteamAppId(game: Game | GameDetail): string | null {
  if (!game.stores) return null;
  const steamStore = game.stores.find(s => s.store.slug === 'steam' || s.store.id === 1);
  if (!steamStore || !steamStore.url) return null;
  
  // Match both store.steampowered.com/app/123/ and steamcommunity.com/app/123/
  const match = steamStore.url.match(/\/app\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Fetches user rating summary from Steam
 */
async function fetchSteamRating(appId: string): Promise<{ text: string; percent: number; totalReviews: number } | null> {
  try {
    const url = `https://store.steampowered.com/appreviews/${appId}?json=1&language=spanish&purchase_type=all`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.success && data.query_summary) {
      const summary = data.query_summary;
      return {
        text: translateSteamRating(summary.review_score_desc || 'Sin reseñas'),
        percent: summary.total_reviews > 0 ? Math.round((summary.total_positive / summary.total_reviews) * 100) : 0,
        totalReviews: summary.total_reviews || 0
      };
    }
  } catch (e) {
    console.warn(`Failed to fetch rating for ${appId}`);
  }
  return null;
}

/**
 * Helper to fetch prices from Steam Store API for a single AppID
 * Includes a small delay to respect rate limits when called in sequence
 */
async function fetchSteamPrice(appId: string): Promise<GamePriceInfo | null> {
  // Check cache first
  if (priceCache.has(appId)) return priceCache.get(appId) || null;

  try {
    const cc = process.env.NEXT_PUBLIC_STEAM_CC || 'ar'; // Default to Argentina for LATAM regional pricing
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&filters=price_overview,basic&cc=${cc}`;
    
    // Fetch price and rating in parallel
    const [priceRes, ratingData] = await Promise.all([
      fetch(url, {
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      }),
      fetchSteamRating(appId)
    ]);

    if (!priceRes.ok) return null;
    const data = await priceRes.json();
    
    if (data && data[appId] && data[appId].success && data[appId].data) {
      const details = data[appId].data;
      const isFree = details.is_free === true;
      const po = details.price_overview;

      let priceInfo: GamePriceInfo | null = null;

      if (isFree) {
        priceInfo = {
          normalPrice: 0,
          salePrice: 0,
          discountPercent: 0,
          isFree: true,
          isOnSale: false,
          dealUrl: `https://store.steampowered.com/app/${appId}/`,
          steamRatingText: ratingData?.text,
          steamRatingPercent: ratingData?.percent,
          steamRatingCount: ratingData?.totalReviews,
        };
      } else if (po) {
        priceInfo = {
          normalPrice: po.initial / 100,
          salePrice: po.final / 100,
          discountPercent: po.discount_percent,
          isFree: false,
          isOnSale: po.discount_percent > 0,
          dealUrl: `https://store.steampowered.com/app/${appId}/`,
          steamRatingText: ratingData?.text,
          steamRatingPercent: ratingData?.percent,
          steamRatingCount: ratingData?.totalReviews,
        };
      }

      priceCache.set(appId, priceInfo);
      return priceInfo;
    }
  } catch (error) {
    console.error(`Error fetching price for ${appId}:`, error);
  }

  return null;
}

/**
 * Fallback: Search for a game by name to find its Steam AppID
 */
async function findSteamAppIdByName(name: string): Promise<string | null> {
  try {
    const cc = process.env.NEXT_PUBLIC_STEAM_CC || 'ar';
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(name)}&l=english&cc=${cc}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data && data.items && data.items.length > 0) {
      // Find exact or closest match
      const exactMatch = data.items.find((item: any) => 
        item.name.toLowerCase() === name.toLowerCase()
      );
      return exactMatch ? String(exactMatch.id) : String(data.items[0].id);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

/**
 * Enriches an array of Games with pricing data.
 * Optimized with batching and concurrency control.
 */
export async function enrichGamesWithSteamData<T extends Game>(
  games: T[], 
  options: { fastMode?: boolean; limit?: number } = {}
): Promise<T[]> {
  if (!games || games.length === 0) return games;

  const { fastMode = false, limit = 24 } = options;
  const gamesToProcess = games.slice(0, limit);
  
  // Process in chunks of 8 for better parallelization
  const CHUNK_SIZE = 8;
  const enrichedGames = [...games];

  for (let i = 0; i < Math.min(enrichedGames.length, limit); i += CHUNK_SIZE) {
    const chunk = enrichedGames.slice(i, i + CHUNK_SIZE);
    
    await Promise.all(chunk.map(async (game) => {
      if (game.priceInfo) return;

      let appId = extractSteamAppId(game);
      
      // Fallback: If no AppID but it's marked as a Steam game, fetch full detail
      if (!appId && !fastMode && game.stores?.some(s => s.store.slug === 'steam' || s.store.id === 1)) {
        try {
          const detail = await getGameBySlug(game.slug);
          appId = extractSteamAppId(detail);
        } catch (e) {}
      }

      // Final Fallback: Search by name if still no AppID
      if (!appId && !fastMode) {
        appId = await findSteamAppIdByName(game.name);
      }

      if (appId) {
        game.steamAppId = appId;
        game.priceInfo = (await fetchSteamPrice(appId)) || undefined;
      }
    }));

    // Small delay between chunks to respect Steam API
    if (i + CHUNK_SIZE < gamesToProcess.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  return enrichedGames;
}

