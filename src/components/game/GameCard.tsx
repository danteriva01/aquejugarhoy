import Link from 'next/link';
import Image from 'next/image';
import type { Game } from '@/lib/api/types';
import { getRatingColor, getMetacriticColor, translateSteamRating, translateGenre } from '@/lib/utils';
import { getGameRequirements } from '@/lib/scoring';
import { Star, Gamepad2, Cpu, HardDrive, MonitorPlay } from 'lucide-react';
import { StoreIconsRow } from '@/components/ui/StoreIcons';
import PriceBadge from '@/components/ui/PriceBadge';

interface GameCardProps {
  game: Game;
  index?: number;
}

const REQ_CONFIG = {
  low:  { icon: Cpu,         label: 'Requisitos bajos',  color: 'var(--color-rating-high)' },
  mid:  { icon: HardDrive,   label: 'Requisitos medios', color: 'var(--color-rating-mid)' },
  high: { icon: MonitorPlay, label: 'Requisitos altos',  color: 'var(--color-error)' },
} as const;

export default function GameCard({ game, index = 0 }: GameCardProps) {
  const req = getGameRequirements(game);
  const reqInfo = REQ_CONFIG[req];
  const ReqIcon = reqInfo.icon;

  const trackHistory = async () => {
    try {
      await fetch('/api/user/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.slug })
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <Link
      href={`/juego/${game.slug}`}
      onClick={trackHistory}
      className="group block animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
      id={`game-card-${game.slug}`}
    >
      <div className="relative bg-bg-card rounded-lg overflow-hidden border border-border hover:border-border-hover transition-colors duration-200">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-bg-elevated">
          {game.steamAppId || game.background_image ? (
            <Image
              src={game.steamAppId ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.steamAppId}/header.jpg` : (game.background_image ?? '')}
              alt={game.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-text-muted" />
            </div>
          )}

          {/* Hardware requirements badge */}
          <div
            className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold backdrop-blur-sm border"
            style={{
              color: reqInfo.color,
              borderColor: reqInfo.color,
              backgroundColor: 'rgba(0,0,0,0.75)',
            }}
            title={reqInfo.label}
          >
            <ReqIcon className="w-2.5 h-2.5" />
            {req === 'low' ? 'BAJA' : req === 'mid' ? 'MEDIA' : 'ALTA'}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h3 className="font-heading font-medium text-sm text-text-primary group-hover:text-accent-light transition-colors duration-200 line-clamp-1 leading-snug">
            {game.name}
          </h3>

          {/* Genre pill + Store icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {game.genres.slice(0, 1).map((genre) => (
                <span
                  key={genre.id}
                  className="px-2 py-0.5 bg-bg-elevated text-text-muted text-[10px] rounded"
                >
                  {translateGenre(genre.name)}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {game._curatedContext?.plataforma?.map(platform => (
                <span 
                  key={platform} 
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    platform === 'Steam' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                    platform === 'Epic' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                    'bg-bg-elevated text-text-muted border border-border'
                  }`}
                >
                  {platform}
                </span>
              ))}
              <StoreIconsRow stores={game.stores} className="w-3 h-3" />
            </div>
          </div>

            {/* Rating, Year & Price */}
            <div className="flex items-end justify-between mt-auto">
              <div className="flex flex-col gap-1.5">
                {game.priceInfo?.steamRatingText ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-accent-light uppercase tracking-tight leading-none">
                      {translateSteamRating(game.priceInfo.steamRatingText)}
                    </span>
                    {game.priceInfo.steamRatingPercent !== undefined && (
                      <span className="text-[9px] text-text-muted leading-none">
                        {game.priceInfo.steamRatingPercent}% positivos
                      </span>
                    )}
                  </div>
                ) : game.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[11px] font-medium text-text-muted">
                      {game.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {game.released && (
                  <span className="text-[10px] text-text-muted">
                    {new Date(game.released).getFullYear()}
                  </span>
                )}
              </div>

            {/* Price Badge */}
            {(game.priceInfo || game._curatedContext?.precio === 'free_to_play') ? (
              <PriceBadge
                normalPrice={game.priceInfo?.normalPrice ?? 0}
                salePrice={game.priceInfo?.salePrice ?? 0}
                discountPercent={game.priceInfo?.discountPercent ?? 0}
                isFree={game.priceInfo?.isFree || game._curatedContext?.precio === 'free_to_play'}
                size="sm"
              />
            ) : (
              <span className="text-[10px] text-text-muted font-medium bg-bg-elevated px-1.5 py-0.5 rounded border border-border">
                Precio no disp.
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
