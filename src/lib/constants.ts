// PC Platform ID for RAWG API
export const PC_PLATFORM_ID = 4;

// Genre mapping — no emojis, icon names reference Lucide components
export const GENRES = [
  { id: 4, name: 'Acción', slug: 'action', icon: 'Swords' },
  { id: 51, name: 'Indie', slug: 'indie', icon: 'Lightbulb' },
  { id: 3, name: 'Aventura', slug: 'adventure', icon: 'Compass' },
  { id: 5, name: 'RPG', slug: 'role-playing-games-rpg', icon: 'Shield' },
  { id: 10, name: 'Estrategia', slug: 'strategy', icon: 'BrainCircuit' },
  { id: 2, name: 'Shooter', slug: 'shooter', icon: 'Crosshair' },
  { id: 40, name: 'Casual', slug: 'casual', icon: 'Smile' },
  { id: 14, name: 'Simulación', slug: 'simulation', icon: 'Cpu' },
  { id: 7, name: 'Puzzle', slug: 'puzzle', icon: 'PuzzleIcon' },
  { id: 11, name: 'Arcade', slug: 'arcade', icon: 'Joystick' },
  { id: 83, name: 'Plataformas', slug: 'platformer', icon: 'Footprints' },
  { id: 1, name: 'Carreras', slug: 'racing', icon: 'Gauge' },
  { id: 59, name: 'MMO', slug: 'massively-multiplayer', icon: 'Globe' },
  { id: 15, name: 'Deportes', slug: 'sports', icon: 'Trophy' },
  { id: 6, name: 'Pelea', slug: 'fighting', icon: 'Flame' },
  { id: 19, name: 'Familiar', slug: 'family', icon: 'Heart' },
] as const;

// Special categories for the home page — no emojis
export const SPECIAL_CATEGORIES = [
  { name: 'Free to Play', slug: 'free-to-play', tag: 'free-to-play', icon: 'CircleDollarSign' },
  { name: 'Cooperativo', slug: 'coop', tag: 'co-op', icon: 'Users' },
  { name: 'Multijugador', slug: 'multiplayer', tag: 'multiplayer', icon: 'UsersRound' },
  { name: 'Un Jugador', slug: 'singleplayer', tag: 'singleplayer', icon: 'User' },
  { name: 'Competitivo', slug: 'competitive', tag: 'competitive', icon: 'Trophy' },
  { name: 'Terror', slug: 'horror', tag: 'horror', icon: 'Skull' },
  { name: 'Mundo Abierto', slug: 'open-world', tag: 'open-world', icon: 'Globe' },
  { name: 'Pixel Art', slug: 'pixel-art', tag: 'pixel-graphics', icon: 'Grid3X3' },
] as const;

// Ordering options
export const ORDERING_OPTIONS = [
  { value: '-added', label: 'Más populares' },
  { value: '-rating', label: 'Mejor puntuación' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: '-metacritic', label: 'Mejor Metacritic' },
  { value: '-released', label: 'Más recientes' },
  { value: 'name', label: 'Nombre (A-Z)' },
  { value: '-name', label: 'Nombre (Z-A)' },
] as const;

// Store RAWG IDs → our display info
export const STORES: Record<number, { name: string; slug: string }> = {
  1: { name: 'Steam', slug: 'steam' },
  11: { name: 'Epic Games', slug: 'epic-games' },
  5: { name: 'GOG', slug: 'gog' },
  2: { name: 'Microsoft Store', slug: 'xbox' }, // RAWG uses Xbox store for MS
  7: { name: 'Itch.io', slug: 'itch' },
};

// Tag options for filters (PC-relevant)
export const TAG_OPTIONS = [
  { value: 'singleplayer', label: 'Un jugador' },
  { value: 'multiplayer', label: 'Multijugador' },
  { value: 'co-op', label: 'Cooperativo' },
  { value: 'online-co-op', label: 'Coop Online' },
  { value: 'local-co-op', label: 'Coop Local' },
  { value: 'competitive', label: 'Competitivo' },
  { value: 'free-to-play', label: 'Free to Play' },
  { value: 'open-world', label: 'Mundo Abierto' },
  { value: 'horror', label: 'Terror' },
  { value: 'pvp', label: 'PvP' },
] as const;

// Curated list of party games because RAWG's tag system is poor for this category
export const CURATED_PARTY_GAMES = [
  'among-us',
  'pummel-party',
  'pico-park',
  'worms-w-m-d',
  'gang-beasts',
  'party-animals',
  'ultimate-chicken-horse',
  'human-fall-flat',
  'overcooked-2',
  'keep-talking-and-nobody-explodes',
  'move-or-die',
  'duck-game',
  'boomerang-fu',
  'heave-ho',
  'golf-with-your-friends',
  'golf-it',
  'stick-fight-the-game',
  'speedrunners',
  'mount-your-friends',
  'tricky-towers'
];

// ===== Monetization & External Links =====

export const DONATION_URL = 'https://cafecito.app/aquejugarhoy';

// Future ad slots configuration
export const AD_SLOTS = {
  home_banner_1: 'ad-home-banner-1',
  home_banner_2: 'ad-home-banner-2',
  explorer_sidebar: 'ad-explorer-sidebar',
  game_sidebar: 'ad-game-sidebar',
} as const;
