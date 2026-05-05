'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RefreshCw, LayoutGrid, Clock, Lock, Library } from 'lucide-react';
import type { User, SteamGame } from '@/lib/data/db';

interface ProfileClientProps {
  initialUser: User | null;
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncLibrary = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch('/api/steam/games');
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      if (data.isPrivate) {
        setSyncError(data.message);
      } else {
        // Refresh local state (in a real app we'd fetch the user again)
        window.location.reload();
      }
    } catch (e) {
      setSyncError('Error al sincronizar con Steam. Reintenta más tarde.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!user) return null;

  const sortedGames = [...(user.juegosSteam || [])].sort((a, b) => b.playtime_forever - a.playtime_forever);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-bg-card p-6 rounded-2xl border border-border shadow-xl">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-accent shadow-lg shadow-accent/20">
          <Image src={user.avatar} alt={user.name} fill className="object-cover" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <h1 className="text-3xl font-heading font-bold text-text-primary">{user.name}</h1>
          <p className="text-text-muted flex items-center justify-center md:justify-start gap-2">
            <Library className="w-4 h-4" />
            {user.juegosSteam?.length || 0} juegos en tu biblioteca
          </p>
        </div>
        <button
          onClick={syncLibrary}
          disabled={isSyncing}
          className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light disabled:bg-accent/50 text-white rounded-xl transition-all font-bold shadow-lg shadow-accent/20"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Actualizar Biblioteca'}
        </button>
      </div>

      {syncError && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl flex items-center gap-3">
          <Lock className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{syncError}</p>
        </div>
      )}

      {/* Library Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold text-text-primary flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-accent" />
            Tu Biblioteca de Steam
          </h2>
          {user.lastSync && (
            <span className="text-[10px] text-text-muted uppercase tracking-widest">
              Última sincronización: {new Date(user.lastSync).toLocaleDateString()}
            </span>
          )}
        </div>

        {sortedGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedGames.map((game) => (
              <div key={game.appid} className="group bg-bg-card border border-border hover:border-accent/30 rounded-xl p-3 transition-all hover:shadow-lg">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-bg-elevated mb-3">
                  <Image 
                    src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
                    alt={game.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized // Headers are already optimized
                  />
                </div>
                <h3 className="text-xs font-bold text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
                  {game.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-text-muted">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-medium">
                    {Math.round(game.playtime_forever / 60)} hs jugadas
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-bg-card/50 border border-border border-dashed rounded-2xl">
            <Library className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <h3 className="text-text-secondary font-medium">No hay juegos para mostrar</h3>
            <p className="text-text-muted text-sm max-w-xs mx-auto mt-2">
              Sincronizá tu biblioteca para ver tus juegos aquí y mejorar tus recomendaciones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
