'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, Plus, LogIn, Loader2, ArrowRight } from 'lucide-react';

export default function GroupModeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState<'create' | 'join' | null>(null);
  const [error, setError] = useState('');

  // Auto-fill code from URL if present
  useEffect(() => {
    const code = searchParams.get('join');
    if (code) {
      setRoomCode(code.toUpperCase());
    }
  }, [searchParams]);

  const createRoom = async () => {
    setLoading('create');
    setError('');
    try {
      const res = await fetch('/api/rooms/create', { method: 'POST' });
      const contentType = res.headers.get('content-type');
      
      if (res.ok && contentType?.includes('application/json')) {
        const data = await res.json();
        if (data.code) {
          router.push(`/grupo/${data.code}`);
        } else {
          setError(data.error || 'Error al crear sala');
        }
      } else {
        const text = await res.text();
        console.error('Create error response:', text);
        setError('Error al crear la sala. Intenta de nuevo.');
      }
    } catch (e) {
      setError('Error de conexión');
    } finally {
      setLoading(null);
    }
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    
    setLoading('join');
    setError('');
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: roomCode.trim().toUpperCase() })
      });
      
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType?.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          router.push(`/grupo/${roomCode.trim().toUpperCase()}`);
        } else {
          setError(data.error || 'Código inválido');
        }
      } else {
        const text = await res.text();
        console.error('Join error response:', text);
        setError('Error en el servidor. Intenta de nuevo.');
      }
    } catch (e) {
      setError('Error de conexión');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6 animate-fade-in">
      {/* Create Section */}
      <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-text-primary">Crear una Sala</h3>
            <p className="text-xs text-text-muted mt-1">Saca el host que llevas dentro e invita a tus amigos.</p>
          </div>
          <button
            onClick={createRoom}
            disabled={!!loading}
            className="w-full py-3 bg-accent hover:bg-accent-light text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading === 'create' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            CREAR NUEVA SALA
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="h-px bg-border flex-1" />
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">O únete a una</span>
        <div className="h-px bg-border flex-1" />
      </div>

      {/* Join Section */}
      <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xl">
        <form onSubmit={joinRoom} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1">Código de Sala</label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="EJ: AB12CD"
                className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-center font-mono text-xl tracking-[0.2em] focus:outline-none focus:border-accent/50 transition-colors uppercase"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!!loading || !roomCode}
            className="w-full py-3 bg-bg-elevated hover:bg-border border border-border text-text-primary font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading === 'join' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            UNIRSE A SALA
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-xs p-3 rounded-xl text-center animate-shake">
          {error}
        </div>
      )}
    </div>
  );
}
