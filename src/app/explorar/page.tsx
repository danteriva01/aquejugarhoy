import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ExplorerResults from '@/components/explore/ExplorerResults';
import VideoSection from '@/components/explore/VideoSection';
import ExplorerClient from './ExplorerClient';
import { getGames, getGenres } from '@/lib/api/rawg';
import { enrichGamesWithSteamData } from '@/lib/api/steam';
import type { GameQueryParams, Game } from '@/lib/api/types';
import { sortGamesByScore, getContextLabel, UserContext, inferUserProfile, isKnownFreeGame } from '@/lib/scoring';
import { CURATED_VIDEOS, getRelevantVideos } from '@/lib/data/reels';
import curatedGamesData from '@/lib/data/curated_games.json';
import { getIronSession, IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import { getUserBySteamId } from '@/lib/data/db';

export const metadata: Metadata = {
  title: 'Explorar Juegos',
  description: 'Explorá y descubrí juegos recomendados para vos según tus preferencias.',
};

interface ExplorerPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ExplorerPage({ searchParams }: ExplorerPageProps) {
  const params = await searchParams;

  // Determine if user came from the onboarding flow (has filter context)
  const hasUserContext = !!(params.withWhom || params.budget || params.gameStyle);
  // Detect explicit "browse all" mode
  const isBrowseMode = params.view === 'browse' || (!hasUserContext && !params.search);

  // Build RAWG query
  const queryParams: GameQueryParams = {
    page: params.page ? parseInt(params.page) : 1,
    page_size: 24, // Optimized page size
    search: params.search,
    search_precise: !!params.search,
    ordering: (params.ordering === 'price-asc' || params.ordering === 'price-desc') ? '-rating' : (params.ordering || '-rating'),
    genres: params.genres,
    tags: params.tags,
    hardware: params.hardware,
    metacritic: params.metacritic,
    dates: params.dates,
  };

  let enrichedResults: Game[] = [];
  let totalCount = 0;
  let genresList: any[] = [];

  if (hasUserContext) {
    // ===== CURATED DATABASE MODE (Onboarding) =====
    // Skip RAWG completely. Use the high-quality local dataset.
    const allCurated = curatedGamesData as unknown as Game[];
    
    enrichedResults = allCurated.filter(g => {
      const ctx = g._curatedContext;
      if (!ctx) return false;
      
      const cat = ctx.categoria_web || [];
      const players = ctx.jugadores || [];
      const platform = ctx.plataforma || [];
      const price = ctx.precio || 'paid';

      // 1. Core Category Filter (withWhom + style)
      let matchCategory = false;
      if (params.withWhom === 'pareja' && cat.includes('pareja')) matchCategory = true;
      if (params.withWhom === 'solo') {
        if (params.gameStyle === 'singleplayer' && cat.includes('singleplayer')) matchCategory = true;
        if ((params.gameStyle === 'competitive-online' || params.gameStyle === 'mmo') && cat.includes('matchmaking')) matchCategory = true;
      }
      if (params.withWhom === 'amigos') {
         if (params.gameStyle === 'coop-fun' && cat.includes('coop_divertido')) matchCategory = true;
         if (params.gameStyle === 'party' && cat.includes('party')) matchCategory = true;
         if (params.gameStyle === 'matchmaking' && cat.includes('matchmaking')) matchCategory = true;
      }
      if (!matchCategory) return false;

      // 2. Player Count Filter
      if (params.playerCount === '5+') {
        if (!players.includes('+5')) return false;
      } else if (params.playerCount) {
        // Simple numeric check if needed, but current dataset uses '1', 'coop' (2), '+5'
        const target = params.playerCount;
        if (target === '1' && !players.includes('1')) return false;
        if (target === '2' && !players.includes('coop') && !players.includes('2')) return false;
      }

      // 3. Budget Filter (Free to Play)
      if (params.budget === 'free') {
        if (price !== 'free_to_play') return false;
      }

      // 4. Platform Filter (Optional param if we add it to UI later)
      if (params.platform && !platform.includes(params.platform)) return false;

      return true;
    });

    // If for some reason the filter yielded 0 results, fallback to all curated matching the budget
    if (enrichedResults.length === 0) {
      enrichedResults = allCurated.filter(g => {
        if (params.budget === 'free') {
           return g._curatedContext?.precio === 'free_to_play';
        }
        return true;
      });
    }
    totalCount = enrichedResults.length;
    
  } else {
    // ===== BROWSE MODE (RAWG API + Curated Merge) =====
    const [rawGames, rawGenres] = await Promise.all([
      getGames(queryParams).catch(() => ({ count: 0, next: null, previous: null, results: [] as Game[] })),
      getGenres().catch(() => ({ count: 0, next: null, previous: null, results: [] })),
    ]);
    
    totalCount = rawGames.count;
    genresList = rawGenres.results;

    // Merge with curated data if searching
    let rawResults = rawGames.results;
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      const allCurated = curatedGamesData as unknown as Game[];
      const curatedMatches = allCurated.filter(g => 
        (g.name?.toLowerCase() || '').includes(searchLower) || 
        g.slug?.includes(searchLower)
      );
      
      // Deduplicate: remove curated matches from raw results if they exist there
      const curatedSlugs = new Set(curatedMatches.map(g => g.slug));
      rawResults = [
        ...curatedMatches,
        ...rawResults.filter(g => !curatedSlugs.has(g.slug))
      ];
    }

    // Use optimized enrichment (Fast mode)
    enrichedResults = await enrichGamesWithSteamData(rawResults, { fastMode: true, limit: 24 });

    // Strict filter for free-to-play in browse mode
    if (params.tags?.includes('free-to-play') || params.budget === 'free') {
      enrichedResults = enrichedResults.filter(game => {
        if (game.priceInfo) return game.priceInfo.isFree || game.priceInfo.salePrice === 0;
        return game.tags?.some(t => t.slug === 'free-to-play') || isKnownFreeGame(game.slug) || game._curatedContext?.precio === 'free_to_play';
      });
    }

    // Local sorting for price in browse mode
    if (params.ordering === 'price-asc') {
      enrichedResults.sort((a, b) => {
        const pA = a.priceInfo?.isFree ? 0 : (a.priceInfo?.salePrice ?? 9999);
        const pB = b.priceInfo?.isFree ? 0 : (b.priceInfo?.salePrice ?? 9999);
        return pA - pB;
      });
    } else if (params.ordering === 'price-desc') {
      enrichedResults.sort((a, b) => {
        const pA = a.priceInfo?.isFree ? 0 : (a.priceInfo?.salePrice ?? 0);
        const pB = b.priceInfo?.isFree ? 0 : (b.priceInfo?.salePrice ?? 0);
        return pB - pA;
      });
    }
    // Final safety filter for budget
    if (params.budget === 'free' || params.tags?.includes('free-to-play')) {
      enrichedResults = enrichedResults.filter(game => {
        if (game.priceInfo) return game.priceInfo.isFree || game.priceInfo.salePrice === 0;
        return game.tags?.some(t => t.slug === 'free-to-play') || 
               isKnownFreeGame(game.slug) || 
               game._curatedContext?.precio === 'free_to_play';
      });
    }
  }

  // ===== PERSONALIZED RESULTS MODE =====
  // User completed onboarding → show scored results + relevant videos
  if (hasUserContext && !isBrowseMode) {
    // Fetch user history & personalization if logged in
    const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
    let userHistory: any[] = [];
    let userFavorites: string[] = [];
    let userProfile: any = null;
    let ownedSteamAppIds: number[] = [];

    if (session.user) {
      const user = await getUserBySteamId(session.user.steamId);
      if (user) {
        userHistory = user.historial || [];
        userFavorites = user.favoritos || [];
        userProfile = user.perfil?.tipo || null;
        ownedSteamAppIds = (user.juegosSteam || []).map(g => g.appid);

        // If no profile, try to infer it from history
        if (!userProfile && userHistory.length >= 5) {
          const allCurated = curatedGamesData as unknown as Game[];
          userProfile = inferUserProfile(userHistory, allCurated);
          // Optional: save the inferred profile back to DB for future use
        }
      }
    }

    const userContext: UserContext = {
      withWhom: params.withWhom,
      gameStyle: params.gameStyle,
      playerCount: params.playerCount,
      budget: params.budget,
      userHistory,
      userFavorites,
      userProfile,
      ownedSteamAppIds
    };

    let scoredResults = sortGamesByScore(enrichedResults, userContext);
    
    // ===== RELAXED FILTERS LOGIC =====
    // If no results, try relaxing the budget (mixed)
    if (scoredResults.length === 0 && userContext.budget === 'free') {
      const relaxedContext = { ...userContext, budget: 'mixed' };
      scoredResults = sortGamesByScore(enrichedResults, relaxedContext);
      // Mark that we relaxed the budget
      (userContext as any)._isRelaxedBudget = true;
    }

    // If still no results, try relaxing the player count
    if (scoredResults.length === 0 && userContext.playerCount === '5+') {
      const relaxedContext = { ...userContext, budget: 'mixed', playerCount: undefined };
      scoredResults = sortGamesByScore(enrichedResults, relaxedContext);
      // Mark that we relaxed the player count
      (userContext as any)._isRelaxedPlayers = true;
    }
    
    // Pagination logic
    const currentPage = params.page ? parseInt(params.page) : 1;
    const pageSize = 12;
    const totalPages = Math.ceil(scoredResults.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    
    const topResults = scoredResults.slice(startIndex, startIndex + pageSize);
    let contextLabel = getContextLabel(userContext);

    // Append relaxation notes to label
    if ((userContext as any)._isRelaxedBudget || (userContext as any)._isRelaxedPlayers) {
      contextLabel += ' (Filtros flexibilizados)';
    }

    // Get videos relevant to user's context
    const relevantVideos = getRelevantVideos(CURATED_VIDEOS, {
      withWhom: params.withWhom,
      topGameSlugs: scoredResults.slice(0, 10).map(g => g.slug),
      favorites: userFavorites,
      historySlugs: userHistory.map((h: any) => h.juego)
    });

    return (
      <div className="pt-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-text-muted text-sm hover:text-text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cambiar filtros
          </Link>

          {/* Primary: Scored Game Results */}
          <ExplorerResults
            games={topResults}
            contextLabel={contextLabel}
            withWhom={params.withWhom}
            totalGames={scoredResults.length}
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={params}
          />

          {/* Secondary: Curated Videos */}
          <VideoSection
            videos={relevantVideos}
            contextLabel={contextLabel}
          />

          {/* Browse all link */}
          <div className="mt-12 text-center">
            <Link
              href="/explorar?view=browse"
              className="text-text-muted text-sm hover:text-accent-light transition-colors underline underline-offset-4"
            >
              Explorar todos los juegos sin filtros →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== BROWSE MODE =====
  // No context or explicit browse → traditional grid explorer
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ExplorerClient
          initialGames={enrichedResults.slice(0, 20)}
          totalCount={totalCount}
          genres={genresList}
          currentParams={params}
        />
      </div>
    </div>
  );
}
