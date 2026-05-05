import type { Game } from './api/types';

export interface UserContext {
  withWhom?: string;
  gameStyle?: string;
  playerCount?: string;
  budget?: string;
  // Legacy — kept for backward compat but no longer sent from onboarding
  hardware?: string;
  
  // User Personalization
  userHistory?: { juego: string; accion: "visto" | "click" }[];
  userFavorites?: string[];
  userProfile?: "casual" | "hardcore" | "social" | null;
  ownedSteamAppIds?: number[];
  topPlayedGames?: string[]; // Names or slugs of highly played games
}

export interface ScoredGame extends Game {
  _score: number;
  _matchReasons: string[];
}

// ===== Known game classifications =====

interface GameProfile {
  difficulty: 'low' | 'mid' | 'high';
  style: 'relaxed' | 'competitive' | 'narrative' | 'chaotic';
  requirements: 'low' | 'mid' | 'high';
  maxPlayers?: number;
}

const KNOWN_GAMES: Record<string, GameProfile> = {
  // --- Couple / Coop classics ---
  'stardew-valley':       { difficulty: 'low',  style: 'relaxed',     requirements: 'low',  maxPlayers: 4 },
  'overcooked':           { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 4 },
  'overcooked-2':         { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 4 },
  'it-takes-two':         { difficulty: 'mid',  style: 'narrative',   requirements: 'mid',  maxPlayers: 2 },
  'unravel-two':          { difficulty: 'low',  style: 'relaxed',     requirements: 'mid',  maxPlayers: 2 },
  'a-way-out':            { difficulty: 'low',  style: 'narrative',   requirements: 'mid',  maxPlayers: 2 },
  'castle-crashers':      { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 4 },
  'moving-out':           { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 4 },
  'minecraft':            { difficulty: 'low',  style: 'relaxed',     requirements: 'low',  maxPlayers: 100 },
  'terraria':             { difficulty: 'mid',  style: 'relaxed',     requirements: 'low',  maxPlayers: 16 },
  'portal-2':             { difficulty: 'mid',  style: 'narrative',   requirements: 'low',  maxPlayers: 2 },
  'spiritfarer':          { difficulty: 'low',  style: 'narrative',   requirements: 'low',  maxPlayers: 2 },
  'human-fall-flat':      { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 8 },
  'lovers-in-a-dangerous-spacetime': { difficulty: 'low', style: 'chaotic', requirements: 'low', maxPlayers: 4 },
  'untitled-goose-game':  { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 2 },
  'plate-up':             { difficulty: 'mid',  style: 'chaotic',     requirements: 'low',  maxPlayers: 4 },
  'we-were-here':         { difficulty: 'mid',  style: 'narrative',   requirements: 'low',  maxPlayers: 2 },
  'lego-star-wars-the-skywalker-saga': { difficulty: 'low', style: 'relaxed', requirements: 'mid', maxPlayers: 2 },
  // --- Friend coop ---
  'deep-rock-galactic':   { difficulty: 'mid',  style: 'chaotic',     requirements: 'mid',  maxPlayers: 4 },
  'dont-starve-together': { difficulty: 'high', style: 'relaxed',     requirements: 'low',  maxPlayers: 6 },
  '7-days-to-die':        { difficulty: 'mid',  style: 'relaxed',     requirements: 'mid',  maxPlayers: 8 },
  'project-zomboid':      { difficulty: 'high', style: 'relaxed',     requirements: 'low',  maxPlayers: 32 },
  'phasmophobia':         { difficulty: 'mid',  style: 'chaotic',     requirements: 'mid',  maxPlayers: 4 },
  'the-escapists-2':      { difficulty: 'mid',  style: 'chaotic',     requirements: 'low',  maxPlayers: 4 },
  'keep-talking-and-nobody-explodes': { difficulty: 'mid', style: 'chaotic', requirements: 'low', maxPlayers: 2 },
  // --- Party ---
  'among-us':             { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 15 },
  'fall-guys':            { difficulty: 'low',  style: 'chaotic',     requirements: 'mid',  maxPlayers: 60 },
  'stumble-guys':         { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 32 },
  '8bit-fiesta':          { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 8 },
  'play-together':        { difficulty: 'low',  style: 'relaxed',     requirements: 'low',  maxPlayers: 50 },
  'bapbap':               { difficulty: 'mid',  style: 'competitive', requirements: 'low',  maxPlayers: 30 },
  'pummel-party':         { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 8 },
  'pico-park':            { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 8 },
  'worms-w-m-d':          { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 6 },
  'worms-armageddon':     { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 6 },
  'gang-beasts':          { difficulty: 'low',  style: 'chaotic',     requirements: 'low',  maxPlayers: 8 },
  'party-animals':        { difficulty: 'low',  style: 'chaotic',     requirements: 'mid',  maxPlayers: 8 },
  // --- Competitive ---
  'counter-strike-2':     { difficulty: 'high', style: 'competitive', requirements: 'mid',  maxPlayers: 10 },
  'valorant':             { difficulty: 'high', style: 'competitive', requirements: 'mid',  maxPlayers: 10 },
  'league-of-legends':    { difficulty: 'high', style: 'competitive', requirements: 'low',  maxPlayers: 10 },
  'dota-2':               { difficulty: 'high', style: 'competitive', requirements: 'low',  maxPlayers: 10 },
  'rust':                 { difficulty: 'high', style: 'competitive', requirements: 'high', maxPlayers: 100 },
  'escape-from-tarkov':   { difficulty: 'high', style: 'competitive', requirements: 'high', maxPlayers: 14 },
  'dayz':                 { difficulty: 'high', style: 'competitive', requirements: 'high', maxPlayers: 60 },
  'chivalry-2':           { difficulty: 'mid',  style: 'competitive', requirements: 'mid',  maxPlayers: 64 },
  // --- Souls-like ---
  'cuphead':              { difficulty: 'high', style: 'competitive', requirements: 'low',  maxPlayers: 2 },
  'dark-souls':           { difficulty: 'high', style: 'competitive', requirements: 'mid',  maxPlayers: 2 },
  'dark-souls-iii':       { difficulty: 'high', style: 'competitive', requirements: 'high', maxPlayers: 3 },
  'elden-ring':           { difficulty: 'high', style: 'competitive', requirements: 'high', maxPlayers: 4 },
  'sekiro-shadows-die-twice': { difficulty: 'high', style: 'competitive', requirements: 'high', maxPlayers: 1 },
  // --- Additional popular coop (4 players) ---
  'left-4-dead-2':        { difficulty: 'mid',  style: 'chaotic',     requirements: 'low',  maxPlayers: 4 },
  'left-4-dead':          { difficulty: 'mid',  style: 'chaotic',     requirements: 'low',  maxPlayers: 4 },
  'borderlands-2':        { difficulty: 'mid',  style: 'chaotic',     requirements: 'mid',  maxPlayers: 4 },
  'borderlands-3':        { difficulty: 'mid',  style: 'chaotic',     requirements: 'high', maxPlayers: 4 },
  'sea-of-thieves':       { difficulty: 'mid',  style: 'relaxed',     requirements: 'mid',  maxPlayers: 4 },
  'valheim':              { difficulty: 'high', style: 'relaxed',     requirements: 'mid',  maxPlayers: 10 },
};

