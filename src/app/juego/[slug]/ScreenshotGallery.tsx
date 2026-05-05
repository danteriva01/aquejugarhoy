'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Screenshot } from '@/lib/api/types';

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  gameName: string;
}

export default function ScreenshotGallery({ screenshots, gameName }: ScreenshotGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const navigate = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;
    if (direction === 'prev') {
      setLightboxIndex(lightboxIndex === 0 ? screenshots.length - 1 : lightboxIndex - 1);
    } else {
      setLightboxIndex(lightboxIndex === screenshots.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {screenshots.slice(0, 6).map((ss, i) => (
          <button
            key={ss.id}
            onClick={() => openLightbox(i)}
            className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer border border-border hover:border-accent/40 transition-all"
          >
            <Image
              src={ss.image}
              alt={`${gameName} screenshot ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
              style={{ transitionDuration: '300ms' }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={screenshots[lightboxIndex].image}
              alt={`${gameName} screenshot ${lightboxIndex + 1}`}
              width={1920}
              height={1080}
              className="object-contain w-full h-auto max-h-[85vh] rounded-lg"
            />
            <p className="text-center text-text-muted text-sm mt-3">
              {lightboxIndex + 1} / {screenshots.length}
            </p>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate('next'); }}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
}
