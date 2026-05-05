'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Shuffle } from 'lucide-react';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explorar?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="pt-20 pb-8 sm:pb-12">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text-primary mb-3">
          Descubrí juegos para PC
        </h1>
        <p className="text-text-muted text-sm mb-6">
          Explorá miles de juegos, filtrá por género, jugadores y precio.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar juegos..."
            className="w-full pl-10 pr-24 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            id="hero-search"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-accent hover:bg-accent-dark text-white text-xs font-medium rounded-md transition-colors"
            id="hero-search-btn"
          >
            Buscar
          </button>
        </form>

        {/* Surprise button */}
        <button
          onClick={() => router.push('/explorar?random=true')}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-border rounded-md text-text-muted text-xs hover:text-text-primary hover:border-border-hover transition-colors"
          id="hero-surprise-btn"
        >
          <Shuffle className="w-3.5 h-3.5" />
          Sorpréndeme
        </button>
      </div>
    </section>
  );
}