/**
 * Infers a game's profile from its RAWG tags.
 */
function inferGameProfile(tags: string[], genres: string[]): GameProfile {
  let difficulty: GameProfile['difficulty'] = 'mid';
  const hardTags = ['souls-like', 'difficult', 'hardcore', 'challenging', 'tactical', 'permadeath'];
  const easyTags = ['casual', 'relaxing', 'family-friendly', 'easy', 'cozy', 'cute', 'funny'];
  if (hardTags.some(t => tags.includes(t))) difficulty = 'high';
  else if (easyTags.some(t => tags.includes(t))) difficulty = 'low';
  else if (genres.includes('casual') || genres.includes('family')) difficulty = 'low';

  let style: GameProfile['style'] = 'relaxed';
  if (tags.includes('competitive') || tags.includes('pvp') || tags.includes('esports')) style = 'competitive';
  else if (tags.includes('story-rich') || tags.includes('atmospheric') || tags.includes('cinematic')) style = 'narrative';
  else if (tags.includes('party-game') || tags.includes('funny') || tags.includes('physics')) style = 'chaotic';
  else if (tags.includes('relaxing') || tags.includes('casual') || tags.includes('cozy')) style = 'relaxed';

  let requirements: GameProfile['requirements'] = 'mid';
  if (tags.includes('2d') || tags.includes('pixel-graphics') || tags.includes('retro') || genres.includes('indie')) {
    requirements = 'low';
  }
  if (tags.includes('ray-tracing') || tags.includes('next-gen') || tags.includes('open-world')) {
    requirements = 'high';
  }

  return { difficulty, style, requirements };
}

/**
 * Returns a hardware requirement level for a game (for display on cards).
 */
