'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Menu, X, Gamepad2, Compass, Shuffle, UsersRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DonationButton from '@/components/ui/DonationButton';
import SteamLoginButton from '@/components/auth/SteamLoginButton';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-bg-primary/95 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" id="navbar-logo">
            <Gamepad2 className="w-5 h-5 text-accent" />
            <span className="font-heading text-base font-semibold text-text-primary">
              ¿A qué jugar hoy?
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/descubrir"
              className="text-text-muted hover:text-text-primary transition-colors text-sm"
              id="nav-descubrir"
            >
              Descubrir
            </Link>
            <Link
              href="/grupo"
              className="flex items-center gap-1.5 text-accent-light hover:text-accent transition-colors text-sm font-medium"
              id="nav-grupo"
            >
              <UsersRound className="w-3.5 h-3.5" />
              Modo Grupo
            </Link>
            <Link
              href="/explorar"
              className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors text-sm"
              id="nav-explorar"
            >
              <Compass className="w-3.5 h-3.5" />
              Explorar
            </Link>
            <Link
              href="/explorar?tags=free-to-play"
              className="text-text-muted hover:text-text-primary transition-colors text-sm"
              id="nav-ftp"
            >
              Free to Play
            </Link>
            <DonationButton variant="compact" />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/explorar?random=true"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-text-muted text-sm hover:text-text-primary hover:border-border-hover transition-colors"
              id="nav-surprise"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Sorpréndeme
            </Link>
            <SteamLoginButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-text-muted hover:text-text-primary"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-bg-secondary border-t border-border animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link href="/descubrir" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-text-muted hover:text-text-primary text-sm rounded-md hover:bg-bg-card transition-colors">
              Descubrir
            </Link>
            <Link href="/grupo" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-accent-light hover:text-accent text-sm rounded-md hover:bg-bg-card transition-colors font-medium">
              <UsersRound className="w-4 h-4" /> Modo Grupo
            </Link>
            <Link href="/explorar" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-text-muted hover:text-text-primary text-sm rounded-md hover:bg-bg-card transition-colors">
              Explorar
            </Link>
            <Link href="/explorar?tags=free-to-play" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-text-muted hover:text-text-primary text-sm rounded-md hover:bg-bg-card transition-colors">
              Free to Play
            </Link>
            <Link href="/explorar?random=true" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-1.5 px-3 py-2 text-accent-light text-sm rounded-md hover:bg-bg-card transition-colors">
              <Shuffle className="w-3.5 h-3.5" /> Sorpréndeme
            </Link>
            <div className="px-3 py-2 pt-4 border-t border-border mt-2">
              <SteamLoginButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
