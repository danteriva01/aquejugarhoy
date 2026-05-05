import type { Game } from '@/lib/api/types';
import GameCard from './GameCard';
import GameCardSkeleton from './GameCardSkeleton';
import { Search } from 'lucide-react';

interface GameGridProps {
  games: Game[];
  loading?: boolean;
  skeletonCount?: number;
}

export default function GameGrid({ games, loading = false, skeletonCount = 12 }: GameGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-20 bg-bg-card border border-border border-dashed rounded-xl my-4">
        <Search className="w-10 h-10 text-text-muted mx-auto mb-4" />
        <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">No se encontraron juegos</h3>
        <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
          No hay resultados para esta combinación exacta de filtros. Probá eliminando algunos para ver más opciones.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {games.map((game, index) => (
        <GameCard key={game.id} game={game} index={index} />
      ))}
    </div>
  );
}
