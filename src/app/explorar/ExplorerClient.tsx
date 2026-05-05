'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useTransition } from 'react';
import { SlidersHorizontal, X, Search, ChevronDown, Loader2 } from 'lucide-react';
import type { Game, Genre } from '@/lib/api/types';
import { ORDERING_OPTIONS, TAG_OPTIONS, AD_SLOTS } from '@/lib/constants';
import GameGrid from '@/components/game/GameGrid';
import AdPlaceholder from '@/components/ui/AdPlaceholder';

interface ExplorerClientProps {
  initialGames: Game[];
  totalCount: number;
  genres: Genre[];
  currentParams: Record<string, string | undefined>;
}

export default function ExplorerClient({ initialGames, totalCount, genres, currentParams }: ExplorerClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(currentParams.search || '');

  const updateParams = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== 'page') {
        params.delete('page');
      }
      
      startTransition(() => {
        router.push(`/explorar?${params.toString()}`, { scroll: true });
      });
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams('search', searchInput.trim() || undefined);
  };

  const clearAllFilters = () => {
    router.push('/explorar');
    setSearchInput('');
  };

  const activeFilterCount = [
    currentParams.search,
    currentParams.genres,
    currentParams.tags,
    currentParams.metacritic,
    currentParams.dates,
  ].filter(Boolean).length;

  const currentPage = parseInt(currentParams.page || '1');

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text-primary mb-1">
          Explorar Juegos
        </h1>
        <p className="text-text-muted text-sm">
          {totalCount.toLocaleString('es-AR')} juegos de PC encontrados
        </p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar juegos..."
            className="w-full pl-9 pr-3 py-2 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            id="explorer-search"
          />
        </form>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-accent/8 border-accent/30 text-accent-light'
                : 'bg-bg-card border-border text-text-muted hover:text-text-primary'
            }`}
            id="toggle-filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <select
            value={currentParams.ordering || '-added'}
            onChange={(e) => updateParams('ordering', e.target.value)}
            className="px-3 py-2 bg-bg-card border border-border rounded-lg text-sm text-text-muted focus:outline-none focus:border-accent/50 cursor-pointer"
            id="ordering-select"
          >
            {ORDERING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          <span className="text-text-muted text-[10px] uppercase tracking-wider">Filtros:</span>
          {currentParams.search && (
            <FilterChip label={`"${currentParams.search}"`} onRemove={() => { updateParams('search', undefined); setSearchInput(''); }} />
          )}
          {currentParams.genres && (
            <FilterChip label={currentParams.genres} onRemove={() => updateParams('genres', undefined)} />
          )}
          {currentParams.tags && (
            <FilterChip label={currentParams.tags.split(',').join(', ')} onRemove={() => updateParams('tags', undefined)} />
          )}
          {currentParams.metacritic && (
            <FilterChip label={`MC ${currentParams.metacritic}`} onRemove={() => updateParams('metacritic', undefined)} />
          )}
          <button onClick={clearAllFilters} className="text-error text-[10px] hover:underline ml-1">
            Limpiar
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-bg-card border border-border rounded-xl animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FilterSelect
              label="Género"
              value={currentParams.genres}
              onChange={(v) => updateParams('genres', v)}
              options={genres.map((g) => ({ value: g.slug, label: g.name }))}
            />

            <FilterSelect
              label="Tipo de juego"
              value={currentParams.tags}
              onChange={(v) => updateParams('tags', v)}
              options={TAG_OPTIONS.map(t => ({ value: t.value, label: t.label }))}
            />

            <FilterSelect
              label="Metacritic mínimo"
              value={currentParams.metacritic}
              onChange={(v) => updateParams('metacritic', v)}
              options={[
                { value: '90,100', label: '90+ Excepcional' },
                { value: '80,100', label: '80+ Excelente' },
                { value: '70,100', label: '70+ Bueno' },
                { value: '60,100', label: '60+ Mixto' },
              ]}
            />
          </div>
        </div>
      )}

      {/* Main Layout with Ad Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full relative">
          {/* Transition Overlay */}
          {isPending && (
            <div className="absolute inset-0 z-20 bg-bg-primary/40 backdrop-blur-[2px] flex items-start justify-center pt-20 rounded-xl transition-all">
              <div className="bg-bg-card border border-border px-4 py-3 rounded-full shadow-2xl flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
                <span className="text-sm font-medium text-text-primary">Actualizando resultados...</span>
              </div>
            </div>
          )}

          {/* Game Grid */}
          <GameGrid games={initialGames} />

          {/* Pagination */}
          {totalCount > 20 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              {currentPage > 1 && (
                <button
                  onClick={() => updateParams('page', String(currentPage - 1))}
                  className="px-4 py-2 bg-bg-card border border-border rounded-lg text-sm text-text-muted hover:text-text-primary hover:border-border-hover transition-colors"
                >
                  Anterior
                </button>
              )}
              <span className="text-text-muted text-xs">
                {currentPage} / {Math.ceil(totalCount / 20)}
              </span>
              {currentPage < Math.ceil(totalCount / 20) && (
                <button
                  onClick={() => updateParams('page', String(currentPage + 1))}
                  className="px-4 py-2 bg-accent/8 border border-accent/20 rounded-lg text-sm text-accent-light hover:bg-accent/12 transition-colors"
                >
                  Siguiente
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[300px] shrink-0 sticky top-24">
          <AdPlaceholder slot={AD_SLOTS.explorer_sidebar} size="sidebar" />
        </aside>
      </div>
    </div>
  );
}

// ===== Sub-components =====

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg-elevated border border-border rounded text-text-secondary text-[11px]">
      {label}
      <button onClick={onRemove} className="hover:text-error transition-colors">
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-text-muted text-[10px] uppercase tracking-wider font-medium mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value || 'all'}
          onChange={(e) => onChange(e.target.value === 'all' ? undefined : e.target.value)}
          className="w-full px-3 py-2 bg-bg-input border border-border rounded-md text-sm text-text-primary focus:outline-none focus:border-accent/50 cursor-pointer appearance-none"
        >
          <option value="all">Todos</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
      </div>
    </div>
  );
}
