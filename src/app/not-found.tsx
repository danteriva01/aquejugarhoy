import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <Gamepad2 className="w-14 h-14 text-text-muted mx-auto mb-6" />
        <h1 className="font-heading text-4xl font-bold text-text-primary mb-3">404</h1>
        <h2 className="font-heading text-xl text-text-secondary mb-4">Página no encontrada</h2>
        <p className="text-text-muted text-sm mb-8">
          La página que buscás no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            href="/explorar"
            className="px-6 py-2.5 bg-bg-card border border-border text-text-secondary rounded-xl text-sm font-medium hover:text-text-primary hover:border-accent/40 transition-all"
          >
            Explorar juegos
          </Link>
        </div>
      </div>
    </div>
  );
}
