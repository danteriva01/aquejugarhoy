/**
 * Curated video content for the Explorar section.
 * Each video is an Instagram reel embed tied to a specific game.
 * To add a new video: copy an entry and fill in the Instagram URL + game info.
 */

export interface CuratedVideo {
  id: string;
  /** Game name displayed over the video */
  title: string;
  /** Short 1-line description */
  description: string;
  /** Instagram reel URL (not the embed URL — the component handles conversion) */
  instagramUrl: string;
  /** RAWG slug for linking to the game detail page */
  gameSlug: string;
  /** Display tags */
  tags: string[];
  /** Which user profiles this video is relevant to */
  relevantFor: {
    withWhom?: string[];   // 'solo' | 'pareja' | 'amigos'
  };
}

export const CURATED_VIDEOS: CuratedVideo[] = [
  {
    id: 'nmrih2',
    title: 'No More Room in Hell 2',
    description: 'Survival horror cooperativo. Sobreviví junto a tus amigos.',
    instagramUrl: 'https://www.instagram.com/reel/DXzp5qUChJu/',
    gameSlug: 'no-more-room-in-hell-2',
    tags: ['survival', 'horror', 'coop', 'zombies'],
    relevantFor: {
      withWhom: ['amigos'],
    },
  },
  {
    id: 'odds-park',
    title: 'Odds Park',
    description: 'Un mundo indie con estilo visual único y mecánicas relajantes.',
    instagramUrl: 'https://www.instagram.com/reel/DXw_LX6FACt/',
    gameSlug: 'odds-park',
    tags: ['indie', 'relajado', 'arte', 'exploración'],
    relevantFor: {
      withWhom: ['solo', 'pareja'],
    },
  },
];

/**
 * Filters curated videos to only show those relevant to the user's context.
 * Prioritizes videos of games that are in the user's top recommendations, 
 * favorites, or have been interacted with.
 */
export function getRelevantVideos(
  videos: CuratedVideo[],
  context?: { 
    withWhom?: string;
    topGameSlugs?: string[];
    favorites?: string[];
    historySlugs?: string[];
  }
): CuratedVideo[] {
  if (!context) return videos;

  return videos.filter(video => {
    // 1. Exact game match (Top priority)
    const isTopRecommended = context.topGameSlugs?.includes(video.gameSlug);
    const isFavorite = context.favorites?.includes(video.gameSlug);
    const isHistory = context.historySlugs?.includes(video.gameSlug);

    if (isTopRecommended || isFavorite || isHistory) return true;

    // 2. Fallback to category match if no top games found, or if we need more videos
    if (context.withWhom && video.relevantFor.withWhom) {
      return video.relevantFor.withWhom.includes(context.withWhom);
    }
    
    return false;
  });
}
