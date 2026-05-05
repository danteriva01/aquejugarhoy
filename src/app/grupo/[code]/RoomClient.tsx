'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Users, Copy, Check, Play, Gamepad2, 
  ThumbsUp, ThumbsDown, Trophy, RotateCcw, 
  Clock, ArrowRight, Star, ExternalLink,
  ChevronRight, Sparkles, AlertCircle
} from 'lucide-react';
import type { Room, Participant, GameVote, Game } from '@/lib/api/types';
import PriceBadge from '@/components/ui/PriceBadge';
import { translateSteamRating, translateGenre } from '@/lib/utils';

interface RoomClientProps {
  code: string;
}

export default function RoomClient({ code }: RoomClientProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [votingState, setVotingState] = useState<Record<string, 'up' | 'down' | null>>({});

  // Polling to sync state
  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/rooms/${code}`);
      const data = await res.json();
      if (data.code) {
        setRoom(data);
      } else {
        setError('No se pudo encontrar la sala');
      }
    } catch (e) {
      console.error('Polling error:', e);
    }
  }, [code]);

  useEffect(() => {
    fetchRoom();
    const interval = setInterval(fetchRoom, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [fetchRoom]);

  // Get current user steamId from session
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) setCurrentUser(data.user.steamId);
      });
  }, []);

  const copyLink = () => {
    const url = `${window.location.origin}/grupo?join=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const doAction = async (action: string, payload: any = {}) => {
    try {
      const res = await fetch(`/api/rooms/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      const data = await res.json();
      if (data.code) setRoom(data);
    } catch (e) {
      setError('Error al realizar la acción');
    }
  };

  const submitVotes = async () => {
    const votesArray = Object.entries(votingState)
      .filter(([_, value]) => value !== null)
      .map(([gameId, value]) => ({ gameId, value }));
    
    if (votesArray.length < (room?.currentGames.length || 0)) {
      alert('Por favor, vota todos los juegos');
      return;
    }

    await doAction('VOTE', { votes: votesArray });
    setVotingState({});
  };

  if (error) return (
    <div className="bg-error/10 border border-error/20 p-6 rounded-2xl text-center">
      <AlertCircle className="w-8 h-8 text-error mx-auto mb-2" />
      <p className="text-error font-medium">{error}</p>
      <button onClick={() => window.location.href = '/grupo'} className="mt-4 text-sm font-bold underline">Volver</button>
    </div>
  );

  if (!room) return null;

  const isHost = room.hostId === currentUser;
  const me = room.participants.find(p => p.steamId === currentUser);

  // 1. LOBBY STATE
  if (room.status === 'lobby') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-bg-card border border-border rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
          
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-black text-text-primary tracking-tight">¡SALA LISTA!</h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-mono font-bold text-accent tracking-widest">{room.code}</span>
              <button 
                onClick={copyLink}
                className="p-2 hover:bg-bg-elevated rounded-lg transition-colors text-text-muted hover:text-text-primary"
              >
                {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-text-muted text-sm">Comparte el código o el link con tus amigos</p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Participantes ({room.participants.length})</span>
              <Users className="w-3 h-3 text-text-muted" />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {room.participants.map((p) => (
                <div key={p.steamId} className="group relative">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-border group-hover:border-accent transition-all shadow-lg">
                    <Image src={p.avatar} alt={p.name} fill className="object-cover" />
                  </div>
                  <span className="block text-[10px] font-bold text-text-primary mt-2 max-w-[56px] truncate">{p.name}</span>
                  {p.steamId === room.hostId && (
                    <div className="absolute -top-1 -right-1 bg-accent text-[8px] font-black text-white px-1 rounded shadow">HOST</div>
                  )}
                </div>
              ))}
              {[...Array(Math.max(0, 4 - room.participants.length))].map((_, i) => (
                <div key={i} className="w-14 h-14 rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-border/30" />
                </div>
              ))}
            </div>
          </div>

          {isHost ? (
            <button
              onClick={() => doAction('START_VOTING')}
              disabled={room.participants.length < 2}
              className="w-full max-w-xs mx-auto py-4 bg-accent hover:bg-accent-light text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20 disabled:opacity-50 disabled:grayscale"
            >
              <Play className="w-5 h-5 fill-current" />
              EMPEZAR PARTIDA
            </button>
          ) : (
            <div className="bg-bg-elevated p-4 rounded-2xl border border-border/50 animate-pulse">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Esperando al host para empezar...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. SELECTING TYPE STATE
  if (room.status === 'selecting_type') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading font-black text-text-primary">PRE-FILTRO</h2>
          <p className="text-text-muted text-sm">El host está eligiendo qué tipo de juego buscan hoy</p>
        </div>

        {isHost ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'cooperativo', label: 'COOPERATIVO', desc: 'Jugar juntos contra el juego', color: 'bg-accent' },
              { id: 'competitivo', label: 'COMPETITIVO', desc: 'Darse masa entre ustedes', color: 'bg-error' },
              { id: 'party', label: 'PARTY', desc: 'Juegos rápidos y divertidos', color: 'bg-success' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => doAction('SELECT_TYPE', { type: type.id })}
                className="group relative h-48 bg-bg-card border border-border rounded-3xl p-6 text-center space-y-4 hover:border-accent transition-all overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${type.color}`} />
                <div className="text-3xl mb-2 opacity-50 group-hover:scale-125 transition-transform">
                  {type.id === 'cooperativo' ? '🤝' : type.id === 'competitivo' ? '⚔️' : '🎉'}
                </div>
                <h3 className="font-heading font-black text-text-primary tracking-tight">{type.label}</h3>
                <p className="text-xs text-text-muted">{type.desc}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-50 grayscale">
             {/* Skeletons for non-hosts */}
             {[1, 2, 3].map(i => (
               <div key={i} className="h-48 bg-bg-card border border-border rounded-3xl" />
             ))}
          </div>
        )}
      </div>
    );
  }

  // 3. VOTING STATE
  if (room.status === 'voting') {
    const hasIVoted = me?.hasVoted;
    const allVotedCount = room.participants.filter(p => p.hasVoted).length;

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between bg-bg-card border border-border px-6 py-4 rounded-3xl shadow-xl sticky top-20 z-30 backdrop-blur-xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">RONDA {room.round}</span>
            <h2 className="text-lg font-heading font-bold text-text-primary">¿Cuál prefieres?</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-text-muted uppercase">Votos listos</span>
              <span className="text-sm font-black text-text-primary">{allVotedCount} / {room.participants.length}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent animate-pulse" />
            </div>
          </div>
        </div>

        {hasIVoted ? (
          <div className="bg-bg-card border border-border rounded-3xl p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-text-primary">¡VOTO ENVIADO!</h3>
            <p className="text-text-muted max-w-xs mx-auto text-sm">
              Esperando a que el resto de los participantes termine de elegir. 
              La siguiente ronda comenzará automáticamente.
            </p>
            <div className="flex justify-center gap-2">
              {room.participants.map(p => (
                <div key={p.steamId} className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all ${p.hasVoted ? 'border-success' : 'border-border grayscale opacity-50'}`}>
                  <Image src={p.avatar} alt={p.name} width={32} height={32} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {room.currentGames.map((game) => (
              <div key={game.id} className="group relative bg-bg-card border border-border rounded-3xl overflow-hidden hover:border-accent transition-all duration-300 flex flex-col h-full shadow-lg">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image 
                    src={game.steamAppId ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.steamAppId}/header.jpg` : (game.background_image ?? '')} 
                    alt={game.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <h3 className="font-heading font-bold text-text-primary text-base line-clamp-1 group-hover:text-accent transition-colors">
                    {game.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {game.genres.slice(0, 2).map((g: any) => (
                      <span key={g.id} className="px-2 py-0.5 bg-bg-elevated text-[10px] text-text-muted rounded-md uppercase font-bold tracking-wider">
                        {translateGenre(g.name)}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/30">
                    <PriceBadge {...game.priceInfo} size="sm" />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setVotingState(s => ({ ...s, [game.slug]: s[game.slug] === 'down' ? null : 'down' }))}
                        className={`p-3 rounded-2xl border-2 transition-all ${votingState[game.slug] === 'down' ? 'bg-error/20 border-error text-error' : 'bg-bg-elevated border-border text-text-muted hover:text-error hover:border-error/30'}`}
                      >
                        <ThumbsDown className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setVotingState(s => ({ ...s, [game.slug]: s[game.slug] === 'up' ? null : 'up' }))}
                        className={`p-3 rounded-2xl border-2 transition-all ${votingState[game.slug] === 'up' ? 'bg-success/20 border-success text-success' : 'bg-bg-elevated border-border text-text-muted hover:text-success hover:border-success/30'}`}
                      >
                        <ThumbsUp className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Float Action Button to Submit */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
              <button
                onClick={submitVotes}
                className="px-8 py-4 bg-accent hover:bg-accent-light text-white font-black rounded-full shadow-2xl shadow-accent/40 flex items-center gap-3 border-4 border-bg-primary ring-1 ring-accent/50"
              >
                ENVIAR MIS VOTOS
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. FINISHED STATE
  if (room.status === 'finished' && room.winner) {
    const winner = room.winner;
    return (
      <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-accent/20 rounded-3xl flex items-center justify-center mx-auto animate-bounce shadow-xl">
            <Trophy className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-4xl font-heading font-black text-text-primary tracking-tight">¡HABEMUS JUEGO!</h2>
          <p className="text-text-muted">La mayoría ha decidido. Es hora de jugar a:</p>
        </div>

        <div className="bg-bg-card border-4 border-accent rounded-[32px] overflow-hidden shadow-2xl animate-scale-in">
          <div className="relative aspect-video">
            <Image 
              src={winner.steamAppId ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${winner.steamAppId}/header.jpg` : (winner.background_image ?? '')} 
              alt={winner.name} 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
            <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">GANADOR</div>
          </div>
          
          <div className="p-8 space-y-6 text-center">
            <h3 className="text-3xl font-heading font-black text-text-primary">{winner.name}</h3>
            
            <div className="flex flex-wrap justify-center gap-2">
              {winner.genres.map((g: any) => (
                <span key={g.id} className="px-3 py-1 bg-bg-elevated text-xs text-text-muted rounded-full border border-border">
                  {translateGenre(g.name)}
                </span>
              ))}
            </div>

            <div className="bg-bg-elevated/50 p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-center gap-2 text-accent-light">
                 <Sparkles className="w-5 h-5" />
                 <span className="text-sm font-bold uppercase tracking-wider">{translateSteamRating(winner.priceInfo?.steamRatingText)}</span>
              </div>
              <p className="text-xs text-text-muted italic">"{winner.description_raw?.slice(0, 150)}..."</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href={winner.priceInfo?.dealUrl || `https://store.steampowered.com/app/${winner.steamAppId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 bg-accent hover:bg-accent-light text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                IR A STEAM <ExternalLink className="w-4 h-4" />
              </a>
              {isHost && (
                <button 
                  onClick={() => doAction('RESTART')}
                  className="flex-1 py-4 bg-bg-elevated hover:bg-border border border-border text-text-primary font-black rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  OTRA VUELTA <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
