import Link from 'next/link';
import { Play, Clapperboard } from 'lucide-react';
import type { CuratedVideo } from '@/lib/data/reels';

interface VideoSectionProps {
  videos: CuratedVideo[];
  contextLabel?: string;
}

/**
 * Curated video section — shows Instagram reel embeds for recommended games.
 * This is a complement to the game results, NOT the primary content.
 */
export default function VideoSection({ videos, contextLabel }: VideoSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border animate-fade-in">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-accent/10 rounded-lg text-accent">
            <Clapperboard className="w-4 h-4" />
          </div>
          <h2 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">
            Videos de juegos recomendados
          </h2>
        </div>
        <p className="text-text-muted text-sm">
          Mirá gameplay y reseñas de juegos que encajan con tu perfil
        </p>
      </div>

      {/* Videos grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-bg-card border border-border rounded-xl overflow-hidden hover:border-border-hover transition-colors"
          >
            {/* Instagram Embed */}
            <div className="relative w-full" style={{ paddingBottom: '125%' }}>
              <iframe
                src={`${video.instagramUrl}embed/`}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                title={`Video de ${video.title}`}
              />
            </div>

            {/* Info overlay below */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading font-semibold text-sm text-text-primary line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-text-muted text-xs mt-0.5">
                    {video.description}
                  </p>
                </div>
                <Link
                  href={`/juego/${video.gameSlug}`}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-accent/8 border border-accent/20 rounded-lg text-accent-light text-[11px] font-medium hover:bg-accent/15 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  Ver ficha
                </Link>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-wider font-bold text-accent-light/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Link to Instagram for more */}
      <div className="text-center mt-8">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted text-xs hover:text-text-secondary transition-colors underline underline-offset-4"
        >
          Ver más contenido en Instagram
        </a>
      </div>
    </section>
  );
}
