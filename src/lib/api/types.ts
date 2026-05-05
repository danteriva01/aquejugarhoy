// ===== RAWG API Response Types =====

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  playtime: number;
  updated: string;
  platforms: PlatformWrapper[] | null;
  genres: Genre[];
  tags: Tag[];
  short_screenshots: Screenshot[];
  stores: StoreWrapper[] | null;
  esrb_rating: ESRBRating | null;
  parent_platforms: ParentPlatformWrapper[] | null;
  
  // Custom field populated locally from CheapShark
  priceInfo?: GamePriceInfo;
  steamAppId?: string; // AppID used for fetching Steam assets like thumbnails
  description?: string;
  description_raw?: string;
}

export interface GamePriceInfo {
  salePrice: number;
  normalPrice: number;
  discountPercent: number;
  isFree: boolean;
  isOnSale: boolean;
  dealUrl: string;
  steamRatingText?: string;
  steamRatingPercent?: number;
  steamRatingCount?: number;
}

export interface GameDetail extends Game {
  name_original: string;
  description: string;
  description_raw: string;
  website: string;
  developers: Developer[];
  publishers: Publisher[];
  clip: GameClip | null;
  reactions: Record<string, number> | null;
  screenshots_count: number;
  movies_count: number;
  achievements_count: number;
  reddit_url: string;
  reddit_count: number;
  twitch_count: number;
  youtube_count: number;
  reviews_text_count: number;
  suggestions_count: number;
  alternative_names: string[];
  metacritic_url: string;
  added: number;
  added_by_status: AddedByStatus | null;
  pc_requirements?: Requirements;
  mac_requirements?: Requirements;
  linux_requirements?: Requirements;
}

export interface Requirements {
  minimum?: string;
  recommended?: string;
}

export interface AddedByStatus {
  yet?: number;
  owned?: number;
  beaten?: number;
  toplay?: number;
  dropped?: number;
  playing?: number;
}

export interface Platform {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  image_background: string | null;
  games_count?: number;
}

export interface PlatformWrapper {
  platform: Platform;
  released_at?: string | null;
  requirements?: Requirements;
}

export interface ParentPlatformWrapper {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  image_background?: string;
  games_count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  language?: string;
  games_count?: number;
  image_background?: string;
}

export interface Screenshot {
  id: number;
  image: string;
  width?: number;
  height?: number;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  domain: string;
  image_background: string;
}

export interface StoreWrapper {
  id: number;
  store: Store;
  url?: string;
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
  image_background?: string;
  games_count?: number;
}

export interface Publisher {
  id: number;
  name: string;
  slug: string;
  image_background?: string;
  games_count?: number;
}

export interface GameClip {
  clip: string;
  clips: Record<string, string>;
  video: string;
  preview: string;
}

export interface ESRBRating {
  id: number;
  name: string;
  slug: string;
}

export interface Trailer {
  id: number;
  name: string;
  preview: string;
  data: {
    480: string;
    max: string;
  };
}

// ===== Query Parameter Types =====

export interface GameQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  search_precise?: boolean;
  ordering?: string;
  genres?: string;
  platforms?: string;
  tags?: string;
  hardware?: string; // Custom parameter
  developers?: string;
  publishers?: string;
  dates?: string;
  metacritic?: string;
  stores?: string;
}

// ===== CheapShark API Types =====

export interface CheapSharkDeal {
  internalName: string;
  title: string;
  metacriticLink: string | null;
  dealID: string;
  storeID: string;
  gameID: string;
  salePrice: string;
  normalPrice: string;
  isOnSale: string;
  savings: string;
  metacriticScore: string;
  steamRatingText: string;
  steamRatingPercent: string;
  steamRatingCount: string;
  steamAppID: string;
  releaseDate: number;
  lastChange: number;
  dealRating: string;
  thumb: string;
}

export interface CheapSharkGameSearch {
  gameID: string;
  steamAppID: string | null;
  cheapest: string;
  cheapestDealID: string;
  external: string;
  internalName: string;
  thumb: string;
}
export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number; // in minutes
  img_icon_url?: string;
}

export interface User {
  steamId: string;
  name: string;
  avatar: string;
  favoritos: string[];
  historial: any[]; // HistoryEntry
  juegosSteam: SteamGame[];
  lastSync: number | null;
  perfil: {
    tipo: "casual" | "hardcore" | "social" | null;
  };
  preferences: any;
}

// ===== Room & Collaboration Types =====

export interface Participant {
  steamId: string;
  name: string;
  avatar: string;
  hasVoted: boolean;
}

export interface GameVote {
  gameId: string;
  positives: string[]; // array of steamIds
  negatives: string[]; // array of steamIds
}

export interface Room {
  code: string;
  hostId: string;
  status: 'lobby' | 'selecting_type' | 'voting' | 'finished';
  type: 'cooperativo' | 'competitivo' | 'party' | null;
  round: number;
  participants: Participant[];
  currentGames: Game[];
  votes: GameVote[];
  winner: Game | null;
  lastUpdate: number;
}