export function getGameRequirements(game: Game): 'low' | 'mid' | 'high' {
  const tags = game.tags?.map(t => t.slug) || [];
  const genres = game.genres?.map(g => g.slug) || [];
  const slug = game.slug;

  if (KNOWN_GAMES[slug]) return KNOWN_GAMES[slug].requirements;
  return inferGameProfile(tags, genres).requirements;
}

/**
 * Infers player type based on interaction history.
 */
export function inferUserProfile(history: { juego: string; accion: "visto" | "click" }[], games: Game[]): "casual" | "hardcore" | "social" | null {
  if (history.length < 5) return null;

  const interactions = history.filter(h => h.accion === "click");
  if (interactions.length === 0) return null;

  let socialPoints = 0;
  let hardcorePoints = 0;
  let casualPoints = 0;

  interactions.forEach(h => {
    const game = games.find(g => g.slug === h.juego);
    if (!game) return;

    const tags = game.tags?.map(t => t.slug) || [];
    const genres = game.genres?.map(g => g.slug) || [];
    const profile = KNOWN_GAMES[game.slug] || inferGameProfile(tags, genres);

    if (tags.includes('co-op') || tags.includes('multiplayer') || tags.includes('team-based')) socialPoints++;
    if (profile.difficulty === 'high' || tags.includes('competitive')) hardcorePoints++;
    if (profile.difficulty === 'low' || profile.style === 'relaxed') casualPoints++;
  });

  if (socialPoints > hardcorePoints && socialPoints > casualPoints) return "social";
  if (hardcorePoints > socialPoints && hardcorePoints > casualPoints) return "hardcore";
  if (casualPoints > socialPoints && casualPoints > hardcorePoints) return "casual";

  return null;
}

/**
 * Calculates a recommendation score for a game based on user context.
 */
