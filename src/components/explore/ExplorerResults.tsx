'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ScoredGame } from '@/lib/scoring';
import { getRatingColor, getMetacriticColor, translateSteamRating, translateGenre } from '@/lib/utils';
import { getGameRequirements } from '@/lib/scoring';
import { Star, Gamepad2, ArrowLeft, Sparkles, Heart, Users, Cpu, HardDrive, MonitorPlay, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { StoreIconsRow } from '@/components/ui/StoreIcons';
import PriceBadge from '@/components/ui/PriceBadge';

interface ResultsGameCardProps {
  game: ScoredGame;
  index: number;
  withWhom?: string;
}

interface ExplorerResultsProps {
  games: ScoredGame[];
  contextLabel: string;
  withWhom?: string;
  totalGames: number;
  currentPage?: number;
  totalPages?: number;
  searchParams?: Record<string, string | undefined>;
}

function getWhomIcon(withWhom?: string) {
  switch (withWhom) {
    case 'pareja': return <Heart className="w-3.5 h-3.5" />;
    case 'amigos': return <Users className="w-3.5 h-3.5" />;
    default: return <Gamepad2 className="w-3.5 h-3.5" />;
  }
}

const REQ_CONFIG = {
  low:  { icon: Cpu,         label: 'BAJA',  color: 'var(--color-rating-high)' },
  mid:  { icon: HardDrive,   label: 'MEDIA', color: 'var(--color-rating-mid)' },
  high: { icon: MonitorPlay, label: 'ALTA',  color: 'var(--color-error)' },
} as const;

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--color-rating-high)';
  if (score >= 40) return 'var(--color-accent-light)';
  return 'var(--color-text-muted)';
}

