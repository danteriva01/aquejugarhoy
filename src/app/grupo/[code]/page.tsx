import { Suspense } from 'react';
import RoomClient from './RoomClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sala de Votación | ¿A qué jugar hoy?',
  description: 'Voten en grupo para decidir qué jugar hoy.',
};

interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-text-muted text-sm font-medium">Cargando sala...</p>
          </div>
        }>
          <RoomClient code={code} />
        </Suspense>
      </div>
    </div>
  );
}
