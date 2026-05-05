import { Suspense } from 'react';
import GroupModeClient from './GroupModeClient';
import { Gamepad2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modo Grupo | ¿A qué jugar hoy?',
  description: 'Descubran a qué jugar en grupo. Cada uno vota sus preferencias y el sistema encuentra el juego perfecto para todos.',
};

export default function GroupPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gamepad2 className="w-8 h-8 text-accent" />
          <span className="font-heading text-2xl font-bold text-text-primary">Modo Grupo</span>
        </div>
        <p className="text-text-muted text-sm max-w-md mx-auto">
          ¿No se deciden? Invita a tus amigos, cada uno elige qué tiene ganas de jugar, y nosotros encontramos el juego perfecto para todos.
        </p>
      </div>

      <Suspense fallback={<div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />}>
        <GroupModeClient />
      </Suspense>
    </div>
  );
}
