'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Game } from '@/lib/api/types';
import GameCard from './GameCard';

interface GameCarouselProps {
  title: string;
  icon?: ReactNode;
  games: Game[];
  href?: string;
}

export default function GameCarousel({ title, icon, games, href }: GameCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [games]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (games.length === 0) return null;

  return (
    <section className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg sm:text-xl font-semibold text-text-primary flex items-center gap-2">
          {icon && <span className="text-text-muted">{icon}</span>}
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {href && (
            <a href={href} className="text-accent-light text-xs hover:text-accent transition-colors mr-2">
              Ver todos
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="hidden sm:flex w-7 h-7 items-center justify-center rounded-md bg-bg-card border border-border text-text-muted hover:text-text-primary hover:border-border-hover transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Scroll izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="hidden sm:flex w-7 h-7 items-center justify-center rounded-md bg-bg-card border border-border text-text-muted hover:text-text-primary hover:border-border-hover transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Scroll derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-1"
      >
        {games.map((game, index) => (
          <div key={game.id} className="flex-shrink-0 w-[240px] sm:w-[260px]">
            <GameCard game={game} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
