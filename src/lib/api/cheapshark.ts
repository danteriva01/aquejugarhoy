import type { CheapSharkDeal, CheapSharkGameSearch } from './types';

const BASE_URL = 'https://www.cheapshark.com/api/1.0';

async function fetchCheapShark<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 1800 }, // Cache for 30 minutes since deals don't change by the minute
    headers: {
      'User-Agent': 'AQueJugarHoy/1.0',
    },
  });

  if (!res.ok) {
    throw new Error(`CheapShark API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Get top deals for Steam (storeID=1) sorted by discount percentage
 */
export async function getSteamDeals(pageSize = 12): Promise<CheapSharkDeal[]> {
  return fetchCheapShark<CheapSharkDeal[]>('/deals', {
    storeID: 1,
    onSale: 1,
    sortBy: 'Savings',
    desc: 0, // desc=0 for Savings actually returns highest savings first in CheapShark API
    pageSize,
  });
}

/**
 * Search for a specific game's price by title
 */
export async function searchGamePrice(title: string): Promise<CheapSharkGameSearch[]> {
  // CheapShark search works best with simple alphanumeric titles
  const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  
  return fetchCheapShark<CheapSharkGameSearch[]>('/games', {
    title: cleanTitle,
    limit: 5,
  });
}

/**
 * Helper to build the redirect URL for a deal
 */
export function getDealRedirectUrl(dealID: string): string {
  return `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(dealID)}`;
}