function ResultsGameCard({ game, index, withWhom }: ResultsGameCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const displayScore = Math.min(Math.round((game._score / 150) * 100), 100);
  const req = getGameRequirements(game);
  const reqInfo = REQ_CONFIG[req];
  const ReqIcon = reqInfo.icon;

  useEffect(() => {
    // Track as seen when shown
    trackInteraction('visto');
    
    // Check if is favorite
    fetch('/api/user/favorites')
      .then(res => res.json())
      .then(favs => {
        if (Array.isArray(favs) && favs.includes(game.slug)) {
          setIsFavorite(true);
        }
      })
      .catch(() => {});
  }, [game.slug]);

  const trackInteraction = async (accion: 'visto' | 'click') => {
    try {
      await fetch('/api/user/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.slug, accion })
      });
    } catch (e) {}
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.slug })
      });
      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch (e) {}
  };

  const isPersonalized = game._matchReasons.some(r => 
    r.includes('favoritos') || r.includes('perfil') || r.includes('Visto')
  );

  return (
    <Link
      href={`/juego/${game.slug}`}
      onClick={() => trackInteraction('click')}
      className="group block animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
      id={`result-card-${game.slug}`}
    >
      <div className="relative bg-bg-card rounded-xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
        {/* Top: Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-bg-elevated">
          {/* Personalized Badge */}
          {isPersonalized && (
            <div className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full shadow-lg animate-pulse flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              RECOMENDADO PARA VOS
            </div>
          )}

          {game.steamAppId || game.background_image ? (
            <Image
              src={game.steamAppId ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.steamAppId}/header.jpg` : (game.background_image as string)}
              alt={game.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gamepad2 className="w-10 h-10 text-text-muted" />
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 p-1.5 rounded-lg border backdrop-blur-md transition-all duration-200 ${
              isFavorite 
                ? 'bg-error/20 border-error text-error' 
                : 'bg-black/40 border-white/20 text-white/70 hover:text-white hover:border-white/40'
            }`}
            title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Hardware requirement badge */}
          <div
            className="absolute bottom-2 left-3 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold backdrop-blur-sm border"
            style={{ color: reqInfo.color, borderColor: reqInfo.color, backgroundColor: 'rgba(0,0,0,0.75)' }}
          >
            <ReqIcon className="w-2.5 h-2.5" />
            {reqInfo.label}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-semibold text-base text-text-primary group-hover:text-accent-light transition-colors line-clamp-1 leading-snug">
              {game.name}
            </h3>
            {game.priceInfo ? (
              <PriceBadge
                normalPrice={game.priceInfo.normalPrice}
                salePrice={game.priceInfo.salePrice}
                discountPercent={game.priceInfo.discountPercent}
                isFree={game.priceInfo.isFree}
                size="sm"
              />
            ) : (
              <span className="text-[10px] text-text-muted font-medium bg-bg-elevated px-1.5 py-0.5 rounded border border-border shrink-0">
                Precio no disp.
              </span>
            )}
          </div>

          {/* Genre row */}
          <div className="flex items-center gap-2">
            {game.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-0.5 bg-bg-elevated text-text-muted text-[10px] rounded"
              >
                {translateGenre(genre.name)}
              </span>
            ))}
          </div>

          {/* Steam Rating row */}
          <div className="min-h-[1.5rem]">
            {game.priceInfo?.steamRatingText ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-accent-light">
                  {translateSteamRating(game.priceInfo.steamRatingText)}
                </span>
                <span className="text-[11px] text-text-muted">
                  ({game.priceInfo.steamRatingPercent}% de {game.priceInfo.steamRatingCount?.toLocaleString()} reseñas)
                </span>
              </div>
            ) : game.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-[11px] font-medium text-text-muted">
                  {game.rating.toFixed(1)} (RAWG)
                </span>
              </div>
            )}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-1 border-t border-border/50">
            <div className="flex items-center gap-3">
              <StoreIconsRow stores={game.stores} className="w-3.5 h-3.5" />
              {game.released && (
                <span className="text-[10px] text-text-muted font-medium">
                  {new Date(game.released).getFullYear()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-accent group-hover:translate-x-1 transition-transform">
              VER MÁS <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ===== Main Results Section =====

export default function ExplorerResults({ games, contextLabel, withWhom, totalGames, currentPage = 1, totalPages = 1, searchParams }: ExplorerResultsProps) {
  const [sortOrder, setSortOrder] = useState<'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'popularity'>('relevance');
  const whomIcon = getWhomIcon(withWhom);

  const sortedGames = [...games].sort((a, b) => {
    switch (sortOrder) {
      case 'price-asc':
        return (a.priceInfo?.salePrice || 0) - (b.priceInfo?.salePrice || 0);
      case 'price-desc':
        return (b.priceInfo?.salePrice || 0) - (a.priceInfo?.salePrice || 0);
      case 'newest':
        return new Date(b.released || 0).getTime() - new Date(a.released || 0).getTime();
      case 'rating':
        return (b.priceInfo?.steamRatingPercent || 0) - (a.priceInfo?.steamRatingPercent || 0);
      case 'popularity':
        return (b.ratings_count || 0) - (a.ratings_count || 0);
      default:
        return b._score - a._score;
    }
  });

  const getPageUrl = (page: number) => {
    if (!searchParams) return '#';
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set('page', page.toString());
    return `/explorar?${params.toString()}`;
  };

  const sortOptions = [
    { id: 'relevance', label: 'Recomendados' },
    { id: 'price-asc', label: 'Precio: Menor a mayor' },
    { id: 'price-desc', label: 'Precio: Mayor a menor' },
    { id: 'newest', label: 'Más nuevos' },
    { id: 'rating', label: 'Mejor valorados' },
    { id: 'popularity', label: 'Más populares' },
  ];

  return (
    <section className="animate-fade-in">
      {/* Results header + Sorting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-accent/10 rounded-lg text-accent">
              {whomIcon}
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-semibold text-text-primary">
              Recomendados para vos
            </h1>
          </div>
          <p className="text-text-muted text-sm flex items-center gap-2">
            <span className="px-2 py-0.5 bg-bg-elevated border border-border rounded text-[11px] text-text-secondary">
              {contextLabel}
            </span>
            <span>· {totalGames} juegos encontrados</span>
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Ordenar por:</span>
          <div className="relative group">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="appearance-none bg-bg-card border border-border px-4 py-2 pr-10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent transition-all cursor-pointer hover:border-border-hover shadow-sm"
            >
              {sortOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none group-hover:text-accent transition-colors" />
          </div>
        </div>
      </div>

      {/* Game grid */}
      {games.length > 0 ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedGames.map((game, index) => (
              <ResultsGameCard key={game.id} game={game} index={index} withWhom={withWhom} />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              {currentPage > 1 ? (
                <Link
                  href={getPageUrl(currentPage - 1)}
                  className="px-4 py-2 bg-bg-card border border-border rounded-md text-sm font-medium hover:border-accent/50 hover:text-accent transition-colors"
                >
                  Anterior
                </Link>
              ) : (
                <button disabled className="px-4 py-2 bg-bg-card border border-border rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
                  Anterior
                </button>
              )}
              
              <span className="text-sm text-text-muted">
                Página {currentPage} de {totalPages}
              </span>
              
              {currentPage < totalPages ? (
                <Link
                  href={getPageUrl(currentPage + 1)}
                  className="px-4 py-2 bg-bg-card border border-border rounded-md text-sm font-medium hover:border-accent/50 hover:text-accent transition-colors"
                >
                  Siguiente
                </Link>
              ) : (
                <button disabled className="px-4 py-2 bg-bg-card border border-border rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
                  Siguiente
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-bg-card border border-border border-dashed rounded-xl">
          <Gamepad2 className="w-10 h-10 text-text-muted mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
            No encontramos juegos para esta combinación
          </h3>
          <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
            Probá ajustando tus filtros para ver más opciones.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-accent-light text-sm hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a elegir filtros
          </Link>
        </div>
      )}
    </section>
  );
}
