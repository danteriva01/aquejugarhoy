import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import DonationButton from '@/components/ui/DonationButton';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-accent" />
              <span className="font-heading text-base font-semibold text-text-primary">¿A qué jugar hoy?</span>
            </Link>
            <p className="text-text-muted text-xs leading-relaxed max-w-sm">
              Descubrí tu próximo juego favorito para PC. Recomendaciones personalizadas para cada momento.
            </p>
            <div className="pt-2">
              <DonationButton variant="full" />
            </div>
          </div>

          {/* Explorar */}
          <div>
            <h4 className="font-heading text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Explorar</h4>
            <ul className="space-y-1.5">
              <li><Link href="/explorar" className="text-text-muted text-xs hover:text-text-primary transition-colors">Todos los juegos</Link></li>
              <li><Link href="/explorar?ordering=-added" className="text-text-muted text-xs hover:text-text-primary transition-colors">Tendencias</Link></li>
              <li><Link href="/explorar?tags=free-to-play" className="text-text-muted text-xs hover:text-text-primary transition-colors">Free to Play</Link></li>
              <li><Link href="/explorar?tags=co-op" className="text-text-muted text-xs hover:text-text-primary transition-colors">Cooperativo</Link></li>
            </ul>
          </div>

          {/* Géneros */}
          <div>
            <h4 className="font-heading text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Géneros</h4>
            <ul className="space-y-1.5">
              <li><Link href="/explorar?genres=action" className="text-text-muted text-xs hover:text-text-primary transition-colors">Acción</Link></li>
              <li><Link href="/explorar?genres=role-playing-games-rpg" className="text-text-muted text-xs hover:text-text-primary transition-colors">RPG</Link></li>
              <li><Link href="/explorar?genres=adventure" className="text-text-muted text-xs hover:text-text-primary transition-colors">Aventura</Link></li>
              <li><Link href="/explorar?genres=indie" className="text-text-muted text-xs hover:text-text-primary transition-colors">Indie</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-heading text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Info</h4>
            <ul className="space-y-1.5">
              <li><span className="text-text-muted text-xs">Solo juegos de PC</span></li>
              <li>
                <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-text-muted text-xs hover:text-text-primary transition-colors">
                  Datos de RAWG
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-border">
          <p className="text-text-muted text-[10px]">
            © {new Date().getFullYear()} ¿A qué jugar hoy?. Datos proporcionados por{' '}
            <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-accent-light hover:underline">
              RAWG.io
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
