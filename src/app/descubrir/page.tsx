import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import GameCarousel from '@/components/game/GameCarousel';
import DealsCarousel from '@/components/home/DealsCarousel';
import AdPlaceholder from '@/components/ui/AdPlaceholder';
import { getSteamDeals } from '@/lib/api/cheapshark';
import {
  getTrendingGames,
  getPopularGames,
  getFreeToPlayGames,
  getCoopGames,
  getNewReleases,
} from '@/lib/api/rawg';
import { Flame, Trophy, CircleDollarSign, Users, Sparkles } from 'lucide-react';
import { AD_SLOTS } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Descubrir | ¿A qué jugar hoy?',
  description: 'Descubrí juegos para PC: ofertas, tendencias, populares, free to play, cooperativos y más.',
};

export default async function DescubrirPage() {
  const [deals, trending, popular, freeToPlay, coop, newReleases] = await Promise.all([
    getSteamDeals(12).catch(() => []),
    getTrendingGames(12).catch(() => []),
    getPopularGames(12).catch(() => []),
    getFreeToPlayGames(12).catch(() => []),
    getCoopGames(12).catch(() => []),
    getNewReleases(12).catch(() => []),
  ]);

  return (
    <div className="min-h-screen">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 pb-12">
        {deals.length > 0 && (
          <DealsCarousel deals={deals} />
        )}

        <GameCarousel
          title="Tendencias"
          icon={<Flame className="w-5 h-5" />}
          games={trending}
          href="/explorar?ordering=-added"
        />

        <div className="py-2">
          <AdPlaceholder slot={AD_SLOTS.home_banner_1} size="banner" />
        </div>

        <GameCarousel
          title="Para Jugar con Amigos"
          icon={<Users className="w-5 h-5" />}
          games={coop}
          href="/explorar?tags=co-op&ordering=-added"
        />

        <div className="py-2">
          <AdPlaceholder slot={AD_SLOTS.home_banner_2} size="banner" />
        </div>

        <GameCarousel
          title="Free to Play"
          icon={<CircleDollarSign className="w-5 h-5" />}
          games={freeToPlay}
          href="/explorar?tags=free-to-play&ordering=-added"
        />

        <GameCarousel
          title="Lanzamientos Recientes"
          icon={<Sparkles className="w-5 h-5" />}
          games={newReleases}
          href="/explorar?ordering=-released"
        />

        <CategoryGrid />
      </div>
    </div>
  );
}
