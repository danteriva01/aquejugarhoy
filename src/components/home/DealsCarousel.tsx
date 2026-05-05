'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import type { CheapSharkDeal } from '@/lib/api/types';
import DealCard from '@/components/game/DealCard';

interface DealsCarouselProps {
  deals: CheapSharkDeal[];
}

export default function DealsCarousel({ deals }: DealsCarouselProps) {
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
  }, [deals]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!deals || deals.length === 0) return null;

  return (
    <section className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg sm:text-xl font-semibold text-text-primary flex items-center gap-2">
          <Tag className="w-5 h-5 text-accent-light" />
          En Oferta Hoy
        </h2>
        <div className="flex items-center gap-2">
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
        {deals.map((deal, index) => (
          <div key={deal.dealID} className="flex-shrink-0 w-[240px] sm:w-[260px]">
            <DealCard deal={deal} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
