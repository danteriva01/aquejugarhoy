export function getRatingColor(rating: number): string {
  if (rating >= 4) return 'var(--color-rating-high)';
  if (rating >= 3) return 'var(--color-rating-mid)';
  return 'var(--color-rating-low)';
}

export function getMetacriticColor(score: number): string {
  if (score >= 75) return 'var(--color-rating-high)';
  if (score >= 50) return 'var(--color-rating-mid)';
  return 'var(--color-rating-low)';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function buildFilterParams(filters: Record<string, string | undefined>): Record<string, string> {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '' && value !== 'all') {
      params[key] = value;
    }
  });
  return params;
}

export function translateSteamRating(text: string | null | undefined): string {
  if (!text) return '';
  const normalized = text.trim();
  const translations: Record<string, string> = {
    'Overwhelmingly Positive': 'Extremadamente positivas',
    'Very Positive': 'Muy positivas',
    'Positive': 'Positivas',
    'Mostly Positive': 'Mayormente positivas',
    'Mixed': 'Variadas',
    'Mostly Negative': 'Mayormente negativas',
    'Negative': 'Negativas',
    'Very Negative': 'Muy negativas',
    'Overwhelmingly Negative': 'Extremadamente negativas',
  };
  
  // Try exact match first
  if (translations[normalized]) return translations[normalized];
  
  // Try case-insensitive match
  const entry = Object.entries(translations).find(
    ([key]) => key.toLowerCase() === normalized.toLowerCase()
  );
  return entry ? entry[1] : normalized;
}

export function translateGenre(name: string | null | undefined): string {
  if (!name) return '';
  const normalized = name.trim();
  const translations: Record<string, string> = {
    'Action': 'Acción',
    'Adventure': 'Aventura',
    'Strategy': 'Estrategia',
    'Role-Playing': 'RPG',
    'RPG': 'RPG',
    'Puzzle': 'Puzles',
    'Arcade': 'Arcade',
    'Simulation': 'Simulación',
    'Sports': 'Deportes',
    'Fighting': 'Lucha',
    'Racing': 'Carreras',
    'Shooter': 'Disparos',
    'Casual': 'Casual',
    'Massively Multiplayer': 'MMO',
    'Indie': 'Indie',
    'Platformer': 'Plataformas',
    'Family': 'Familia',
    'Educational': 'Educativo',
    'Card': 'Cartas',
    'Board Games': 'Mesa',
  };
  
  if (translations[normalized]) return translations[normalized];
  
  const entry = Object.entries(translations).find(
    ([key]) => key.toLowerCase() === normalized.toLowerCase()
  );
  return entry ? entry[1] : normalized;
}

export function getStoreUrl(storeDomain: string, url?: string): string {
  return url || `https://${storeDomain}`;
}
