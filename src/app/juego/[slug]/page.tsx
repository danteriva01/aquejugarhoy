import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Clock, Globe, ExternalLink, Monitor, ChevronLeft, Tag, FileText, Image as ImageIcon } from 'lucide-react';
import { getGameBySlug, getGameScreenshots, getSimilarGames, getGameTrailers } from '@/lib/api/rawg';
import { enrichGamesWithSteamData } from '@/lib/api/steam';
import { getRatingColor, getMetacriticColor, formatDate, stripHtml } from '@/lib/utils';
import { StoreIcon } from '@/components/ui/StoreIcons';
import { STORES, AD_SLOTS } from '@/lib/constants';
import GameCarousel from '@/components/game/GameCarousel';
import { Gamepad2 } from 'lucide-react';
import ScreenshotGallery from './ScreenshotGallery';
import AdPlaceholder from '@/components/ui/AdPlaceholder';
import PriceBadge from '@/components/ui/PriceBadge';

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const game = await getGameBySlug(slug);
    return {
      title: game.name,
      description: stripHtml(game.description || '').slice(0, 160),
      openGraph: {
        title: game.name,
        description: stripHtml(game.description || '').slice(0, 160),
        images: game.background_image ? [{ url: game.background_image }] : [],
      },
    };
  } catch {
    return { title: 'Juego no encontrado' };
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;

  let game, screenshots, similar, trailers;
  try {
    const initialGame = await getGameBySlug(slug);
    const [gameData, screenshotsData, similarGamesRaw, trailersData] = await Promise.all([
      enrichGamesWithSteamData([initialGame]).then(res => res[0]),
      getGameScreenshots(initialGame.id).catch(() => ({ results: [] })),
      getSimilarGames(initialGame.id, 8).catch(() => ({ results: [] })),
      getGameTrailers(initialGame.id).catch(() => ({ results: [] })),
    ]);

    game = gameData;
    screenshots = screenshotsData;
    similar = { results: await enrichGamesWithSteamData(similarGamesRaw.results) };
    trailers = trailersData;
  } catch {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h1 className="font-heading text-xl font-semibold text-text-primary mb-2">Juego no encontrado</h1>
          <p className="text-text-muted text-sm mb-6">No pudimos encontrar el juego que buscás.</p>
          <Link href="/explorar" className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors">
            Explorar juegos
          </Link>
        </div>
      </div>
    );
  }

  const description = game.description_raw || stripHtml(game.description || '');

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden">
        {game.background_image && (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/70 to-bg-primary/20" />

        {/* Back button */}
        <Link
          href="/explorar"
          className="absolute top-18 left-4 sm:left-6 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md bg-bg-primary/60 backdrop-blur-sm border border-border text-text-muted text-xs hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Volver
        </Link>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-7xl mx-auto">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3 leading-tight">
            {game.name}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {game.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" style={{ color: getRatingColor(game.rating) }} fill={getRatingColor(game.rating)} />
                <span className="font-medium" style={{ color: getRatingColor(game.rating) }}>
                  {game.rating.toFixed(1)}
                </span>
                <span className="text-text-muted text-xs">({game.ratings_count.toLocaleString('es-AR')})</span>
              </div>
            )}

            {game.metacritic && (
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-bold border"
                style={{
                  color: getMetacriticColor(game.metacritic),
                  borderColor: getMetacriticColor(game.metacritic),
                }}
              >
                MC {game.metacritic}
              </span>
            )}

            {game.released && (
              <div className="flex items-center gap-1 text-text-muted text-xs">
                <Calendar className="w-3 h-3" />
                {formatDate(game.released)}
              </div>
            )}

            {game.playtime > 0 && (
              <div className="flex items-center gap-1 text-text-muted text-xs">
                <Clock className="w-3 h-3" />
                ~{game.playtime}h
              </div>
            )}

            {game.priceInfo && (
              <div className="ml-auto">
                <PriceBadge
                  normalPrice={game.priceInfo.normalPrice}
                  salePrice={game.priceInfo.salePrice}
                  discountPercent={game.priceInfo.discountPercent}
                  isFree={game.priceInfo.isFree}
                  size="md"
                  className="bg-bg-primary/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border"
                />
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {game.genres.map((g) => (
              <Link
                key={g.id}
                href={`/explorar?genres=${g.slug}`}
                className="px-2 py-0.5 bg-bg-card/80 backdrop-blur-sm border border-border rounded text-text-secondary text-[11px] hover:text-text-primary hover:border-border-hover transition-colors"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshots */}
            {screenshots && screenshots.results.length > 0 && (
              <section>
                <h2 className="font-heading text-base font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-text-muted" /> Capturas
                </h2>
                <ScreenshotGallery screenshots={screenshots.results} gameName={game.name} />
              </section>
            )}

            {/* Trailers */}
            {trailers && trailers.results.length > 0 && (
              <section>
                <h2 className="font-heading text-base font-semibold text-text-primary mb-3">Trailers</h2>
                <div className="space-y-3">
                  {trailers.results.slice(0, 2).map((trailer) => (
                    <div key={trailer.id} className="rounded-lg overflow-hidden border border-border">
                      <video
                        controls
                        poster={trailer.preview}
                        className="w-full aspect-video bg-bg-card"
                        preload="none"
                      >
                        <source src={trailer.data.max} type="video/mp4" />
                      </video>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            {description && (
              <section>
                <h2 className="font-heading text-base font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-text-muted" /> Descripción
                </h2>
                <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                  {description.slice(0, 2000)}
                </div>
              </section>
            )}

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <section>
                <h2 className="font-heading text-base font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-text-muted" /> Tags
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {game.tags.filter(t => t.language === 'eng').slice(0, 20).map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/explorar?tags=${tag.slug}`}
                      className="px-2 py-0.5 bg-bg-card border border-border rounded text-text-muted text-[11px] hover:text-text-primary hover:border-border-hover transition-colors"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Info Card */}
            <div className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="font-heading text-sm font-semibold text-text-primary">Información</h3>

              {game.developers && game.developers.length > 0 && (
                <InfoRow label="Desarrollador" value={game.developers.map((d) => d.name).join(', ')} />
              )}
              {game.publishers && game.publishers.length > 0 && (
                <InfoRow label="Publicador" value={game.publishers.map((p) => p.name).join(', ')} />
              )}
              {game.released && <InfoRow label="Lanzamiento" value={formatDate(game.released)} />}
              {game.playtime > 0 && <InfoRow label="Tiempo promedio" value={`~${game.playtime} horas`} />}
              {game.esrb_rating && <InfoRow label="Clasificación" value={game.esrb_rating.name} />}

              {game.website && (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-accent-light text-xs hover:underline mt-1"
                >
                  <Globe className="w-3.5 h-3.5" /> Sitio web oficial
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>

            {/* Stores — with SVG logos */}
            {game.stores && game.stores.length > 0 && (
              <div className="bg-bg-card border border-border rounded-xl p-4">
                <h3 className="font-heading text-sm font-semibold text-text-primary mb-3">Disponible en</h3>
                <div className="space-y-1.5">
                  {game.stores.map((s) => {
                    const storeInfo = STORES[s.store.id];
                    return (
                      <a
                        key={s.id}
                        href={s.url || `https://${s.store.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 bg-bg-elevated rounded-lg border border-border hover:border-border-hover transition-colors text-xs group"
                      >
                        <div className="flex items-center gap-2">
                          <StoreIcon storeId={s.store.id} className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />
                          <span className="text-text-secondary group-hover:text-text-primary transition-colors font-medium">
                            {storeInfo?.name || s.store.name}
                          </span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-text-muted" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PC Requirements */}
            {game.pc_requirements?.minimum && (
              <div className="bg-bg-card border border-border rounded-xl p-4">
                <h3 className="font-heading text-sm font-semibold text-text-primary mb-3 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-text-muted" /> Requisitos PC
                </h3>
                <div className="text-text-muted text-[11px] leading-relaxed whitespace-pre-line">
                  {stripHtml(game.pc_requirements.minimum)}
                </div>
                {game.pc_requirements.recommended && (
                  <details className="mt-2">
                    <summary className="text-accent-light text-[11px] cursor-pointer hover:underline">
                      Ver recomendados
                    </summary>
                    <div className="mt-1.5 text-text-muted text-[11px] leading-relaxed whitespace-pre-line">
                      {stripHtml(game.pc_requirements.recommended)}
                    </div>
                  </details>
                )}
              </div>
            )}

            <div className="pt-2">
              <AdPlaceholder slot={AD_SLOTS.game_sidebar} size="sidebar" />
            </div>
          </aside>
        </div>

        {/* Similar Games */}
        {similar.results.length > 0 && (
          <div className="mt-16">
            <GameCarousel
              title="Juegos Similares"
              icon={<Gamepad2 className="w-5 h-5" />}
              games={similar.results}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-text-muted text-[10px] uppercase tracking-wider">{label}</span>
      <span className="text-text-primary text-xs">{value}</span>
    </div>
  );
}