export function calculateGameScore(game: Game, context: UserContext): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const tags = game.tags?.map(t => t.slug) || [];
  const genres = game.genres?.map(g => g.slug) || [];
  const slug = game.slug;
  const profile = KNOWN_GAMES[slug] || inferGameProfile(tags, genres);

  // ===== A) SOLO =====
  if (context.withWhom === 'solo') {
    if (context.gameStyle === 'singleplayer') {
      if (tags.includes('singleplayer')) { score += 30; reasons.push('Experiencia singleplayer'); }
      if (tags.includes('story-rich') || profile.style === 'narrative') { score += 25; reasons.push('Historia profunda'); }
      if (genres.includes('role-playing-games-rpg')) { score += 15; reasons.push('RPG inmersivo'); }
      if (tags.includes('atmospheric') || tags.includes('exploration')) score += 10;
      if (tags.includes('open-world')) { score += 10; reasons.push('Mundo abierto'); }
      // Penalize multiplayer-only
      if (!tags.includes('singleplayer') && tags.includes('multiplayer')) score -= 40;
    }

    if (context.gameStyle === 'competitive-online') {
      if (tags.includes('competitive') || tags.includes('pvp')) { score += 35; reasons.push('Competitivo PvP'); }
      if (tags.includes('multiplayer')) { score += 20; reasons.push('Online multiplayer'); }
      if (tags.includes('esports') || tags.includes('team-based')) score += 15;
      if (tags.includes('shooter') || genres.includes('shooter')) score += 10;
      if (!tags.includes('multiplayer')) score -= 30;
    }

    if (context.gameStyle === 'mmo') {
      if (tags.includes('massively-multiplayer') || genres.includes('massively-multiplayer')) {
        score += 40; reasons.push('MMO');
      }
      if (tags.includes('open-world')) { score += 15; reasons.push('Mundo persistente'); }
      if (genres.includes('role-playing-games-rpg')) score += 10;
      if (!tags.includes('massively-multiplayer') && !genres.includes('massively-multiplayer')) score -= 30;
    }
  }

  // ===== B) PAREJA =====
  if (context.withWhom === 'pareja') {
    // Coop
    if (tags.includes('local-co-op') || tags.includes('shared-or-split-screen')) {
      score += 40; reasons.push('Cooperativo local — ideal para pareja');
    } else if (tags.includes('co-op') || tags.includes('online-co-op')) {
      score += 20; reasons.push('Modo cooperativo');
    } else if (tags.includes('singleplayer') && !tags.includes('multiplayer') && !tags.includes('co-op')) {
      score -= 30;
    }

    // Difficulty
    if (profile.difficulty === 'low') { score += 30; reasons.push('Dificultad accesible'); }
    else if (profile.difficulty === 'mid') score += 10;
    else if (profile.difficulty === 'high') score -= 20;

    // Style
    if (profile.style === 'relaxed' || profile.style === 'chaotic') {
      score += 30;
      reasons.push(profile.style === 'relaxed' ? 'Ambiente relajado' : 'Divertido y caótico');
    } else if (profile.style === 'narrative') {
      score += 15; reasons.push('Narrativa compartida');
    } else if (profile.style === 'competitive') {
      score -= 15;
    }

    // Full match bonus
    if (
      (tags.includes('local-co-op') || tags.includes('co-op')) &&
      profile.difficulty === 'low' &&
      (profile.style === 'relaxed' || profile.style === 'chaotic')
    ) {
      score += 30; reasons.push('¡Match perfecto para pareja!');
    }
  }

  // ===== C) AMIGOS =====
  if (context.withWhom === 'amigos') {
    // Base multiplayer requirement
    if (!tags.includes('multiplayer') && !tags.includes('co-op') && !tags.includes('online-co-op')) {
      score -= 50;
    }

    if (context.gameStyle === 'matchmaking') {
      if (tags.includes('competitive') || tags.includes('pvp')) { score += 35; reasons.push('Competitivo PvP'); }
      if (tags.includes('multiplayer')) { score += 25; reasons.push('Multiplayer online'); }
      if (tags.includes('team-based')) score += 15;
      if (genres.includes('shooter')) score += 10;
      if (tags.includes('co-op') && !tags.includes('competitive')) score -= 10;
    }

    if (context.gameStyle === 'coop-fun') {
      if (tags.includes('co-op') || tags.includes('online-co-op')) { score += 35; reasons.push('Cooperativo'); }
      if (tags.includes('survival') || tags.includes('crafting')) { score += 20; reasons.push('Supervivencia/progresión'); }
      if (tags.includes('multiplayer')) score += 15;
      if (profile.style === 'relaxed' || profile.style === 'chaotic') score += 10;
      if (tags.includes('competitive') || profile.style === 'competitive') score -= 50;
    }

    if (context.gameStyle === 'party') {
      if (tags.includes('party-game') || tags.includes('funny') || tags.includes('physics') || tags.includes('family-friendly')) {
        score += 50; reasons.push('Juego party ideal');
      } else {
        // If it lacks any party tag, penalize it slightly so true party games rise to the top
        score -= 20;
      }
      if (tags.includes('multiplayer')) score += 10;
      if (profile.style === 'chaotic') { score += 20; reasons.push('Caótico y divertido'); }
      if (profile.difficulty === 'low') { score += 15; reasons.push('Fácil de aprender'); }
      if (tags.includes('local-multiplayer') || tags.includes('local-co-op')) score += 15;

      // Heavy penalties for serious/complex games
      if (
        profile.style === 'competitive' || 
        profile.style === 'narrative' || 
        tags.includes('open-world') || 
        tags.includes('story-rich') ||
        genres.includes('role-playing-games-rpg') ||
        genres.includes('shooter') ||
        tags.includes('violent') ||
        tags.includes('gore')
      ) {
        score -= 100;
      }
    }

    // Player count affinity
    if (context.playerCount === '5+') {
      // 1. Check known max players
      if (profile.maxPlayers && profile.maxPlayers < 5) {
        score -= 1000; // Force exclude
      }

      // 2. Check tags for explicit player counts (e.g., "4-players", "2-players")
      const hasSmallPlayerTag = tags.some(t => {
        const match = t.match(/^(\d+)-players$/);
        return match && parseInt(match[1]) < 5;
      });
      if (hasSmallPlayerTag) {
        score -= 1000;
      }

      // 3. Affinity for truly large groups
      if (tags.includes('massively-multiplayer') || genres.includes('massively-multiplayer')) score += 30;
      if (profile.maxPlayers && profile.maxPlayers >= 8) score += 20;
      if (context.gameStyle === 'party' && (tags.includes('party-game') || profile.style === 'chaotic')) {
        score += 25; reasons.push('Ideal para grupos grandes');
      }
      
      // 4. Penalize games known for max 4 players but not in KNOWN_GAMES (heuristic)
      // Most local-co-op only games are 4 players max
      if (tags.includes('local-co-op') && !tags.includes('online-co-op') && !tags.includes('multiplayer')) {
        score -= 20;
      }
    } else if (context.playerCount) {
      const targetCount = parseInt(context.playerCount);
      if (!isNaN(targetCount)) {
        if (profile.maxPlayers && profile.maxPlayers < targetCount) {
          score -= 1000;
        }
      }
    }
  }

  // ===== D) Budget =====
  if (context.budget === 'free') {
    if (tags.includes('free-to-play') || game.priceInfo?.isFree) {
      score += 30; reasons.push('¡Gratis!');
    } else {
      score -= 1000; // Strict penalty to exclude paid games
    }
  }
  // "mixed" budget → no penalty, show everything

  // ===== E) Quality boost (tie-breaker) =====
  if (game.rating >= 4.0) score += 5;
  else if (game.rating >= 3.5) score += 3;
  if (game.metacritic && game.metacritic >= 80) score += 5;
  else if (game.metacritic && game.metacritic >= 70) score += 2;

  // ===== F) User History (Freshness & Engagement) =====
  if (context.userHistory) {
    const views = context.userHistory.filter(h => h.juego === slug && h.accion === "visto").length;
    const clicks = context.userHistory.filter(h => h.juego === slug && h.accion === "click").length;

    if (views > 3 && clicks === 0) {
      score -= 30; // Penalize games seen many times but ignored
    }
    if (clicks > 0) {
      score += 10; reasons.push('Visto anteriormente');
    }
  }

  // ===== G) Favorites =====
  if (context.userFavorites && context.userFavorites.includes(slug)) {
    score += 50;
    reasons.push('En tus favoritos');
  }

  // ===== H) User Profile Boost =====
  if (context.userProfile === 'casual') {
    if (profile.difficulty === 'low') { score += 20; reasons.push('Para tu perfil casual'); }
    if (profile.style === 'relaxed') score += 15;
  } else if (context.userProfile === 'hardcore') {
    if (profile.difficulty === 'high') { score += 25; reasons.push('Desafío para tu perfil hardcore'); }
    if (profile.style === 'competitive') score += 15;
  } else if (context.userProfile === 'social') {
    if (tags.includes('co-op') || tags.includes('multiplayer')) { score += 30; reasons.push('Ideal para tu perfil social'); }
  }

  // ===== I) Steam Library Integration =====
  if (context.ownedSteamAppIds && game.steamAppId && context.ownedSteamAppIds.includes(parseInt(game.steamAppId))) {
    score -= 1000; // Penalize games already owned (exclude from recommendations)
    // Note: We use a large penalty to hide them, but keep it in reasons just in case
    reasons.push('Ya lo tenés en Steam');
  }

  if (context.topPlayedGames && context.topPlayedGames.length > 0) {
    // Check if the current game is similar to top played games (very basic heuristic)
    const isSimilar = context.topPlayedGames.some(topGame => {
      const topSlug = topGame.toLowerCase().replace(/\s+/g, '-');
      // If categories or genres match a lot, could add more points
      return false; // For now, keep it simple
    });
    
    // Better: boost by tags matching top played games
    // (This requires a more complex comparison, for now we skip exact similarity)
  }

  return { score, reasons: [...new Set(reasons)] };
}

/**
 * Scores, sorts, and filters games. Excludes negative scores.
 */
export function sortGamesByScore(games: Game[], context: UserContext): ScoredGame[] {
  const scored = games.map(game => {
    const { score, reasons } = calculateGameScore(game, context);
    return { ...game, _score: score, _matchReasons: reasons } as ScoredGame;
  });

  const filtered = scored.filter(g => g._score > 0);

  filtered.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    return (b.metacritic || 0) - (a.metacritic || 0) || (b.rating || 0) - (a.rating || 0);
  });

  return filtered;
}

/**
 * Human-readable label for the user's context.
 */
export function getContextLabel(context: UserContext): string {
  const parts: string[] = [];

  switch (context.withWhom) {
    case 'solo': parts.push('Solo'); break;
    case 'pareja': parts.push('En pareja'); break;
    case 'amigos': parts.push('Con amigos'); break;
  }

  switch (context.gameStyle) {
    case 'singleplayer': parts.push('Singleplayer'); break;
    case 'competitive-online': parts.push('Competitivo'); break;
    case 'mmo': parts.push('MMO'); break;
    case 'matchmaking': parts.push('Emparejamiento'); break;
    case 'coop-fun': parts.push('Cooperativo'); break;
    case 'party': parts.push('Party'); break;
  }

  if (context.playerCount) {
    parts.push(context.playerCount === '5+' ? '+5 jugadores' : `${context.playerCount} jugadores`);
  }

  if (context.budget === 'free') parts.push('Free to Play');

  return parts.join(' · ');
}
